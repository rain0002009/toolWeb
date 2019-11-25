<template>
  <div>
    <gobang ref="gobang" :game-end-callback="gameEndCallback" />
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
  data () {
    return {}
  },
  computed: {
    gobang () {
      return this.$refs.gobang
    }
  },
  methods: {
    gameEndCallback (instance) {
      if (instance) {
        this.$message.info(`${instance.color} win`)
      } else {
        this.$message.info('平局')
      }
    },
    restartGame () {
      this.gobang.restart()
    }
  }
}
</script>
