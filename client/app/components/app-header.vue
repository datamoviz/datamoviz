<template>
  <header>
    <div class="container">
      <div class="row align-items-center">
        <div class="col-6 ml-sm-auto">
          <h1>
            <a href="/">Data<span class="name">Mo</span>viz</a>
            <small class="failure" v-if="failure">
              <i class="fa fa-plug"></i>
            </small>
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
        currentMovie: '',
        failure: false
      };
    },
    methods: {
      countMovies(filters) {
        filters = filters || {};

        return fetch(`http://localhost:3030/count/movies?filters=${encodeURI(JSON.stringify(filters))}`)
          .then(response => response.json())
          .then(json => json)
          .then((total) => {
            this.updateTotal(total);
            this.currentMovie = '';
          })
          .catch(() => {
            this.failure = true;
          });
      },
      updateTotal(total) {
        new CountUp(this.$refs.moviesCount, this.currentTotal, total, null, 2, { separator: ' ' }).start();
        this.currentTotal = parseInt(total, 10);
      }
    },
    mounted() {
      this.countMovies();

      this.$bus.$on(FILTERS_UPDATE, this.countMovies);
      this.$bus.$on(MOVIE_SELECTED, (movie) => {
        this.currentMovie = movie.title;
        this.updateTotal(1);
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

      small {
        font-size: 0.5em;
        vertical-align: super;
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

      .failure {
        color: $global-color-danger;
      }
    }
  }
</style>
