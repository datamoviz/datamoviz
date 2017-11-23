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
  import c3 from 'c3';
  import { FILTERS_UPDATE } from '../event-bus';

  let chart;

  export default {
    name: 'app-overview',
    data() {
      return {
        timeout: 0,
        nbYears: 0,
        minYear: 0,
        maxYear: 0
      };
    },
    methods: {
      loadCount(filters) {
        filters = Object.assign({}, filters);

        delete filters.release_date; // We ignore date range filtering for the overview

        return fetch(`${process.env.SERVER_URL}/aggregate/movies?filters=${encodeURI(JSON.stringify(filters))}`)
          .then(response => response.json())
          .then((years) => {
            this.nbYears = years.length;
            chart.load({
              json: years,
              keys: {
                x: '_id',
                value: ['count']
              }
            });

            return years;
          });
      },
      updateDateRange(domain) {
        const { filters } = this.$bus;

        const startYear= Math.round(domain[0]);
        const endYear = Math.round(domain[1]);

        if (startYear === this.minYear && endYear === this.maxYear) {
          delete filters.release_date;
        } else {
          filters.release_date = {
            $gte: new Date(startYear.toString()),
            $lte: new Date(endYear.toString())
          };
        }

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
            },
            names: {
              count: 'Number of movies'
            }
          },
          subchart: {
            show: true,
            onbrush: (domain) => {
              clearTimeout(this.timeout);

              this.timeout = setTimeout(() => { // Avoiding too frequent requests to avoid page lags
                this.updateDateRange(domain);
              }, 500);
            }
          },
          axis: {
            x: {
              tick: {
                count: this.nbYears,
                culling: {
                  max: 12
                }
              }
            }
          },
          grid: {
            x: {
              show: true
            }
          }
        });
      }
    },
    mounted() {
      this.loadCount().then((years) => {
        this.minYear = years[0]._id;
        this.maxYear = years[years.length - 1]._id + 1;
      });
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
