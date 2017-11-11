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

  export default {
    name: 'app-overview',
    mounted() {
      c3.generate({
        bindto: this.$refs.overviewChart,
        data: {
          x: 'Years',
          columns: [
            ['Years', ...[...new Array(117).keys()].map((val) => 1900 + val)],
            ['Evolution of movies budget', ...[...new Array(117).keys()].map((val) => Math.round(Math.random() * val**3))],
            ['Evolution of movies revenues', ...[...new Array(117).keys()].map((val) => Math.round(Math.random() * val**3.3))]
          ],
          colors: {
            'Evolution of movies budget': '#009946'
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
