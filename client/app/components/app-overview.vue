<template>
  <section class="highlight">
    <div class="container" data-aos="fade">
      <div class="row">
        <div class="col-12">
          <div ref="overviewChart"></div>
          <small><span class="badge badge-info">Pro tip</span> You can drag your mouse on the above subgraph to select a time period.</small>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import c3 from 'c3';
  import * as d3 from 'd3';
  import { FILTERS_UPDATE } from '../event-bus';

  let chart = null;

  export default {
    name: 'app-overview',
    data() {
      return {
        timeout: 0,
        nbYears: 0,
        yearsList: []
      };
    },
    methods: {
      loadCount(filters) {
        filters = Object.assign({}, filters);

        if (!filters.hasOwnProperty('release_date') && chart !== null) {
          chart.internal.brush.clear().update();
        }

        delete filters.release_date; // We ignore date range filtering for the overview

        return Promise.all([this.loadYears(filters), this.loadColors(filters)])
          .then(([years, colors]) => {
            this.yearsList = this.yearsList.length === 0 ? years[0] : this.yearsList;

            years.push(colors[0]);
            years.push(colors[1]);

            chart.load({
              columns: years
            });
          });
      },
      loadYears(filters) {
        return fetch(`${process.env.SERVER_URL}/aggregate/years?filters=${encodeURI(JSON.stringify(filters))}`)
          .then(response => response.json())
          .then((years) => {
            this.nbYears = years.length;
            return years;
          });
      },
      loadColors(filters) {
        return fetch(`${process.env.SERVER_URL}/aggregate/years-colors?filters=${encodeURI(JSON.stringify(filters))}`)
          .then(response => response.json())
          .then(colors => colors);
      },
      updateDateRange(domain) {
        const { filters } = this.$bus;

        const startYear = Math.round(domain[0]);
        const endYear = Math.round(domain[1]);

        if (startYear === this.yearsList[1] && endYear === this.yearsList[this.yearsList.length - 1] + 1) {
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
            x: 'list',
            columns: [],
            type: 'bar',
            colors: {
              years: '#009946',
              b_and_w: '#989898',
              color: '#1d92dd'
            },
            hide: ['b_and_w', 'color'],
            names: {
              years: 'All the movies',
              b_and_w: 'Black and White movies',
              color: 'Color movies'
            },
            types: {
              b_and_w: 'area',
              color: 'area'
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
      this.loadCount();
      this.loadChart();

      this.$bus.$on(FILTERS_UPDATE, (filters) => {
        this.loadCount(filters);
      });
    }
  };
</script>
