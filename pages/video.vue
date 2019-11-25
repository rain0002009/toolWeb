<template>
  <div class="my-video-page">
    <div class="my-video-box">
      <video
        class="video-js vjs-default-skin vjs-big-play-centered"
        controls
        preload="none"
      />
    </div>
    <div class="search-box">
      <a-input-search
        enter-button
        @search="onSearch"
      />
    </div>
  </div>
</template>

<script>
import VideoJs from 'video.js'
import 'videojs-flash'
import 'video.js/dist/video-js.min.css'

let player = null
export default {
  name: 'MyVideo',
  mounted () {
    this.initVideo()
  },
  methods: {
    onSearch (url) {
      player.src(url)
      setTimeout(() => {
        player.play()
      }, 0)
    },
    initVideo () {
      player = player || VideoJs(this.$el.querySelector('video'), {
        liveui: true,
        width: window.innerWidth / 1.8,
        height: window.innerHeight / 2,
        techOrder: ['flash', 'html5']
      })
    }
  }
}
</script>

<style lang="scss">
  .my-video-page {
    .my-video-box {
      display: flex;
      justify-content: center;

      .video-js {
        margin-top: 40px;
      }
    }

    .search-box {
      margin-top: 20px;
      padding: 0 20%;
    }
  }
</style>
