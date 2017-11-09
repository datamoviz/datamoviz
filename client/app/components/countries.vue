<template>
  <div class="col-md-6">
    <h3>Production countries</h3>
    <div v-if="countries.length === 0">
      <i class="fa fa-spinner fa-spin"></i> Loading...
    </div>
    <div v-else>
      <multiselect
              placeholder="Choose the countries you want to filter on"
              v-model="selected"
              :options="countries"
              :multiple="true"
              label="name"
              track-by="iso_3166_1"
              :close-on-select="false"
              @input="refreshFilters">
      </multiselect>
    </div>
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect';
  import { FILTERS_UPDATE } from '../event-bus';

  export default {
    name: 'countries',
    components: {
      Multiselect
    },
    methods: {
      refreshFilters() {
        const { filters } = this.$bus;

        filters.production_countries.$in = this.selected;

        this.$bus.$emit(FILTERS_UPDATE, filters);
      }
    },
    data() {
      return {
        selected: [],
        countries: []
      };
    },
    mounted() {
      return fetch('http://localhost:3030/countries')
        .then(response => response.json())
        .then((json) => {
          this.countries = json;
        });
    }
  };
</script>

<style lang="scss" ref="stylesheet/scss">
  @import '~vue-multiselect/dist/vue-multiselect.min.css';
  @import '../scss/vars';

  .multiselect__option.multiselect__option--highlight,
  .multiselect__option.multiselect__option--highlight::after,
  .multiselect__tag {
      background: $global-color-primary;
    }
</style>
