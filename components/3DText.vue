<template>
  <div class="awesome-text-box" @mousemove="handleMousemove">
    <canvas></canvas>
  </div>
</template>

<script>
// thanks https://codepen.io/funxer/pen/KBmRoZ
let canvas
let ctx
const layers = 4
let size = 0
let particles = []
let targets = []
const lerp = (t, v0, v1) => (1 - t) * v0 + t * v1
const fov = 2000
const viewDistance = 200
let targetRotationY = 0.5
let targetRotationX = 0.5
let rotationY = 0.5
let rotationX = 0.5
const speed = 40
let animFrame
let gap

class Vector3 {
  constructor(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
  }

  static fromScreenCoords(_x, _y, z = 0) {
    const factor = fov / viewDistance
    const x = (_x - canvas.width / 2) / factor
    const y = (_y - canvas.height / 2) / factor

    return new Vector3(x, y, z)
  }

  rotateX(angle) {
    const z = this.z * Math.cos(angle) - this.x * Math.sin(angle)
    const x = this.z * Math.sin(angle) + this.x * Math.cos(angle)
    return new Vector3(x, this.y, z)
  }

  rotateY(angle) {
    const y = this.y * Math.cos(angle) - this.z * Math.sin(angle)
    const z = this.y * Math.sin(angle) + this.z * Math.cos(angle)
    return new Vector3(this.x, y, z)
  }

  pp() {
    const factor = fov / (viewDistance + this.z)
    const x = this.x * factor + canvas.width / 2
    const y = this.y * factor + canvas.height / 2
    return new Vector3(x, y, this.z)
  }
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  for (let i = 0; i < speed; i++) {
    if (targets.length > 0) {
      const target = targets[0]
      const x = (canvas.width / 2) + target.x * 10
      const y = canvas.height / 2
      const z = -10

      const position = Vector3.fromScreenCoords(x, y, z)
      const interpolant = 0

      particles.push({ position, target, interpolant })
      targets.splice(0, 1)
    }
  }

  particles
    .sort((pa, pb) => pb.target.z - pa.target.z)
    .forEach((p, i) => {
      if (p.interpolant < 1) {
        p.interpolant = Math.min(p.interpolant + 0.01, 1)
        p.position.x = lerp(p.interpolant, p.position.x, p.target.x)
        p.position.y = lerp(p.interpolant, p.position.y, p.target.y)
        p.position.z = lerp(p.interpolant, p.position.z, p.target.z)
      }
      rotationX = lerp(0.00001, rotationX, targetRotationX)
      rotationY = lerp(0.00001, rotationY, targetRotationY)
      const particle = p.position
        .rotateX(rotationX)
        .rotateY(rotationY)
        .pp()

      const s = 1 - (p.position.z / layers)
      ctx.fillStyle = p.target.z === 0
        ? 'rgb(114, 204, 255)'
        : `rgba(242, 101, 49, ${s})`

      ctx.fillRect(particle.x, particle.y, s * size, s * size)
    })

  animFrame = requestAnimationFrame(loop)
}

export default {
  name: 'AwesomeText',
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  computed: {
    boxWidth() {
      return this.$el.offsetWidth
    },
    boxHeight() {
      return this.$el.offsetHeight
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    handleMousemove(e) {
      const halfHeight = this.boxHeight / 2
      const halfWidth = this.boxWidth / 2
      targetRotationY = (e.clientY - halfHeight) / this.boxHeight
      targetRotationX = (e.clientX - halfWidth) / this.boxWidth
    },
    /**
     * 获取文字的像素信息
     * @returns {ImageData}
     */
    getTextPoints() {
      let fontSize = 150
      const text = this.text
      const c = document.createElement('canvas')
      const cx = c.getContext('2d')
      cx.font = `900 ${fontSize}px Arial`
      let w = cx.measureText(text).width
      const h = fontSize * 1.5
      gap = 7

      // 自适应字体大小
      while (w > this.boxWidth * 0.8) {
        fontSize -= 1
        cx.font = `900 ${fontSize}px Arial`
        w = cx.measureText(text).width
      }
      if (fontSize < 100) gap = 6
      if (fontSize < 70) gap = 4
      if (fontSize < 40) gap = 2
      size = Math.max(gap / 2, 1)
      c.width = w
      c.height = h
      this.startX = Math.floor(this.startX - w / 2)
      this.startY = Math.floor(this.startY - h / 2)
      cx.fillStyle = '#000'
      cx.font = `900 ${fontSize}px Arial`
      cx.fillText(text, 0, fontSize)
      return cx.getImageData(0, 0, w, h)
    },
    init() {
      this.startX = this.boxWidth / 2
      this.startY = this.boxHeight / 2
      canvas = this.$el.querySelector('canvas')
      canvas.width = this.boxWidth
      canvas.height = this.boxHeight
      ctx = canvas.getContext('2d')
      cancelAnimationFrame(animFrame)
      particles = []
      targets = []
      const data = this.getTextPoints()
      for (let i = 0; i < data.data.length; i += 4) {
        const rw = data.width * 4
        const x = this.startX + Math.floor((i % rw) / 4)
        const y = this.startY + Math.floor(i / rw)

        if (data.data[i + 3] > 0 && x % gap === 0 && y % gap === 0) {
          for (let j = 0; j < layers; j++) {
            targets.push(Vector3.fromScreenCoords(x, y, j))
          }
        }
      }

      targets = targets.sort((a, b) => a.x - b.x)
      loop()
      return false
    }
  }
}
</script>

<style lang="scss">
  .awesome-text-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>
