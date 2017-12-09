<template>
  <div>
    <div v-if="genres.length !== 0">
      <multiselect
        placeholder="Choose the genres you want to filter on..."
        v-model="selected"
        :options="genres"
        :multiple="true"
        :close-on-select="false"
        @input="refreshFilters">
      </multiselect>
    </div>
    <div v-else>
      <i class="fa fa-spinner fa-spin"></i> Loading...
    </div>
  </div>
</template>

<script>
  import Multiselect from 'vue-multiselect';
  import { FILTERS_UPDATE } from '../event-bus';

  export default {
    name: 'filter-genres',
    components: {
      Multiselect
    },
    data() {
      return {
        genres: [],
        selected: []
      };
    },
    methods: {
      refreshFilters() {
        const { filters } = this.$bus;

        if (this.selected.length === 0) {
          delete filters.genres;
        } else {
          filters.genres = {
            $all: this.selected, // Duplicating entire array
          };
        }

        this.$bus.$emit(FILTERS_UPDATE, filters);
      }
    },
    mounted() {
      return fetch(`${process.env.SERVER_URL}/list/genres`)
        .then(response => response.json())
        .then((json) => {
          this.genres = json.sort();
          this.genres.unshift('None');
        });
    }
  };
</script>
