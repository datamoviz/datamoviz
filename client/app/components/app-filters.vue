<template>
  <section class="highlight">
    <div class="container">
      <div class="row">
        <div class="col-12"><h2>Filters</h2></div>
        <genres></genres>
        <countries></countries>
      </div>
    </div>
  </section>
</template>

<script>
  import Genres from './genres.vue';
  import Countries from './countries.vue';

  export default {
    name: 'app-filters',
    components: {
      Genres,
      Countries
    }
  };
</script>
