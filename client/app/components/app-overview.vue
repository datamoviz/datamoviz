<template>
  <section>
    <div class="container">
      <form class="row">
        <div class="col-12"><h2>Overview</h2></div>
        <div class="col-sm-3 col-md-2">
          <input type="radio" id="overview-budget" checked /> <label for="overview-budget">Budget</label>
        </div>
        <div class="col-sm-3 col-md-2">
          <input type="radio" id="overview-duration" /> <label for="overview-duration">Duration</label>
        </div>
        <div class="col-sm-3 col-md-2">
          <input type="radio" id="overview-entries" /> <label for="overview-entries">Entries</label>
        </div>
      </form>
      <div class="row">
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
          columns: [
            ['Evolution of movies budget', 30, 200, 100, 400, 150, 250]
          ],
          colors: {
            'Evolution of movies budget': '#009946'
          }
        }
      });
    }
  }
</script>

<style lang="scss" ref="stylesheet/scss">
    @import '~c3/src/scss/main.scss';
</style>
