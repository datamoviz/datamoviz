<template>
  <header class="container">
    <div class="row align-items-center">
      <div class="col-6 ml-auto">
        <h1>
          <a href="/">Data<span class="name">Mo</span>viz</a>
        </h1>
      </div>
      <div class="col-3 movies-count">
        <span ref="moviesCount">0</span> movies
      </div>
    </div>
  </header>
</template>

<script>
  import CountUp from 'countup.js';
  import { FILTERS_UPDATE } from '../event-bus';

  export default {
    name: 'app-header',
    data() {
      return {
        currentTotal: 0
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
            this.currentTotal = total;
          });
      }
    },
    mounted() {
      this.countMovies();

      this.$bus.$on(FILTERS_UPDATE, this.countMovies);
    }
  };
</script>

<style scoped lang="scss" ref="stylesheet/scss">
  @import '../scss/vars';

  header {
    h1 {
      padding: 20px 0;
      text-align: center;
      margin: 0;
      font-family: Pacifico, sans-serif;
      font-size: 3em;

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

      span {
        color: $global-color-primary;
      }
    }
  }
</style>
