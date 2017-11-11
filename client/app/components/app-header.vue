<template>
  <header>
    <div class="container">
      <div class="row align-items-center">
        <div class="col-6 ml-sm-auto">
          <h1>
            <a href="/">Data<span class="name">Mo</span>viz</a>
          </h1>
        </div>
        <div class="col-6 col-sm-3 movies-count">
          <span ref="moviesCount">0</span> {{ currentTotal|pluralize('movie') }}
          <span class="title" v-if="currentMovie !== ''">
            <br />{{ currentMovie }}
          </span>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
  import CountUp from 'countup.js';
  import { FILTERS_UPDATE, MOVIE_SELECTED } from '../event-bus';

  export default {
    name: 'app-header',
    data() {
      return {
        currentTotal: 0,
        currentMovie: ''
      };
    },
    methods: {
      countMovies(filters) {
        filters = filters || {};

        return fetch(`http://localhost:3030/count/movies?filters=${encodeURI(JSON.stringify(filters))}`)
          .then(response => response.json())
          .then(json => json)
          .then((total) => {
            new CountUp(this.$refs.moviesCount, this.currentTotal, total, null, 2, { separator: ' ' }).start();
            this.currentTotal = parseInt(total, 10);

            if (!Object.prototype.hasOwnProperty.call(filters, 'imdb_id') || this.currentTotal === 0) {
              this.currentMovie = '';
            }
          });
      }
    },
    mounted() {
      this.countMovies();

      this.$bus.$on(FILTERS_UPDATE, this.countMovies);
      this.$bus.$on(MOVIE_SELECTED, (movie) => {
        this.currentMovie = movie.title;
      });
    }
  };
</script>

<style scoped lang="scss" ref="stylesheet/scss">
  @import '../scss/vars';

  header {
    background-color: $global-color-darker;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10000;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.30);

    h1 {
      text-align: center;
      margin: 0;
      font-family: Pacifico, sans-serif;
      font-size: 2.7em;

      a {
        color: white;

        &:hover {
          text-decoration: none;
          color: white;
        }
      }

      .name {
        animation: 2s fade-in;
        color: $global-color-primary;
        font-weight: normal;
      }
    }

    .movies-count {
      font-family: Pacifico, sans-serif;
      font-size: 1.5em;
      text-align: right;
      line-height: 1em;

      span {
        color: $global-color-primary;
      }

      .title {
        font-size: 0.7em;
      }
    }
  }
</style>
