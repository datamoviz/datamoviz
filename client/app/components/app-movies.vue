<template>
  <section>
    <search></search>
    <div v-if="movies.length !== 0">
      <thumbnail v-for="movie in movies" :key="movie.imdb_id" :title="movie.original_title" :poster="movie.poster_path"></thumbnail>
    </div>
  </section>
</template>

<script>
  import { FILTERS_UPDATE } from '../event-bus';
  import Thumbnail from './thumbnail.vue';
  import Search from './search.vue';

  export default {
    name: 'app-movies',
    components: {
      Thumbnail,
      Search
    },
    data() {
      return {
        movies: []
      }
    },
    methods: {
      loadThumbnails(filters) {
        filters = filters || {};

        fetch(`http://localhost:3030/filtered/movies?filters=${encodeURI(JSON.stringify(filters))}`)
          .then(response => response.json())
          .then((movies) => {
            this.movies = movies;
          });
      }
    },
    mounted() {
      this.$bus.$on(FILTERS_UPDATE, (filters) => {
        this.loadThumbnails(filters);
      });

      this.loadThumbnails();
    }
  };
</script>

<style scoped lang="scss" ref="stylesheet/scss">
  section {
    max-width: 100%;
    overflow-x: hidden;
  }

  div {
    width: 9999px;
    margin: 0 auto;
  }
</style>
