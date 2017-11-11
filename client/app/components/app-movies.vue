<template>
  <section>
    <search ref="searchField"></search>
    <div class="results-container" v-if="movies.length !== 0">
      <div class="results">
        <thumbnail v-for="movie in movies" :key="movie.imdb_id" :movie="movie"></thumbnail>
      </div>
    </div>
    <div class="no-result" v-else>
        No result found...
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
      };
    },
    methods: {
      loadThumbnails(filters) {
        filters = filters || {};

        fetch(`http://localhost:3030/filtered/movies?filters=${encodeURI(JSON.stringify(filters))}`)
          .then(response => response.json())
          .then((movies) => {
            this.movies = movies.sort((a, b) => a.popularity < b.popularity);
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

    .results-container {
      position: relative;
      height: 365px;
      overflow: hidden;

      .results {
        width: 4000px;
        text-align: center;
        position: absolute;
        top: 0;
        left: 50%;
        margin-left: -2000px;
      }
    }

    .no-result {
      text-align: center;
      padding: 20px;
      height: 360px;
    }
  }
</style>
