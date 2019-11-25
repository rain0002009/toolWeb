<template>
  <div class="awesome-audio" />
</template>

<script>
import MusicPlayer from '~/components/audio'

const AUDIO_URL = 'http://dl.stream.qqmusic.qq.com/M500003OLo9i1O0BhW.mp3?vkey=82D2035054CFF1F26CC101111A7F5EFE17253C4E4DC587038342CCAF618EB976617A9D55F2A361DBA99ABAC2076C2A5B402B25D16829D350&guid=5150825362&fromtag=1'
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
