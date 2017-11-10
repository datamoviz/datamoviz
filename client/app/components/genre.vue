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
        value: true,
      }
    },
    methods: {
      toggleNone(filters) {
        if (this.value) {
          delete filters['genres'];
        } else {
          filters['genres'] = { $exists: true, $ne: [] };
        }
      },
      toggleGenre(filters) {
        const excluded = filters['genres.name'] || { $nin: [] };

        if (this.value) {
          excluded.$nin.splice(excluded.$nin.indexOf(this.name), 1);

          filters['genres.name'] = excluded;
          if (filters['genres.name'].$nin.length === 0) {
            delete filters['genre.name'];
          }
        } else {
          excluded.$nin.push(this.name);

          filters['genres.name'] = excluded;
        }
      },
      refreshFilters() {
        let { filters } = this.$bus;

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
      })
    }
  };
</script>
