<template>
  <a-layout class="main-layout" :has-sider="true">
    <a-layout-sider>
      <a-menu v-model="selected" theme="dark">
        <a-menu-item v-for="menuItem in menus" :key="menuItem.link">
          <nuxt-link :to="menuItem.link">
            {{ menuItem.name }}
          </nuxt-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout-content>
      <nuxt />
    </a-layout-content>
  </a-layout>
</template>

<style lang="scss">
  #__nuxt, #__layout, .main-layout {
    height: 100%;
  }

  .vb > .vb-dragger {
    z-index: 5;
    width: 12px;
    right: 0;
  }

  .vb > .vb-dragger > .vb-dragger-styler {
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    -webkit-transform: rotate3d(0, 0, 0, 0);
    transform: rotate3d(0, 0, 0, 0);
    -webkit-transition: background-color 100ms ease-out,
    margin 100ms ease-out,
    height 100ms ease-out;
    transition: background-color 100ms ease-out,
    margin 100ms ease-out,
    height 100ms ease-out;
    background-color: rgba(48, 121, 244, .1);
    margin: 5px 5px 5px 0;
    border-radius: 20px;
    height: calc(100% - 10px);
    display: block;
  }

  .vb.vb-scrolling-phantom > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(48, 121, 244, .3);
  }

  .vb > .vb-dragger:hover > .vb-dragger-styler {
    background-color: rgba(48, 121, 244, .5);
    margin: 0;
    height: 100%;
  }

  .vb.vb-dragging > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(48, 121, 244, .5);
    margin: 0;
    height: 100%;
  }

  .vb.vb-dragging-phantom > .vb-dragger > .vb-dragger-styler {
    background-color: rgba(48, 121, 244, .5);
  }
</style>

<script>
import anime from 'animejs'

export default {
  data() {
    return {
      emoji: { data: ['🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛'], index: 0 },
      menus: [
        { name: '影视搜索', link: '/film' },
        { name: '图片转字符画', link: '/pic2ascii' },
        { name: '五子棋', link: '/gobang' }
      ]
    }
  },
  computed: {
    selected() {
      return [this.$route.path]
    }
  },
  mounted() {
    this.animationTitle()
  },
  methods: {
    animationTitle() {
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
  }
}
</script>
