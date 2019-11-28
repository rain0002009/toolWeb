<template>
  <a-form class="page-setting" :form="form" @submit="handleSubmit">
    <a-form-item label="chrome devtools-protocol url">
      <a-tooltip placement="topLeft">
        <template slot="title">
          <span>在chrome主目录 运行 chrome --headless --remote-debugging-port=9222</span>
        </template>
        <a-input v-model="config.browserURL" placeholder="http://localhost:9222" />
      </a-tooltip>
    </a-form-item>
    <a-form-item label="开启背景">
      <a-switch v-model="config.background.enable" />
    </a-form-item>
    <a-form-item label="网站背景">
      <a-textarea
        v-model="config.background.data"
        size="large"
        :rows="5"
        placeholder="访问 https://css-doodle.com 获取更多信息"
      />
    </a-form-item>
    <p>提示: 本站采用css-doodle <a href="https://css-doodle.com/">https://css-doodle.com/</a></p>
    <a-button html-type="submit">
      完成
    </a-button>
  </a-form>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import _ from 'lodash'
import { mapGetters, mapMutations } from 'vuex'

@Component({
  data () {
    return {
      form: this.$form.createForm(this)
    }
  },
  computed: {
    ...mapGetters({
      getConfig: 'settings/getConfig'
    })
  },
  methods: {
    ...mapMutations({
      setConfig: 'settings/setConfig'
    })
  }
})
export default class WebSettings extends Vue {
  setConfig
  getConfig
  config = {
    browserURL: '',
    background: {
      enable: false,
      data: ''
    }
  }

  handleSubmit (e) {
    e && e.preventDefault()
    this.setConfig(this.config)
  }

  created () {
    _.assign(this.config.background, this.getConfig)
  }
}
</script>

<style lang="scss">
  .page-setting {
    padding: 20px 40px 0;
  }
</style>
