<template>
  <div class="film-edit">
    <a-collapse v-if="list.length" accordion>
      <a-collapse-panel v-for="(item, index) in list" :key="index" :header="item.url">
        <film-form :ref="'form'+index" :key="index" type="edit film" :initial-value="item" />
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
import FilmForm from '~/components/FilmForm'

export default {
  name: 'FilmEdit',
  components: { FilmForm },
  data () {
    return {
      list: []
    }
  },
  watch: {
    $route: 'getRule'
  },
  mounted () {
    this.getRule()
  },
  methods: {
    getRule () {
      const callback = (data) => {
        this.list = data || []
      }
      this.$socket.emit('get rules', callback)
      this.$socket.on('get rules', callback)
    }
  }
}
</script>

<style lang="scss">
  .film-edit {
    padding: 20px;
  }
</style>
