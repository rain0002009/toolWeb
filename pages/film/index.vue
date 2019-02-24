<template>
  <div class="film">
    <a-progress :percent="percent" />
    <a-input-search
      placeholder="请输入电影名"
      enter-button
      @search="onSearch"
    />
    <a-button @click="addFilmVisible = true">
      添加源
    </a-button>
    <ul>
      <li v-for="film in films" :key="film.link">
        <a :href="film.link" target="_blank">{{ film.title }}</a>
      </li>
    </ul>

    <a-modal
      title="添加源"
      :visible="addFilmVisible"
      @ok="handleAddFilm"
      @cancel="addFilmVisible = false"
    >
      <a-form :form="form" @submit="handleSubmitAddFilm">
        <a-form-item label="网址" :label-col="formItemCol.label" :wrapper-col="formItemCol.wrapper">
          <a-input v-decorator="['url', {rules: [{type: 'url'},{required: true}]}]" placeholder="请输入网址" />
        </a-form-item>

        <a-form-item label="网站请求类型：" :label-col="formItemCol.label" :wrapper-col="formItemCol.wrapper">
          <a-radio-group
            v-decorator="['type', {initialValue: 'ajax', rules: [{required: true}]}]"
            name="type"
            @input="(type)=>formData.type=type"
          >
            <a-radio-button value="ajax">
              ajax
            </a-radio-button>
            <a-radio-button value="html">
              html
            </a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item
          v-if="formData.type === 'html'"
          label="查询字符串"
          :label-col="formItemCol.label"
          :wrapper-col="formItemCol.wrapper"
        >
          <a-input
            v-decorator="['q', {rules: [{required: true}]}]"
            placeholder="如：?q=#keyWord#"
          />
        </a-form-item>

        <a-form-item label="结果检测规则" :label-col="formItemCol.label" :wrapper-col="formItemCol.wrapper">
          <a-textarea
            v-decorator="['hasResCheck', {rules: [{required: true}]}]"
            placeholder="如：return page.$eval('#counts', el => +el.innerText)"
          />
        </a-form-item>

        <a-form-item label="是否需要host：" :label-col="formItemCol.label" :wrapper-col="formItemCol.wrapper">
          <a-radio-group
            v-decorator="['needHost', {initialValue: false, rules: [{required: true}]}]"
            name="needHost"
          >
            <a-radio-button :value="true">
              是
            </a-radio-button>
            <a-radio-button :value="false">
              否
            </a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="是否进行筛选：" :label-col="formItemCol.label" :wrapper-col="formItemCol.wrapper">
          <a-radio-group
            v-decorator="['needFilter', {initialValue: false, rules: [{required: true}]}]"
            name="needFilter"
          >
            <a-radio-button :value="true">
              是
            </a-radio-button>
            <a-radio-button :value="false">
              否
            </a-radio-button>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="列表选择器" :label-col="formItemCol.label" :wrapper-col="formItemCol.wrapper">
          <a-input
            v-decorator="['filmListQuery', {rules: [{required: true}]}]"
            placeholder="如：.movie-list"
            style="margin-top: 10px;"
          />
        </a-form-item>

        <a-form-item label="链接选择器" :label-col="formItemCol.label" :wrapper-col="formItemCol.wrapper">
          <a-input
            v-decorator="['linkQuery', {rules: [{required: true}]}]"
            placeholder="如：a"
            style="margin-top: 10px;"
          />
        </a-form-item>

        <a-form-item label="标题选择器" :label-col="formItemCol.label" :wrapper-col="formItemCol.wrapper">
          <a-input
            v-decorator="['titleQuery', {rules: [{required: true}]}]"
            placeholder="如：a"
            style="margin-top: 10px;"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import io from 'socket.io-client'
import AFormItem from 'ant-design-vue/es/form/FormItem'

export default {
  name: 'MyFilm',
  components: { AFormItem },
  data() {
    const form = this.$form.createForm(this)
    return {
      form,
      addFilmVisible: false,
      films: [],
      percent: 0,
      formItemCol: {
        label: { span: 6 },
        wrapper: { span: 12 }
      },
      formData: {
        type: 'ajax'
      }
    }
  },
  mounted() {
    this.initSocket()
  },
  methods: {
    handleSubmitAddFilm(data) {
      this.socket.emit('add film', data, () => {
        this.addFilmVisible = false
      })
    },
    handleAddFilm() {
      this.form.validateFields((error) => {
        if (!error) {
          this.handleSubmitAddFilm(this.form.getFieldsValue())
        }
      })
    },
    initSocket() {
      this.socket = io('http://localhost:3000')
      this.socket.on('get film', (data, percent) => {
        this.percent = percent
        this.films = this.films.concat(data)
      })
    },
    onSearch(filmName) {
      this.films = []
      this.socket.emit('set film name', filmName)
    }
  }
}
</script>

<style lang="scss">
  .film {
    height: 100%;
  }
</style>
