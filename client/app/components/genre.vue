<template>
    <div class="col-sm-6 col-md-4">
        <input :id="'genre-' + name" type="checkbox" v-model="value" :value="name" @change="refreshFilters()" />
        <label :for="'genre-' + name">{{ name }}</label>
    </div>
</template>

<script>
  import { FILTERS_UPDATE, FILTERS_GENRE_TOGGLE } from '../event-bus';

  export default {
    name: 'genre',
    props: {
      name: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        value: true
      };
    },
    methods: {
      toggleNone(filters) {
        const excluded = filters.genres || {};

        if (this.value) {
          delete filters.genres.$ne;
          if (Object.keys(filters.genres).length === 0) {
            delete filters.genres;
          }
        } else {
          excluded.$ne = [];
          filters.genres = excluded;
        }
      },
      toggleGenre(filters) {
        const excluded = filters.genres || { $nin: [] };
        excluded.$nin = excluded.$nin || [];

        if (this.value) {
          excluded.$nin.splice(excluded.$nin.indexOf(this.name), 1);

          filters.genres = excluded;
          if (filters.genres.$nin.length === 0) {
            delete filters.genres.$nin;
          }
          if (Object.keys(filters.genres).length === 0) {
            delete filters.genres;
          }
        } else {
          excluded.$nin.push(this.name);

          filters.genres = excluded;
        }
      },
      refreshFilters() {
        const { filters } = this.$bus;

        if (this.name === 'None') {
          this.toggleNone(filters);
        } else {
          this.toggleGenre(filters);
        }

        this.$bus.$emit(FILTERS_UPDATE, filters);
      }
    },
    mounted() {
      this.$bus.$on(FILTERS_GENRE_TOGGLE, (enable) => {
        this.value = enable;
      });
    }
  };
</script>
