<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <search></search>
        <div class="row">
          <div class="col-12 col-md-6">
            <genres-filter></genres-filter>
          </div>
          <div class="col-12 col-md-6">
            <content-rating-filter></content-rating-filter>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import GenresFilter from './filter-genres.vue';
  import ContentRatingFilter from './filter-content-rating.vue';
  import Search from './search.vue'

  export default {
    name: 'app-filters',
    components: {
      GenresFilter,
      ContentRatingFilter,
      Search
    }
  };
</script>
