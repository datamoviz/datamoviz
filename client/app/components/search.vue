<template>
  <form action="#">
    <input type="search" placeholder="Filter on a movie..." v-model="searchedMovie" @keyup="search()" />
  </form>
</template>

<script>
  import { FILTERS_UPDATE } from '../event-bus';

  export default {
    name: 'search',
    data() {
      return {
        searchedMovie: ''
      }
    },
    methods: {
      search() {
        const { filters } = this.$bus;

        if (this.searchedMovie === '') {
          delete filters['$text'];
        } else {
          filters['$text'] = { $search: this.searchedMovie };
        }

        this.$bus.$emit(FILTERS_UPDATE, filters);
      }
    }
  }
</script>

<style scoped lang="scss" ref="stylesheet/scss">
  form {
    text-align: center;
    padding: 10px;

    input {
      border: 0;
      height: 40px;
      width: 100%;
      max-width: 1100px;
      font-size: 18px;
      padding: 2px 10px;
      border-radius: 3px;
    }
  }
</style>
