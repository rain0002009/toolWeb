<template>
  <div class="film">
    <div class="container">
      <a-progress :percent="percent" />
      <a-input-search
        v-model="searchText"
        placeholder="请输入电影名"
        enter-button
        @search="onSearch"
      />
      <div style="margin-top: 10px;">
        <a-button type="primary" @click="addFilmVisible = true">
          添加源
        </a-button>
        <a-button @click="$router.push({name: 'film-edit'})">
          修改源
        </a-button>
      </div>
    </div>
    <nuxt-child />

    <a-modal
      title="添加源"
      :visible="addFilmVisible"
      @ok="handleAddFilm"
      @cancel="addFilmVisible = false"
    >
      <film-form ref="form" />
    </a-modal>
  </div>
</template>

<script>
import FilmForm from '~/components/FilmForm'

export default {
  name: 'MyFilm',
  components: {
    FilmForm
  },
  data() {
    return {
      searchText: '',
      addFilmVisible: false,
      formData: {
        type: 'ajax'
      }
    }
  },
  computed: {
    percent() {
      return this.$store.state.film.percent
    }
  },
  mounted() {
    this.searchText = this.$route.params.name || ''
  },
  methods: {
    handleAddFilm() {
      this.$refs.form.handleSubmit()
    },
    onSearch(filmName) {
      if (!filmName) return false
      this.$router.push({ name: 'film-name', params: { name: filmName } })
    }
  }
}
</script>

<style lang="scss">
  .film {
    height: 100%;

    .container {
      padding: 20px 40px;
    }
  }
</style>
