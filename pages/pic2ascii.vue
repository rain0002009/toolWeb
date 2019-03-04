<template>
  <div class="pic-ascii">
    <a-form class="img-input" :form="form" @submit="handleSubmit">
      <a-form-item>
        <a-input v-decorator="['imgUrl', {rules: [{type: 'url'}]}]">
          <a-upload slot="prefix" class="avatar-uploader" :show-upload-list="false" @change="handleChange">
            <a-icon type="upload" />
          </a-upload>
        </a-input>
      </a-form-item>
    </a-form>
    <div class="control-box">
      <a-radio-group v-model="outputType" default-value="canvas" button-style="solid">
        <a-radio-button value="canvas">
          canvas
        </a-radio-button>
        <a-radio-button value="html">
          html
        </a-radio-button>
      </a-radio-group>
    </div>
    <div class="ascii-box">
      <canvas v-show="outputType === 'canvas'" ref="canvas">
        您的浏览器不支持canvas
      </canvas>
      <pre v-show="outputType === 'html'" class="html-result-box" v-text="asciiHtml"></pre>
    </div>
  </div>
</template>

<script>
const DEFAULT_AVAILABLE_TEXTS = '@#&$%863!i1uazvno~;*^+-—. ' // 默认字符集
const MAX_COLOR_PIXELS = 255
let activeText = '' // 当前字符集
const SWEEP_INTERVAL = 6 // 原图像取点扫描间隔
const GAP_X = 1 // 字符间隔
const GAP_Y = 4 // 字符间隔

function getBase64(img) {
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
function rgbToGray(r, g, b) {
  return (299 * r + 587 * g + 114 * b + 500) / 1000
}

/**
 * 灰度值转字符串
 * @param gray
 * @param texts
 * @returns {string}
 */
function grayToText(gray, texts = DEFAULT_AVAILABLE_TEXTS) {
  activeText = texts
  const grayGap = MAX_COLOR_PIXELS / activeText.length
  let textIndex = (gray / grayGap) >> 0
  if (textIndex >= activeText.length) {
    textIndex = activeText.length - 1
  }
  return activeText[textIndex]
}

export default {
  name: 'PIC2ASCII',
  components: {},
  data() {
    return {
      form: this.$form.createForm(this),
      ctx: null,
      outputType: 'canvas',
      asciiHtml: ''
    }
  },
  computed: {
    canvas() {
      return this.$refs.canvas
    }
  },
  mounted() {
    this.initCanvas()
  },
  methods: {
    handleSubmit(e) {
      e && e.preventDefault()
      this.form.validateFields((error) => {
        if (!error) {
          this.getImgByUrl(this.form.getFieldsValue().imgUrl)
        }
      })
    },
    initCanvas() {
      this.ctx = this.canvas.getContext('2d')
    },
    drawCanvas(imgElement) {
      const FONT_SIZE = this.ctx.measureText([0]).width // 字体的真是宽度
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
          this.ctx.fillText(text, x, y)
          p += text
        }
        p += '\n'
        this.asciiHtml += p
      }
    },
    getImgByUrl(url, texts = DEFAULT_AVAILABLE_TEXTS) {
      activeText = texts
      const img = new Image()
      img.src = url
      img.addEventListener('load', () => {
        if (url.match('data:image/')) {
          this.drawCanvas(img)
        } else {
          this.$socket.emit('get img', url, res => this.getImgByUrl(res))
        }
      })
    },
    async handleChange(info) {
      if (info.file.status === 'done') {
        const imgData = await getBase64(info.file.originFileObj)
        this.getImgByUrl(imgData)
      }
    }
  }
}
</script>

<style lang="scss">
  .pic-ascii {
    .img-input {
      margin-top: 50px;
      display: flex;
      justify-content: center;

      .ant-form-item {
        width: 40%;
      }
    }

    .avatar-uploader {
      margin-top: 20px;
      width: 128px;
      height: 128px;
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

    .html-result-box {
      line-height: 1;
      overflow: visible;
      font-size: 12px;
      padding: 0 20px;
    }
  }
</style>
