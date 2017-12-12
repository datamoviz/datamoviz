<template>
  <div class="gauge">
      <div ref="gauge"></div>
      <div>{{ title }}</div>
  </div>
</template>

<script>
  import c3 from 'c3';
  import { MOVIE_SELECTED } from '../event-bus';

  export default {
    name: 'gauge-chart',
    props: ['imdb', 'value', 'name', 'max', 'size', 'title', 'thresholds'],
    methods: {
      loadChart() {
        c3.generate({
          bindto: this.$refs.gauge,
          data: {
            columns: [
              [this.name, this.value]
            ],
            type: 'gauge'
          },
          gauge: {
            min: 0,
            max: this.max
          },
          color: {
            pattern: ['#de3e38', '#c19518', '#1d92dd'],
            threshold: {
              values: this.thresholds
            }
          },
          size: {
            height: this.size
          }
        });
      }
    },
    mounted() {
      this.$bus.$on(MOVIE_SELECTED, (movie) => {
        if (movie.imdb_id === this.imdb) {
          this.loadChart();
        }
      });
    }
  };
</script>

<style scoped lang="scss" ref="stylesheet/scss">
  .gauge {
    display: inline-block;
    width: 150px;
    margin: 0 20px 20px 0;
    font-size: 0.8em;
    font-style: italic;
    text-align: center;
  }
</style>
