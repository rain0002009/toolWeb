import Vue from 'vue'
import vueScroll from 'vuescroll'

Vue.component('vue-scroll', vueScroll)
Vue.prototype.$vuescrollConfig = {
  bar: {
    background: 'rgba(123, 123, 123, 0.6)'
  }
}
