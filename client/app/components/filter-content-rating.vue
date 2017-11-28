<template>
  <div>
    <h3>Content rating</h3>
    <div v-if="contentRatings.length !== 0">
      <multiselect
        placeholder="Choose the content ratings you want to filter on..."
        v-model="selected"
        :options="contentRatings"
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
    name: 'content-rating-filter',
    components: {
      Multiselect
    },
    data() {
      return {
        exclude: false,
        contentRatings: [],
        selected: []
      };
    },
    methods: {
      refreshFilters() {
        const { filters } = this.$bus;

        if (this.selected.length === 0) {
          delete filters.content_rating;
        } else {
          filters.content_rating = { $in: this.selected };
        }

        this.$bus.$emit(FILTERS_UPDATE, filters);
      }
    },
    mounted() {
      return fetch(`${process.env.SERVER_URL}/list/content-ratings`)
        .then(response => response.json())
        .then((json) => {
          json.splice(json.indexOf(null), 1);
          this.contentRatings = json;
        });
    }
  };
</script>
