<template>
  <main>
    <app-header></app-header>
    <app-filters></app-filters>
    <app-overview></app-overview>
    <app-network></app-network>
    <app-footer></app-footer>
  </main>
</template>

<script>
  import AppHeader from './app-header.vue';
  import AppFilters from './app-filters.vue';
  import AppOverview from './app-overview.vue';
  import AppNetwork from './app-network.vue';
  import AppFooter from './app-footer.vue';

  export default {
    name: 'app-main',
    components: {
      AppHeader,
      AppOverview,
      AppFilters,
      AppNetwork,
      AppFooter
    }
  }
</script>

<style lang="scss" ref="stylesheet/scss">
  @import '../scss/main';
</style>
