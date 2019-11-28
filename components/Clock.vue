<template>
  <div class="component-clock">
    <template v-for="(time, index) in nowText">
      <FlipItem v-if="time !== ':'" :key="index" :front="time || 0" :back="nextSecondsText[index] || 0" />
      <p v-else :key="index" class="separate">:</p>
    </template>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { Vue, Component } from 'vue-property-decorator'
import FlipItem from '~/components/FlipItem.vue'

let now = new Date()

function formatDate (date, dateFormat) {
  /* 单独格式化年份，根据y的字符数量输出年份
   * 例如：yyyy => 2019
          yy => 19
          y => 9
   */
  if (/(y+)/.test(dateFormat)) {
    dateFormat = dateFormat.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  // 格式化月、日、时、分、秒
  const o = {
    'm+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'i+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(dateFormat)) {
      // 取出对应的值
      const str = o[k] + ''
      /* 根据设置的格式，输出对应的字符
       * 例如: 早上8时，hh => 08，h => 8
       * 但是，当数字>=10时，无论格式为一位还是多位，不做截取，这是与年份格式化不一致的地方
       * 例如: 下午15时，hh => 15, h => 15
       */
      dateFormat = dateFormat.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : _.padStart(str, 2, '0'))
    }
  }
  return dateFormat
}

@Component({
  components: { FlipItem }
})
export default class ComponentClock extends Vue {
  nowText = formatDate(new Date(+now - 1000), 'hh:ii:ss')
  nextSecondsText = formatDate(now, 'hhiiss')

  mounted () {
    setInterval(() => {
      now = new Date()
      this.nowText = formatDate(new Date(+now - 1000), 'hh:ii:ss')
      this.nextSecondsText = formatDate(now, 'hh:ii:ss')
    }, 1000)
  }
}
</script>

<style lang="scss">
.component-clock {
  color: #fff;
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  .flip-item {
    width: 10%;
    height: 50px;
    line-height: 50px;
  }
  .separate {
    height: 50px;
    line-height: 50px;
    margin: 0;
  }
}
</style>
