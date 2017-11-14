<template>
  <section>
    <div class="container">
      <div class="row">
        <div class="col-12"><h2>Overview</h2></div>
        <div class="col-12"><div ref="overviewChart"></div></div>
      </div>
    </div>
  </section>
</template>

<script>
  import { FILTERS_UPDATE } from '../event-bus';
  import c3 from 'c3';
  import * as d3 from 'd3';

  let chart;

  export default {
    name: 'app-overview',
    methods: {
      loadCount(filters) {
        filters = filters || {};
        fetch(`${process.env.SERVER_URL}/aggregate/movies?filters=${encodeURI(JSON.stringify(filters))}`)
          .then(response => response.json())
          .then((years) => {
            chart.load({
              json: years,
              keys: {
                x: '_id',
                value: ['count']
              }
            });
          });
      },
      loadChart() {
        chart = c3.generate({
          bindto: this.$refs.overviewChart,
          data: {
            json: [],
            type: 'bar',
            colors: {
              count: '#009946'
            }
          },
          subchart: {
            show: true
          },
          axis: {
            y: {
              tick: {
                values: [...[...new Array(10).keys()].map((val) => 1000*val)]
              }
            }
          },
          grid: {
            x: {
              show: true,
            },
            y: {
              show: true
            }
          }
        });
      }
    },
    mounted() {
      this.loadCount();
      this.loadChart();

      this.$bus.$on(FILTERS_UPDATE, (filters) => {
        this.loadCount(filters);
      });
    }
  };
</script>

<style lang="scss" ref="stylesheet/scss">
    @import '~c3/src/scss/main.scss';
</style>
