<template>
    <div class="col-sm-6 col-md-4">
        <input :id="'genre-' + name" type="checkbox" checked :value="name" @click="refreshFilters" />
        <label :for="'genre-' + name">{{ name }}</label>
    </div>
</template>

<script>
  import { FILTERS_UPDATE } from '../event-bus';

  export default {
    name: 'genre',
    props: ['name'],
    methods: {
      refreshFilters() {
        const filters = this.$bus.filters;

        const i = filters['genres.name'].$nin.indexOf(this.name);
        if (i === -1) {
          filters['genres.name'].$nin.push(this.name);
        } else {
          filters['genres.name'].$nin.splice(i, 1);
        }

        this.$bus.$emit(FILTERS_UPDATE, filters);
      }
    }
  }
</script>
