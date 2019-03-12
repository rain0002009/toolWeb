// 为了webstorm识别
import Vue from 'vue'
import ant from 'ant-design-vue'
import Nuxt from 'nuxt'

Vue.component('a-layout', ant.Layout);
Vue.component('a-layout-sider', ant.Layout.Sider);
Vue.component('a-menu-item', ant.Menu.Item);
Vue.component('nuxt-link', Nuxt);
Vue.component('nuxt', Nuxt);
Vue.component('nuxt-child', Nuxt);
Vue.component('a-layout-content', ant.Layout.Content);
Vue.component('a-form', ant.Form);
Vue.component('a-form-item', ant.Form.Item);
Vue.component('a-input-search', ant.Input.Search);
Vue.component('a-radio-group', ant.Radio.Group);
Vue.component('a-radio-button', ant.Radio.Button);
Vue.component('a-textarea', ant.Input.TextArea);
