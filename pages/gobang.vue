<template>
  <div>
    <gobang ref="gobang"></gobang>
    <a-button @click="restartGame">
      重新开始
    </a-button>
  </div>
</template>

<script>
import gobang from '~/components/gobang'

export default {
  name: 'GoBang',
  components: { gobang },
  data() {
    return {}
  },
  computed: {
    gobang() {
      return this.$refs.gobang
    }
  },
  methods: {
    restartGame() {
      this.gobang.restart()
    }
  }
}
</script>

<style lang="scss"></style>
