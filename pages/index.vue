<template>
  <div class="my-main-page" v-html="textDom"></div>
</template>

<script>
import anime from 'animejs/lib/anime.es'

export default {
  name: 'MyToolWeb',
  data() {
    return {
      text: '欢迎大家来到我的网站，这是我的个人娱乐用网站，将来说不定会有很多好玩的东西，虽然现在很简陋，但我保证以后也好看不到哪里去，哈哈'
    }
  },
  computed: {
    textDom() {
      return [...this.text].map(v => `<span class="ani-text">${v}</span>`).join('')
    }
  },
  mounted() {
    this.go()
  },
  methods: {
    go() {
      anime({
        targets: this.$el.querySelectorAll('.ani-text'),
        opacity: 1,
        scale: [1, 1.2, 1],
        delay: anime.stagger(200)
      })
    }
  }
}
</script>

<style lang="scss">
  .my-main-page {
    padding: 20px;
  }

  .ani-text {
    opacity: 0;
    display: inline-block;
    margin-right: 4px;
    font-size: 14px;
  }
</style>
