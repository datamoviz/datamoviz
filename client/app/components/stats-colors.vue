<template>
  <div class="col col-sm-6 col-md-6">
    <h3>Colors distribution</h3>
    <div ref="colorsChart" class="colors-chart"></div>
  </div>
</template>

<script>
  import c3 from 'c3';
  import { FILTERS_UPDATE } from '../event-bus';

  let chart;

  export default {
    name: 'stats-colors',
    methods: {
      loadColors(filters) {
        filters = Object.assign({}, filters);

        fetch(`${process.env.SERVER_URL}/aggregate/colors?filters=${encodeURI(JSON.stringify(filters))}`)
          .then(response => response.json())
          .then((colors) => {
            chart.load({
              unload: true,
              columns: colors
            });
          });
      },
      loadChart() {
        chart = c3.generate({
          bindto: this.$refs.colorsChart,
          data: {
            columns: [],
            type: 'donut',
            colors: {
              Color: '#1d92dd',
              'Black and White': '#989898'
            }
          },
          legend: {
            item: {
              onclick: () => {}
            }
          },
          size: {
            height: 340,
            width: 300
          }
        });
      }
    },
    mounted() {
      this.loadColors();
      this.loadChart();

      this.$bus.$on(FILTERS_UPDATE, (filters) => {
        this.loadColors(filters);
      });
    }
  };
</script>
