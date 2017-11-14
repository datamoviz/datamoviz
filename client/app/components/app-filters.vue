<template>
  <section class="highlight">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2>Filters</h2>
          <div class="row">
            <genres-filter></genres-filter>
            <div class="col-12 col-md-6">
              <countries-filter></countries-filter>
              <adult-filter></adult-filter>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import GenresFilter from './filter-genres.vue';
  import CountriesFilter from './filter-countries.vue';
  import AdultFilter from './filter-adult.vue';

  export default {
    name: 'app-filters',
    components: {
      GenresFilter,
      CountriesFilter,
      AdultFilter
    }
  };
</script>

<style scoped lang="scss" ref="stylesheet/scss">
  section {
    min-height: 350px;
  }
</style>
