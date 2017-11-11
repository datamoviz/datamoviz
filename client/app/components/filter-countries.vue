<template>
  <div class="col-12">
    <h3>Production countries</h3>
    <div v-if="countries.length !== 0">
      <multiselect
              placeholder="Choose the countries you want to filter on..."
              v-model="selected"
              :options="countries"
              :multiple="true"
              label="name"
              track-by="iso_3166_1"
              :close-on-select="false"
              @input="refreshFilters">
      </multiselect>
    </div>
    <div v-else-if="!failure">
      <i class="fa fa-spinner fa-spin"></i> Loading...
    </div>
    <div class="failure" v-else>
      Failed to reach server.
    </div>
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect';
  import { FILTERS_UPDATE } from '../event-bus';

  export default {
    name: 'filter-countries',
    components: {
      Multiselect
    },
    methods: {
      refreshFilters() {
        const { filters } = this.$bus;

        if (this.selected.length === 0) {
          delete filters.production_countries;
        } else {
          filters.production_countries = { $in: this.selected };
        }

        this.$bus.$emit(FILTERS_UPDATE, filters);
      }
    },
    data() {
      return {
        selected: [],
        countries: [],
        failure: false
      };
    },
    mounted() {
      return fetch(`${process.env.SERVER_URL}/countries`)
        .then(response => response.json())
        .then((json) => {
          this.countries = json;
        })
        .catch(() => {
          this.failure = true;
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

  .multiselect {
    margin-bottom: 10px;
  }

  .failure {
    color: $global-color-danger;
  }
</style>
