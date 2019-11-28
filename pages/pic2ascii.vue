<template>
  <div class="pic-ascii">
    <a-form class="img-input" :form="form" layout="inline" @submit="handleSubmit">
      <a-form-item>
        <a-input v-decorator="['imgUrl', {rules: [{type: 'url'}]}]">
          <a-upload slot="prefix" class="avatar-uploader" :show-upload-list="false" @change="handleChange">
            <a-icon type="upload" />
          </a-upload>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button html-type="submit">
          GO
        </a-button>
      </a-form-item>
    </a-form>

    <div class="control-box">
      <span>需要颜色</span>
      <a-switch v-model="needColor" />
      <a-radio-group v-model="outputType" default-value="canvas" button-style="solid">
        <a-radio-button value="canvas">
          canvas
        </a-radio-button>
        <a-radio-button value="html">
          html
        </a-radio-button>
      </a-radio-group>

      <div class="slider-box">
        <span>扫描精度(越小精度越高)</span>
        <a-slider v-model="sweepInterval" :max="40" :min="4" />
      </div>
    </div>
    <div class="ascii-box">
      <canvas v-show="outputType === 'canvas'" ref="canvas">
        您的浏览器不支持canvas
      </canvas>
      <pre v-show="outputType === 'html'" v-safe-html="asciiHtml" class="html-result-box" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator'

const DEFAULT_AVAILABLE_TEXTS = '@#&$%863!i1uazvno~;*^+-—. ' // 默认字符集
const MAX_COLOR_PIXELS = 255
let activeText = '' // 当前字符集
const GAP_X = 1 // 字符间隔
const GAP_Y = 4 // 字符间隔

function getBase64 (img) {
  const reader = new FileReader()
  return new Promise((resolve) => {
    reader.addEventListener('load', () => resolve(reader.result))
    reader.readAsDataURL(img)
  })
}

/**
 * rgb转灰度值
 * @param r
 * @param g
 * @param b
 * @returns {number}
 */
function rgbToGray (r, g, b) {
  return (299 * r + 587 * g + 114 * b + 500) / 1000
}

/**
 * 灰度值转字符串
 * @param gray
 * @param texts
 * @returns {string}
 */
function grayToText (gray, texts = DEFAULT_AVAILABLE_TEXTS) {
  activeText = texts
  const grayGap = MAX_COLOR_PIXELS / activeText.length
  let textIndex = (gray / grayGap) >> 0
  if (textIndex >= activeText.length) {
    textIndex = activeText.length - 1
  }
  return activeText[textIndex]
}

@Component
export default class PIC2ASCII extends Vue {
  sweepInterval = 12
  needColor = false
  ctx
  outputType = 'canvas'
  asciiHtml = ''

  @Ref() readonly canvas!:HTMLCanvasElement
  get form (this:Vue) {
    return this.$form.createForm(this)
  }

  handleSubmit (e) {
    e && e.preventDefault()
    this.form.validateFields((error) => {
      if (!error) {
        this.getImgByUrl(this.form.getFieldsValue().imgUrl)
      }
    })
  }

  initCanvas () {
    this.ctx = this.canvas.getContext('2d')
  }

  drawCanvas (imgElement) {
    const SWEEP_INTERVAL = this.sweepInterval
    const FONT_SIZE = this.ctx.measureText([0]).width // 字体的真实宽度
    const width = imgElement.width
    const height = imgElement.height
    const minSize = Math.min(Math.max(width, height, 900), 1200)
    const scale = Math.max(minSize / width, minSize / height)
    this.canvas.width = width * scale
    this.canvas.height = height * scale
    this.ctx.drawImage(imgElement, 0, 0, width, height, 0, 0, this.canvas.width, this.canvas.height)
    const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
    const imgDataArr = imgData.data
    const imgDataWidth = imgData.width
    const imgDataHeight = imgData.height
    this.ctx.clearRect(0, 0, imgDataWidth, imgDataHeight)
    this.asciiHtml = ''
    let w, h, x, y
    this.canvas.width = (imgDataWidth / SWEEP_INTERVAL + 1) * (FONT_SIZE + GAP_X)
    this.canvas.height = (imgDataHeight / SWEEP_INTERVAL + 1) * (FONT_SIZE + GAP_Y)
    this.ctx.font = '12px/1 "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace'
    for (h = 0, y = FONT_SIZE + GAP_Y; h < imgDataHeight; h += SWEEP_INTERVAL, y += FONT_SIZE + GAP_Y) {
      let p = ''
      for (w = 0, x = 0; w < imgDataWidth; w += SWEEP_INTERVAL, x += FONT_SIZE + GAP_X) {
        const index = (w + imgDataWidth * h) * 4
        const r = imgDataArr[index]
        const g = imgDataArr[index + 1]
        const b = imgDataArr[index + 2]
        const text = grayToText(rgbToGray(r, g, b))
        this.needColor && (this.ctx.fillStyle = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1))
        this.ctx.fillText(text, x, y)
        p += this.needColor ? `<span style="color: rgb(${r},${g},${b})">${text}</span>` : text
      }
      p += '\n'
      this.asciiHtml += p
    }
  }

  getImgByUrl (url, texts = DEFAULT_AVAILABLE_TEXTS) {
    if (!url.match('data:image/')) {
      return this.$socket.emit('get img', url, res => this.getImgByUrl(res))
    }
    activeText = texts
    const img = new Image()
    img.src = url
    img.addEventListener('load', () => {
      this.drawCanvas(img)
    })
  }

  async handleChange (info) {
    if (info.file.status === 'done') {
      const imgData = await getBase64(info.file.originFileObj)
      this.getImgByUrl(imgData)
    }
  }

  mounted () {
    this.initCanvas()
  }
}
</script>

<style lang="scss">
  .pic-ascii {
    .img-input {
      text-align: center;
      margin-top: 50px;
      margin-bottom: 20px;

      .ant-form-item {
        margin-right: 0;
      }
    }

    .avatar-uploader {
    }

    .control-box {
      text-align: center;
    }

    .ascii-box {
      display: flex;
      justify-content: center;
      margin-top: 20px;

      canvas {
        display: block;
      }
    }

    .slider-box {
      margin-top: 20px;
      padding: 0 40%;
    }

    .html-result-box {
      line-height: 1;
      overflow: visible;
      font-size: 12px;
      padding: 0 20px;
    }
  }
</style>
