<template>
  <a-form :form="form" @submit="handleSubmit">
    <a-form-item
      v-show="type === 'add film'"
      label="网址"
      :label-col="formItemCol.label"
      :wrapper-col="formItemCol.wrapper"
    >
      <a-input
        v-decorator="['url', {initialValue: initialValue.url, rules: [{type: 'url'},{required: true}]}]"
        placeholder="请输入网址"
      />
    </a-form-item>

    <a-form-item
      label="网站字符编码"
      :label-col="formItemCol.label"
      :wrapper-col="formItemCol.wrapper"
    >
      <a-input v-decorator="['charset', {initialValue: initialValue.charset||'utf8'}]" placeholder="默认为utf8" />
    </a-form-item>

    <a-form-item label="网站请求类型：" :label-col="formItemCol.label" :wrapper-col="formItemCol.wrapper">
      <a-radio-group
        v-decorator="['type', {initialValue: initialValue.type, rules: [{required: true}]}]"
        name="type"
        @input="(type)=>filmType=type"
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
      v-if="filmType === 'html'"
      label="查询字符串"
      :label-col="formItemCol.label"
      :wrapper-col="formItemCol.wrapper"
    >
      <a-input
        v-decorator="['q', {initialValue: initialValue.q, rules: [{required: true}]}]"
        placeholder="如：?q=#keyWord#"
      />
    </a-form-item>

    <a-form-item
      v-else
      label="ajax type"
      :label-col="formItemCol.label"
      :wrapper-col="formItemCol.wrapper"
    >
      <a-radio-group
        v-decorator="['ajaxType', {initialValue: initialValue.ajaxType || 'post', rules: [{required: true}]}]"
        name="ajaxType"
      >
        <a-radio-button value="get">
          get
        </a-radio-button>
        <a-radio-button value="post">
          post
        </a-radio-button>
      </a-radio-group>
    </a-form-item>

    <a-form-item label="结果检测规则" :label-col="formItemCol.label" :wrapper-col="formItemCol.wrapper">
      <a-textarea
        v-decorator="['hasResCheck', {initialValue: initialValue.hasResCheck, rules: [{required: true}]}]"
        placeholder="如：return page.$eval('#counts', el => +el.innerText)"
      />
    </a-form-item>

    <a-form-item label="是否需要host：" :label-col="formItemCol.label" :wrapper-col="formItemCol.wrapper">
      <a-radio-group
        v-decorator="['needHost', {initialValue: !!initialValue.needHost, rules: [{required: true}]}]"
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
        v-decorator="['needFilter', {initialValue: !!initialValue.needFilter, rules: [{required: true}]}]"
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
        v-decorator="['filmListQuery', {initialValue: initialValue.filmListQuery, rules: [{required: true}]}]"
        placeholder="如：.movie-list"
        style="margin-top: 10px;"
      />
    </a-form-item>

    <a-form-item label="链接选择器" :label-col="formItemCol.label" :wrapper-col="formItemCol.wrapper">
      <a-input
        v-decorator="['linkQuery', {initialValue: initialValue.linkQuery, rules: [{required: true}]}]"
        placeholder="如：a"
        style="margin-top: 10px;"
      />
    </a-form-item>

    <a-form-item label="标题选择器" :label-col="formItemCol.label" :wrapper-col="formItemCol.wrapper">
      <a-input
        v-decorator="['titleQuery', {initialValue: initialValue.titleQuery || initialValue.linkQuery, rules: [{required: true}]}]"
        placeholder="如：a"
        style="margin-top: 10px;"
      />
    </a-form-item>

    <div style="text-align:right;padding-right: 25%">
      <a-button @click="deleteFilm">
        删除
      </a-button>
      <a-button @click="testRule">
        测试
      </a-button>
      <a-button html-type="submit">
        确定
      </a-button>
    </div>
  </a-form>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'

@Component
export default class FilmForm extends Vue {
  @Prop({
    default () {
      return {
        type: Object,
        default () {
          return {
            url: '',
            type: 'html',
            q: '',
            hasResCheck: '',
            needHost: false,
            needFilter: false,
            filmListQuery: '',
            linkQuery: '',
            titleQuery: ''
          }
        }
      }
    }
  }) readonly initialValue
  @Prop({ default: 'add film' }) readonly type
  form = this.$form.createForm(this)
  filmType = ''
  formItemCol = {
    label: { span: 6 },
    wrapper: { span: 12 }
  }

  @Watch('initialValue.type', { immediate: true })
  onTypeChange (value) {
    this.filmType = value || 'html'
  }

  testRule () {
    this.form.validateFields((error) => {
      if (!error) {
        const name = prompt('输入搜索内容')
        name && this.$socket.emit('test film rule', this.form.getFieldsValue(), name)
      }
    })
  }

  handleSubmit (e) {
    e && e.preventDefault()
    this.form.validateFields((error) => {
      if (!error) {
        this.$socket.emit(this.type, this.form.getFieldsValue(), () => {
          this.$message.info('ok')
          this.$emit('submit-success')
        })
      }
    })
  }

  deleteFilm () {
    this.$socket.emit('remove file', this.form.getFieldsValue().url, () => {
      this.$message.success('删除成功')
    })
  }
}
</script>

<style scoped>

</style>
