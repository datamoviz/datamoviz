<template>
  <main>
    <app-header></app-header>
    <app-filters></app-filters>
    <app-overview></app-overview>
    <app-map></app-map>
    <app-stats></app-stats>
    <app-movies></app-movies>
    <app-network></app-network>
    <app-footer></app-footer>
    <scroller></scroller>
  </main>
</template>

<script>
  import AppHeader from './app-header.vue';
  import AppFilters from './app-filters.vue';
  import AppOverview from './app-overview.vue';
  import AppStats from './app-stats.vue';
  import AppMovies from './app-movies.vue';
  import AppNetwork from './app-network.vue';
  import AppMap from './app-map.vue';
  import AppFooter from './app-footer.vue';
  import Scroller from './scroller.vue';


  export default {
    name: 'app-main',
    components: {
      AppHeader,
      AppOverview,
      AppMap,
      AppStats,
      AppFilters,
      AppNetwork,
      AppMovies,
      AppFooter,
      Scroller
    }
  };
</script>

<style lang="scss" ref="stylesheet/scss">
  @import '../scss/main';
</style>
