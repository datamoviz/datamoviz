<template>
  <div class="col col-md-4">
    <h2>Popular words</h2>
    <div ref="chart"></div>
  </div>
</template>

<script>
  import { FILTERS_UPDATE } from '../event-bus';
  import c3 from 'c3';
  import * as d3 from 'd3';

  let chart;

  export default {
    name: 'app-words',
    methods: {
      loadWords(filters) {
        filters = filters || {};
        fetch(`${process.env.SERVER_URL}/count/words?filters=${encodeURI(JSON.stringify(filters))}`)
          .then(response => response.json())
          .then((words) => {
            chart.load({
              json: words,
              keys: {
                x: '_id',
                value: ['value']
              }
            });
          });
      },
      loadChart() {
        chart = c3.generate({
          bindto: this.$refs.chart,
          data: {
            json: [],
            type: 'bar',
            colors: {
              value: '#009946'
            },
            axes: {
              value: 'y2'
            }
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
              },
              padding: { left: 100 }
            }
          },
          size: {
            height: 500
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
      this.loadWords();
      this.loadChart();

      this.$bus.$on(FILTERS_UPDATE, (filters) => {
        this.loadWords(filters);
      });
    }
  };
</script>

<style scoped lang="scss" ref="stylesheet/scss">
  h2 {
    text-align: center;
  }
</style>
