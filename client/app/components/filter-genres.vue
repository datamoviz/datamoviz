<template>
  <div class="col-12 col-md-6">
    <h3>Genres
      <small>
        <input type="checkbox" id="toggle-all" v-model="enabled" @change="toggleAll()" />
        <label for="toggle-all">Toggle all</label>
      </small>
    </h3>
    <div class="row filters">
      <template v-if="genres.length !== 0">
        <genre v-for="genre, key in genres" :key="key" :name="genre"></genre>
      </template>
      <div class="col" v-else-if="!failure">
        <i class="fa fa-spinner fa-spin"></i> Loading...
      </div>
      <div class="col failure" v-else>
        Failed to reach server.
      </div>
    </div>
    <search ref="searchField"></search>
  </div>
</template>

<script>
  import { FILTERS_UPDATE, FILTERS_GENRE_TOGGLE } from '../event-bus';
  import Genre from './genre.vue';
  import Search from './search.vue';

  export default {
    name: 'filter-genres',
    components: {
      Genre,
      Search
    },
    data() {
      return {
        genres: [],
        enabled: true,
        failure: false
      };
    },
    methods: {
      toggleAll() {
        this.$bus.$emit(FILTERS_GENRE_TOGGLE, this.enabled);

        const { filters } = this.$bus;

        if (this.enabled) {
          delete filters.genres;
          delete filters.genres;
        } else {
          filters.genres = {
            $nin: this.genres.slice(), // Duplicating entire array
            $ne: []
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
        })
        .catch(() => {
          this.failure = true;
        });
    }
  };
</script>

<style lang="scss" ref="stylesheet/scss">
  @import '../scss/vars';

  h3 small {
    font-size: 0.6em;

    input[type="checkbox"] {
      transform: scale(0.7);
      vertical-align: -3px;
      margin: 0 2px 0 5px;
    }
  }

  div.filters div:first-child label {
    font-style: italic;
  }

  .failure {
    color: $global-color-danger;
  }
</style>
