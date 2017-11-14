<template>
  <div class="col col-md-4">
    <h2>Popular words</h2>
    <div ref="chart"></div>
    <span v-if="words.length === 0"><i class="fa fa-spinner fa-spin"></i> Please wait while I'm counting words...</span>
  </div>
</template>

<script>
  import c3 from 'c3';

  export default {
    name: 'app-words',
    data() {
      return {
        words: []
      };
    },
    methods: {
      loadWords(filters) {
        filters = filters || {};

        fetch(`${process.env.SERVER_URL}/count/words`)
          .then(response => response.json())
          .then((words) => {
            this.words = words;
            this.loadChart();
          });
      },
      loadChart() {
        c3.generate({
          bindto: this.$refs.chart,
          data: {
            columns: [
              ['data', ...this.words.map(w => w.value)]
            ],
            types: {
              data: 'bar'
            },
            colors: {
              data: '#009946'
            }
          },
          legend: {
            show: false
          },
          axis: {
            rotated: true,
            x: {
              type: 'category',
              categories: this.words.map(w => w._id)
            },
            y: {
              show: false
            }
          },
          size: {
            height: 500
          }
        });
      }
    },
    mounted() {
      this.loadWords();
    }
  };
</script>

<style scoped lang="scss" ref="stylesheet/scss">
</style>
