<template>
  <div class="col col-sm-6 col-md-6">
    <h4>Genres distribution</h4>
    <div ref="genresChart" class="genres-chart"></div>
  </div>
</template>

<script>
  import c3 from 'c3';
  import * as d3 from 'd3';
  import { FILTERS_UPDATE } from '../event-bus';

  let chart;

  export default {
    name: 'stats-genres',
    methods: {
      loadGenres(filters) {
        filters = Object.assign({}, filters);

        fetch(`${process.env.SERVER_URL}/aggregate/genres?filters=${encodeURI(JSON.stringify(filters))}`)
          .then(response => response.json())
          .then((genres) => {
            chart.load({
              json: genres,
              keys: {
                x: '_id',
                value: ['value']
              }
            });
          });
      },
      loadChart() {
        chart = c3.generate({
          bindto: this.$refs.genresChart,
          data: {
            json: {},
            type: 'bar',
            colors: {
              value: '#1d92dd'
            },
            names: {
              value: 'Number of movies'
            },
            axes: {
              value: 'y2'
            },
            order: null
          },
          legend: {
            show: false
          },
          axis: {
            rotated: true,
            x: {
              type: 'category'
            },
            y: {
              show: false
            },
            y2: {
              show: true,
              tick: {
                count: 5,
                format: d3.format('.0f')
              }
            }
          },
          size: {
            height: 300,
            width: 300
          },
          grid: {
            y: {
              show: true
            }
          }
        });
      }
    },
    mounted() {
      this.loadGenres();
      this.loadChart();

      this.$bus.$on(FILTERS_UPDATE, (filters) => {
        this.loadGenres(filters);
      });
    }
  };
</script>

<style lang="scss" ref="stylesheet/scss">
  .genres-chart g.tick:last-of-type text {
    transform: translate(-7px, 0);
  }
</style>
