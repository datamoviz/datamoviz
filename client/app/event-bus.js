import Vue from 'vue';

export const EventBus = new Vue({
  data() {
    return {
      filters: {
        'production_countries': { $in: [] },
        'genres.name': { $nin: [] }
      }
    }
  },
  mounted () {
    this.$on(FILTERS_UPDATE, (filters) => {
      this.filters = filters;
    });
  }
});

export const FILTERS_UPDATE = 'filters-update';
