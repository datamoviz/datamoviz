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
        movies: [],
        failure: false,
        presenter: false,
        maxPopularity: 0
      };
    },
    methods: {
      loadPopulars() {
        fetch(`${process.env.SERVER_URL}/filtered/most-popular`)
          .then(response => response.json())
          .then((movies) => {
            this.movies = movies;
            this.maxPopularity = Math.floor(this.movies[0].popularity);
          })
          .catch(() => {
            this.failure = true;
          });
      },
      loadThumbnails(filters) {
        fetch(`${process.env.SERVER_URL}/filtered/movies?filters=${encodeURI(JSON.stringify(filters))}`)
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
      this.loadPopulars();

      this.$bus.$on(FILTERS_UPDATE, (filters) => {
        if (Object.keys(filters).length === 0) {
          this.loadPopulars();
        } else {
          this.loadThumbnails(filters);
        }
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
      overflow: hidden;
      margin: 0 auto;

      .results {
        white-space: nowrap;
        height: 420px;
        padding-top: 15px;
      }

      &.presenter {
        width: 1120px;
        padding: 0 10px;
        transition: width .6s linear .2s;
      }
    }

    .no-result, .failure {
      text-align: center;
    }

    .failure {
      color: $global-color-danger;
    }
  }
</style>
