<template>
  <a-layout class="main-layout" :has-sider="true">
    <a-layout-sider>
      <ComponentClock />
      <a-menu v-model="selected" theme="dark">
        <a-menu-item v-for="menuItem in menus" :key="menuItem.link">
          <nuxt-link :to="menuItem.link">
            {{ menuItem.name }}
          </nuxt-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout-content>
      <div v-if="getConfig.background.enable" class="css-doodle-container">
        <css-doodle ref="cssDoodle" v-safe-html="getConfig.background.data" class="css-doodle-background" />
      </div>
      <nuxt class="nuxt-child-body" />
    </a-layout-content>
  </a-layout>
</template>

<style lang="scss">
  #__nuxt, #__layout, .main-layout {
    height: 100%;
  }

  .ant-layout-sider {
    position: relative;
    z-index: 2;
  }

  .css-doodle-container {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 0;
    overflow: hidden;
  }

  .css-doodle-background {
    width: 100vmax;
    height: 100vmax;
  }

  .nuxt-child-body {
    position: relative;
    z-index: 2;
  }
</style>

<script lang="ts">
import { Vue, Component, Watch, Ref } from 'vue-property-decorator'
import 'css-doodle'
import anime from 'animejs'
import { mapGetters } from 'vuex'
import ComponentClock from '@/components/Clock.vue'

@Component({
  computed: {
    ...mapGetters({
      getConfig: 'settings/getConfig'
    }),
    selected () {
      return [this.$route.path]
    }
  },
  components: { ComponentClock }
})
export default class defaultLayout extends Vue {
  emoji = { data: ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛'], index: 0 }
  menus = [
    { name: '影视搜索', link: '/film' },
    { name: '图片转字符画', link: '/pic2ascii' },
    { name: '五子棋', link: '/gobang' },
    { name: '音乐可视化', link: '/audio' },
    { name: '设置', link: '/settings' }
  ]
  @Ref() readonly cssDoodle

  @Watch('getBackground')
  onGetBackgroundChange () {
    setTimeout(() => {
      this.cssDoodle && this.cssDoodle.update()
    }, 0)
  }

  animationTitle () {
    const originalTitle = document.title
    anime({
      targets: this.emoji,
      loop: true,
      index: [0, this.emoji.data.length - 1],
      duration: 3000,
      easing: 'linear',
      update: () => {
        document.title = this.emoji.data[~~this.emoji.index] + originalTitle
      }
    })
  }

  mounted () {
    this.animationTitle()
  }
}
</script>
