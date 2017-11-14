<template>
  <main>
    <app-header></app-header>
    <app-filters></app-filters>
    <app-overview></app-overview>
    <app-movies></app-movies>
    <section>
      <div class="container">
        <div class="row">
          <app-network></app-network>
          <app-words></app-words>
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
