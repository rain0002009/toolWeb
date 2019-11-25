<template>
  <div class="my-main-page">
    <AwesomeText text="欢迎" />
  </div>
</template>

<script>
import Text from '~/components/3DText'

export default {
  name: 'MyToolWeb',
  components: {
    AwesomeText: Text
  },
  data () {
    return {}
  },
  computed: {
    textDom () {
      return [...this.text].map(v => `<span class="ani-text">${v}</span>`).join('')
    }
  },
  mounted () {},
  methods: {}
}
</script>

<style lang="scss">
  .my-main-page {
    position: relative;
    height: 100%;
  }

  .ani-text {
    opacity: 0;
    display: inline-block;
    margin-right: 4px;
    font-size: 14px;
  }
</style>
