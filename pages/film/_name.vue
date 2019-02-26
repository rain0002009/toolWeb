<template>
  <ul>
    <li v-for="film in films" :key="film.link">
      <a :href="film.link" target="_blank">{{ film.title }}</a>
    </li>
  </ul>
</template>

<script>
import { mapMutations } from 'vuex'
import socket from '~/plugins/io'

export default {
  name: 'FilmName',
  data() {
    return {
      films: []
    }
  },
  watch: {
    '$route': 'searchFilm'
  },
  mounted() {
    this.searchFilm()
    this.getFilms()
  },
  methods: {
    ...mapMutations({
      setPercent: 'film/setPercent'
    }),
    searchFilm() {
      socket.emit('set film name', this.$route.params.name)
    },
    getFilms() {
      socket.on('get films', (data, percent) => {
        this.setPercent(percent)
        this.films = this.films.concat(data)
      })
    }
  }
}
</script>

<style scoped>

</style>
