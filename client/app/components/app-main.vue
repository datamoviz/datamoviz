<template>
  <main>
    <app-header></app-header>
    <app-filters></app-filters>
    <app-overview></app-overview>
    <section>
      <div class="container">
        <div class="row">
          <div class="col col-md-8">
            <h3>Statistics (WIP)</h3>
            <div class="row">
              <div class="col col-sm-6 col-md-4">
                <p>Repartition between colors and b&w</p>
              </div>
              <div class="col col-sm-6 col-md-4">
                <p>Average duration</p>
              </div>
              <div class="col col-sm-6 col-md-4">
                <p>Repartition of languages</p>
              </div>
              <div class="col col-sm-6 col-md-4">
                <p>Repartition of revenues</p>
              </div>
              <div class="col col-sm-6 col-md-4">
                <p>Average evaluation of movies (with average number of evaluations)</p>
              </div>
              <div class="col col-sm-6 col-md-4">
                <p>Repartition of content ratings</p>
              </div>
              <div class="col">
                <p>Repartition of movies / month</p>
              </div>
            </div>
          </div>
          <app-words></app-words>
        </div>
      </div>
    </section>
    <app-movies></app-movies>
    <app-network></app-network>
    <section>
      <div class="container">
        <div class="row">
          <div class="col">
            <h2>Actors</h2>
            <p>Revenue, top actors, ...</p>
          </div>
        </div>
      </div>
    </section>
    <app-footer></app-footer>
  </main>
</template>

<script>
  import AppHeader from './app-header.vue';
  import AppFilters from './app-filters.vue';
  import AppOverview from './app-overview.vue';
  import AppMovies from './app-movies.vue';
  import AppWords from './app-words.vue';
  import AppNetwork from './app-network.vue';
  import AppFooter from './app-footer.vue';

  export default {
    name: 'app-main',
    components: {
      AppHeader,
      AppOverview,
      AppFilters,
      AppNetwork,
      AppMovies,
      AppWords,
      AppFooter
    }
  };
</script>

<style lang="scss" ref="stylesheet/scss">
  @import '../scss/main';
</style>
