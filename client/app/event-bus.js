import Vue from 'vue';

export const FILTERS_UPDATE = 'filters-update';
export const FILTERS_GENRE_TOGGLE = 'filters-genre-toggle';

export const EventBus = new Vue({
  data() {
    return {
      filters: {}
    };
  },
  mounted () {
    this.$on(FILTERS_UPDATE, (filters) => {
      this.filters = filters;
    });
  }
});
