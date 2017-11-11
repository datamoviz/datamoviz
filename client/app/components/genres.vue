<template>
    <div class="col-md-6">
    <h3>Genres
      <small>
        <input type="checkbox" id="toggle-all" v-model="enabled" @change="toggleAll()" />
        <label for="toggle-all">Toggle all</label>
      </small>
    </h3>
    <div class="row filters">
      <div class="col" v-if="genres.length === 0">
        <i class="fa fa-spinner fa-spin"></i> Loading...
      </div>
      <template v-else>
        <genre v-for="genre in genres" :key="genre.id" :name="genre.name"></genre>
      </template>
    </div>
  </div>
</template>

<script>
  import { FILTERS_UPDATE, FILTERS_GENRE_TOGGLE } from '../event-bus';
  import Genre from './genre.vue';

  export default {
    name: 'genres',
    components: {
      Genre
    },
    data() {
      return {
        genres: [],
        enabled: true
      };
    },
    methods: {
      toggleAll() {
        this.$bus.$emit(FILTERS_GENRE_TOGGLE, this.enabled);

        const { filters } = this.$bus;

        if (this.enabled) {
          delete filters['genres.name'];
          delete filters.genres;
        } else {
          filters['genres.name'] = { $nin: this.genres.map(genre => genre.name) };
          filters.genres = { $exists: true, $ne: [] };
        }

        this.$bus.$emit(FILTERS_UPDATE, filters);
      },
      sortGenres(unsorted) { // Sorting genre in columns instead of lines
        const nbElements = unsorted.length + 1; // "None" will be added later
        const nbColumns = 3;
        const genres = [];
        for (let i = 6, j = 2; i < (nbElements ** 2) / nbColumns; i += nbElements / nbColumns, ++j) {
          genres.push(unsorted[i % nbElements]);

          if (j % nbColumns === 0) {
            ++i;
          }
        }

        return genres;
      }
    },
    mounted() {
      return fetch('http://localhost:3030/genres')
        .then(response => response.json())
        .then((json) => {
          json = json.sort((a, b) => (a.name > b.name ? 1 : -1));

          const genres = this.sortGenres(json);
          genres.unshift({ id: -1, name: 'None' });

          this.genres = genres;
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
</style>
