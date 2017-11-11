<template>
  <form action="#" @submit.prevent="search()">
    <input type="search" placeholder="Filter on a movie..." v-model="searchedMovie" @input="search()" />
    <button @click="reset()" :class="{ hidden: searchedMovie.length === 0 }"><i class="fa fa-times"></i></button>
  </form>
</template>

<script>
  import { FILTERS_UPDATE, MOVIE_SELECTED } from '../event-bus';

  export default {
    name: 'search',
    data() {
      return {
        searchedMovie: ''
      };
    },
    methods: {
      search() {
        const { filters } = this.$bus;

        delete filters.imdb_id;
        if (this.searchedMovie === '') {
          delete filters.$text;
        } else {
          filters.$text = { $search: `"${this.searchedMovie.replace(/ /g, '" "')}"` };
        }

        this.$bus.$emit(FILTERS_UPDATE, filters);
      },
      reset() {
        this.searchedMovie = '';
      }
    },
    mounted() {
      this.$bus.$on(MOVIE_SELECTED, (movie) => {
        const { filters } = this.$bus;

        this.searchedMovie = movie.title;
        filters.imdb_id = { $eq: movie.imdb_id };

        this.$bus.$emit(FILTERS_UPDATE, filters);
      });
    }
  };
</script>

<style scoped lang="scss" ref="stylesheet/scss">
  @import '../scss/vars';
  $input-size: 1100px;

  form {
    text-align: center;
    padding: 10px;
    position: relative;

    input {
      border: 0;
      height: 40px;
      width: 100%;
      max-width: $input-size;
      font-size: 18px;
      padding: 2px 10px;
      border-radius: 3px;
    }

    button {
      position: absolute;
      right: 15px;
      border: 0;
      background: none;
      top: 17px;
      color: $global-color-danger;

      &.hidden {
        display: none;
      }

      @media screen and (min-width: #{$input-size + 35px}) {
        right: calc((100% - #{$input-size})/2 + 5px);
      }
    }
  }
</style>
