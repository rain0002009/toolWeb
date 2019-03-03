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
      <pre v-show="outputType === 'html'" class="html-result-box" v-html="asciiHtml"></pre>
    </div>
  </div>
</template>

<script>
const DEFAULT_AVAILABLE_TEXTS = '@#&$%863!i1uazvno~;*^+-. '
const MAX_COLOR_PIXELS = 255

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
  const grayGap = MAX_COLOR_PIXELS / texts.length
  let textIndex = (gray / grayGap) >> 0
  if (textIndex >= texts.length) {
    textIndex = texts.length - 1
  }
  return texts[textIndex]
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
      const width = imgElement.width
      const height = imgElement.height
      const minWidth = width >= 900 ? width : 900
      const minHeight = height >= 900 ? height : 900
      const scale = Math.max(minWidth / width, minHeight / height)
      this.canvas.width = width * scale
      this.canvas.height = height * scale
      this.ctx.drawImage(imgElement, 0, 0, width, height, 0, 0, this.canvas.width, this.canvas.height)
      const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
      const imgDataArr = imgData.data
      const imgDataWidth = imgData.width
      const imgDataHeight = imgData.height
      this.ctx.clearRect(0, 0, imgDataWidth, imgDataHeight)
      this.asciiHtml = ''
      for (let h = 0; h < imgDataHeight; h += 12) {
        let p = ''
        for (let w = 0; w < imgDataWidth; w += 6) {
          const index = (w + imgDataWidth * h) * 4
          const r = imgDataArr[index]
          const g = imgDataArr[index + 1]
          const b = imgDataArr[index + 2]
          const text = grayToText(rgbToGray(r, g, b))
          this.ctx.fillText(text, w, h + 8)
          p += text
        }
        p += '\n'
        this.asciiHtml += p
      }
    },
    getImgByUrl(url) {
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
      margin-top: 20px;
      letter-spacing: 1px;
      font-size: 12px;
      padding: 0 20px;
    }
  }
</style>
