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
