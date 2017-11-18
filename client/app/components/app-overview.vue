<template>
  <section>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2>Overview</h2>
          <h3>Movies count</h3>
          <small><span class="badge badge-info">Pro tip</span> You can drag your mouse on the below subgraph to select a time period.</small>
          <div ref="overviewChart"></div>
        </div>
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
    data() {
      return {
        lock: 0
      }
    },
    methods: {
      loadCount(filters) {
        filters = Object.assign({}, filters);

        delete filters['release_date']; // We ignore date range filtering for the overview

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
      updateDateRange(domain) {
        const { filters } = this.$bus;

        console.log(domain);
        filters['release_date'] = {
          $gte: new Date(Math.round(domain[0]).toString()),
          $lte: new Date(Math.round(domain[1]).toString())
        };

        console.log(filters);

        this.$bus.$emit(FILTERS_UPDATE, filters);
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
            show: true,
            onbrush: (domain) => {
              const lock = ++this.lock;
              setTimeout(() => { // Avoiding too frequent requests to avoid page lags
                console.log(lock, this.lock);

                if (lock !== this.lock) {
                  return;
                }

                this.updateDateRange(domain);
              }, 1000);
            }
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
