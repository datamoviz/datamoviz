<template>
  <header>
    <div class="container">
      <div class="row justify-content-end align-items-center">
        <div class="col-8 col-md-6">
          <h1>
            <a href="/">
              <img src="../images/logo.svg" height="50" />
              Data<span class="name">Mo</span>viz
            </a>
            <small class="failure" v-if="failure">
              <i class="fa fa-plug"></i>
            </small>
          </h1>
        </div>
        <div class="col-4 col-md-3 movies-count">
          <i class="fa fa-spinner fa-spin" v-if="loading"></i>
          <span ref="moviesCount" class="counter">{{ currentTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }}</span>
          movie<span class="title" v-if="currentMovie !== ''"><br />{{ currentMovie }}</span><span v-else>s
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
        total: 0,
        currentTotal: 0,
        currentMovie: '',
        failure: false,
        loading: false
      };
    },
    methods: {
      countMovies(filters) {
        filters = filters || {};

        this.loading = true;
        return fetch(`${process.env.SERVER_URL}/count/movies?filters=${encodeURI(JSON.stringify(filters))}`)
          .then(response => response.json())
          .then((total) => {
            this.currentMovie = '';
            this.loading = false;
            this.updateTotal(total)
          })
          .catch(() => {
            this.failure = true;
            this.loading = false;
          });
      },
      updateTotal(total) {
        const counter = this.$refs.moviesCount;
        new CountUp(counter, this.currentTotal, total).start();
        counter.style.animation = 'none';
        setTimeout(() => { counter.style.animation = ''; }, 10);
        this.currentTotal = total;
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
    font-size: 0.8em;
    height: 65px;

    @media screen and (min-width: 500px) {
      font-size: 1em;
    }

    .row {
      height: 65px;
    }

    h1 {
      text-align: center;
      margin: 0;
      font-family: Pacifico, sans-serif;
      font-size: 2.7em;

      img {
        vertical-align: sub;
        display: none;

        @media screen and (min-width: 500px) {
          display: inline-block;
        }
      }

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
      text-align: center;
      line-height: 0.8em;

      @media screen and (min-width: 500px) {
        text-align: right;
      }

      .fa-spinner {
        font-size: 0.7em;
      }

      .counter, .title {
        color: $global-color-primary;
      }

      .counter {
        animation: bounce 1000ms linear both;
        display: inline-block;
      }

      .title {
        font-size: 0.7em;
      }

      .filters {
        font-size: 0.5em;
        font-family: $global-font;
      }

      .failure {
        color: $global-color-danger;
      }
    }
  }
</style>
