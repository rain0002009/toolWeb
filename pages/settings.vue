<template>
  <a-form class="page-setting" :form="form" @submit="handleSubmit">
    <a-form-item label="开启背景">
      <a-switch v-model="background.enable"></a-switch>
    </a-form-item>
    <a-form-item label="网站背景">
      <a-textarea
        v-model="background.data"
        size="large"
        :rows="5"
        placeholder="访问 https://css-doodle.com 获取更多信息"
      ></a-textarea>
    </a-form-item>
    <p>提示: 本站采用css-doodle <a href="https://css-doodle.com/">https://css-doodle.com/</a></p>
    <a-button html-type="submit">
      完成
    </a-button>
  </a-form>
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'WebSettings',
  data() {
    return {
      form: this.$form.createForm(this),
      background: {
        enable: false,
        data: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      getBackground: 'settings/getBackground'
    })
  },
  watch: {
    getBackground: {
      deep: true,
      immediate: true,
      handler(value) {
        _.assign(this.background, value)
      }
    }
  },
  methods: {
    ...mapMutations({
      setBackground: 'settings/setBackground'
    }),
    handleSubmit(e) {
      e && e.preventDefault()
      this.setBackground(this.background)
    }
  }
}
</script>

<style lang="scss">
  .page-setting {
    padding: 20px 40px 0;
  }
</style>
