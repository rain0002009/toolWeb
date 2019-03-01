<template>
  <a-layout class="main-layout" :has-sider="true">
    <a-layout-sider>
      <a-menu>
        <a-menu-item v-for="(menuItem, index) in menus" :key="index">
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
export default {
  data() {
    return {
      menus: [{ name: '影视搜索', link: '/film' }]
    }
  }
}
</script>
