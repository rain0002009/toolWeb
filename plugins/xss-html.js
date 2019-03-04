import Vue from 'vue'
import xss from 'xss'

const whiteList = {
  span: ['class'],
  div: ['class'],
  a: ['class']
}

function filterHtml(el, { value }) {
  el.innerHTML = xss(value, { whiteList })
}

Vue.directive('safe-html', {
  bind: filterHtml,
  inserted: filterHtml,
  update: filterHtml,
  componentUpdated: filterHtml
})
