<template>
  <section @keyup.escape="$refs.searchField.reset()">
    <search ref="searchField"></search>
    <div class="results-container" v-if="movies.length !== 0">
      <div class="results" :style="{ 'margin-left': `${-2000 + shift}px` }">
        <thumbnail v-for="(movie, key) in movies" :key="movie.imdb_id" :position="key + 1" :movie="movie" :total="movies.length" :popularity="maxPopularity"></thumbnail>
      </div>
    </div>
    <div class="no-result" v-else-if="!failure">
      No result found...
    </div>
    <div class="failure" v-else>
      Failed to reach server.
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
        shift: 0,
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
        this.shift = 0;
      });

      this.$bus.$on(MOVIE_SELECTED, (movie, shift) => {
        this.shift = shift;
      });
    }
  };
</script>

<style scoped lang="scss" ref="stylesheet/scss">
  @import '../scss/vars';

  section {
    max-width: 100%;
    overflow-x: hidden;
    margin-bottom: 0;
    padding-bottom: 0;

    .results-container {
      position: relative;
      height: 390px;
      overflow: hidden;

      .results {
        width: 4000px;
        text-align: center;
        position: absolute;
        top: 0;
        left: 50%;
        transition: margin .6s linear;
      }
    }

    .no-result, .failure {
      text-align: center;
      padding: 20px;
      height: 390px;
    }

    .failure {
      color: $global-color-danger;
    }
  }
</style>
