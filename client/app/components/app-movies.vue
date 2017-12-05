<template>
  <section @keyup.escape="$refs.searchField.reset()">
    <search ref="searchField"></search>
    <div class="results-container" :class="{ presenter: presenter }" data-simplebar>
      <div class="results" v-if="movies.length !== 0">
        <thumbnail v-for="(movie, key) in movies" :key="movie.imdb_id" :movie="movie" :total="movies.length" :popularity="maxPopularity"></thumbnail>
      </div>
      <div class="no-result" v-else-if="!failure">
        No result found...
      </div>
      <div class="failure" v-else>
        Failed to reach server.
      </div>
    </div>
  </section>
</template>

<script>
  import { FILTERS_UPDATE, MOVIE_SELECTED } from '../event-bus';
  import Search from './search.vue';
  import Thumbnail from './thumbnail.vue';

  export default {
    name: 'app-movies',
    components: {
      Search,
      Thumbnail
    },
    data() {
      return {
        movies: [],
        failure: false,
        presenter: false,
        maxPopularity: 0
      };
    },
    methods: {
      loadThumbnails(filters) {
        filters = filters || {};

        return fetch(`${process.env.SERVER_URL}/filtered/movies?filters=${encodeURI(JSON.stringify(filters))}`)
          .then(response => response.json())
          .then((movies) => {
            this.movies = movies;
          })
          .catch(() => {
            this.failure = true;
          });
      }
    },
    mounted() {
      this.loadThumbnails().then(() => {
        this.maxPopularity = Math.floor(this.movies[0].imdb_nb_reviews);
      });

      this.$bus.$on(FILTERS_UPDATE, (filters) => {
        this.loadThumbnails(filters);
        this.presenter = false;
      });

      this.$bus.$on(MOVIE_SELECTED, () => {
        this.presenter = true;
      });
    }
  };
</script>

<style scoped lang="scss" ref="stylesheet/scss">
  @import '../scss/vars';

  section {
    margin-bottom: 0;
    padding-bottom: 0;

    .results-container {
      width: 100%;
      max-width: 100%;
      margin: 0 auto;

      .results {
        display: flex;
        flex-wrap: nowrap;
        min-height: 420px;
        padding-top: 15px;
      }

      &.presenter {
        max-width: 1120px;
        width: 100%;
        padding: 0 10px;
        transition: max-width .6s linear .2s;
      }
    }

    .no-result, .failure {
      text-align: center;
      min-height: 420px;
      padding-top: 20px;
    }

    .failure {
      color: $global-color-danger;
    }
  }
</style>
