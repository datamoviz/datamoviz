<template>
  <div class="col col-sm-6 col-md-6">
    <h4>Genres distribution</h4>
    <div ref="genresChart"></div>
  </div>
</template>

<script>
  import c3 from 'c3';
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
              unload: true,
              columns: genres
            });
          });
      },
      loadChart() {
        chart = c3.generate({
          bindto: this.$refs.genresChart,
          data: {
            columns: [],
            type: 'pie',
            colors: {
              count: '#009946'
            },
            names: {
              count: 'Distribution of genres'
            },
            order: null
          },
          pie: {
            label: {
              show: false
            }
          },
          legend: {
            position: 'right',
            item: {
              onclick: () => {}
            }
          },
          size: {
            height: 200,
            width: 300
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
