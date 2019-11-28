<template>
  <div class="awesome-audio" />
</template>

<script>
import MusicPlayer from '~/components/audio'

const AUDIO_URL = 'http://isure.stream.qqmusic.qq.com/C100001ZudDx0GBzQH.m4a?fromtag=32'
const canvas = document.createElement('canvas')
let drawAnimation
let isMusicEnd = false

const player = new MusicPlayer()
const bufferLength = player.analyser.frequencyBinCount
export default {
  name: 'XAudio',
  mounted () {
    this.initCanvas()
    this.getAudio()
  },
  methods: {
    getAudio () {
      this.$socket.emit('get audio', AUDIO_URL, (res) => {
        player.decodeAudio(res)
      }, (error) => {
        this.$message.error(error)
      })
      player.ready(() => {
        player.play()
        isMusicEnd = false
        this.draw()
      })
      player.source.addEventListener('ended', () => {
        isMusicEnd = true
      })
    },
    initCanvas () {
      this.ctx = canvas.getContext('2d')
      canvas.width = this.$el.offsetWidth
      canvas.height = this.$el.offsetHeight
      this.$el.appendChild(canvas)
      this.draw()
    },
    draw () {
      drawAnimation = requestAnimationFrame(this.draw)
      isMusicEnd && cancelAnimationFrame(drawAnimation)

      player.getData()

      this.ctx.fillStyle = 'rgb(0, 0, 0)'
      this.ctx.fillRect(0, 0, canvas.width, canvas.height)

      const barWidth = (canvas.width / bufferLength) * 2.5
      let barHeight
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        barHeight = player.dataArray[i]

        this.ctx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,150)'
        this.ctx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2)

        x += barWidth + 1
      }
    }
  }
}
</script>

<style lang="scss">
  .awesome-audio {
    height: 100%;
    overflow: hidden;
  }
</style>
