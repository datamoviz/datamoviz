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
  import c3 from 'c3';
  import * as d3 from 'd3';

  export default {
    name: 'app-overview',
    mounted() {
      c3.generate({
        bindto: this.$refs.overviewChart,
        data: {
          x: 'Years',
          columns: [
            ['Years', ...[...new Array(117).keys()].map((val) => 1900 + val)],
            ['Movies average budget', ...[...new Array(117).keys()].map((val) => 1000000 + Math.round((val + Math.random()*20)**4))],
            ['Movies average revenues', ...[...new Array(117).keys()].map((val) => 1000000 + Math.round((val + Math.random()*20)**4.1))]
          ]
        },
        color: {
          pattern: ['#009946', '#2f76b5']
        },
        axis : {
          y: {
            tick: {
              format: d3.format("$,")
            }
          }
        },
        subchart: {
          show: true
        }
      });
    }
  };
</script>

<style lang="scss" ref="stylesheet/scss">
    @import '~c3/src/scss/main.scss';
</style>
