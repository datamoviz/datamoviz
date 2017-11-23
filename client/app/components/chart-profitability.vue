<template>
  <div class="chart" ref="chart"></div>
</template>

<script>
  import c3 from 'c3';
  import * as d3 from 'd3';
  import { MOVIE_SELECTED } from '../event-bus';

  export default {
    name: 'profitability-chart',
    props: ['budget', 'revenue', 'imdb'],
    methods: {
      loadChart() {
        const colors = ['#2f76b5', '#009946'];

        c3.generate({
          bindto: this.$refs.chart,
          data: {
            columns: [
              ['data', this.budget, this.revenue]
            ],
            types: {
              data: 'bar'
            },
            labels: {
              format: {
                data: d3.format('$,')
              }
            },
            color (color, d) {
              return colors[d.index];
            }
          },
          legend: {
            show: false
          },
          axis: {
            rotated: true,
            x: {
              type: 'category',
              categories: ['Budget', 'Revenue']
            },
            y: {
              show: false,
              padding: { top: 200 }
            }
          },
          size: {
            height: 110,
            width: 300
          },
          tooltip: {
            show: false
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
  .chart {
    display: inline-block;
    width: 300px;
  }
</style>
