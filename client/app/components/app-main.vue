<template>
  <main :class="{ 'with-filters': nbFilters > 0 }">
    <app-header></app-header>
    <app-filters-list></app-filters-list>
    <app-map></app-map>
    <app-overview></app-overview>
    <app-stats></app-stats>
    <app-network></app-network>
    <app-movies></app-movies>
    <app-footer></app-footer>
    <scroller></scroller>
  </main>
</template>

<script>
  import { FILTERS_UPDATE } from '../event-bus';
  import AppHeader from './app-header.vue';
  import AppFiltersList from './app-filters-list.vue';
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
      AppFiltersList,
      AppFilters,
      AppOverview,
      AppMap,
      AppStats,
      AppNetwork,
      AppMovies,
      AppFooter,
      Scroller
    },
    data() {
      return {
        nbFilters: 0
      }
    },
    mounted() {
      this.$bus.$on(FILTERS_UPDATE, (filters) => {
        this.nbFilters = Object.keys(filters).length;
      });
    }
  };
</script>

<style lang="scss" ref="stylesheet/scss">
  @import '../scss/main';

  main {
    padding-top: 0;
    transition: padding .5s;

    &.with-filters {
      padding-top: 40px;
    }
  }
</style>
