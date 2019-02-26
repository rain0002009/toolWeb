<template>
  <div class="film-edit">
    <a-collapse v-if="list.length" accordion>
      <a-collapse-panel v-for="(item, index) in list" :key="index" :header="item.url">
        <film-form :ref="'form'+index" type="edit film" :initial-value="item" />
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
import FilmForm from '~/components/FilmForm'
import socket from '~/plugins/io'

export default {
  name: 'FilmEdit',
  components: { FilmForm },
  data() {
    return {
      list: []
    }
  },
  watch: {
    '$route': 'getRule'
  },
  mounted() {
    this.getRule()
  },
  methods: {
    getRule() {
      const callback = (data) => {
        this.list = data || []
      }
      socket.emit('get rules', callback)
      socket.on('get rules', callback)
    }
  }
}
</script>

<style lang="scss">
  .film-edit {
    padding: 20px;
  }
</style>
