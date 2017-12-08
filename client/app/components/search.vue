<template>
  <form action="#" @submit.prevent="search()">
    <input type="search" placeholder="Filter on specific words..." v-model="searchedMovie" @input="search()" />
    <button type="reset" @click="reset()" :class="{ hidden: searchedMovie.length === 0 }"><i class="fa fa-times"></i></button>
  </form>
</template>

<script>
  import { FILTERS_UPDATE } from '../event-bus';

  export default {
    name: 'search',
    data() {
      return {
        searchedMovie: '',
        timeout: 0
      };
    },
    methods: {
      search() {
        clearTimeout(this.timeout);
        console.log('ok')
        this.timeout = setTimeout(() => {
          const { filters } = this.$bus;

          if (this.searchedMovie === '') {
            delete filters.$text;
          } else {
            filters.$text = { $search: `"${this.searchedMovie.replace(/ /g, '" "')}"` };
          }

          this.$bus.$emit(FILTERS_UPDATE, filters);
        }, 500);
      },
      reset() {
        this.searchedMovie = '';
        this.search();
      }
    }
  };
</script>

<style scoped lang="scss" ref="stylesheet/scss">
  @import '../scss/vars';
  $input-size: 1110px;

  form {
    text-align: center;
    padding: 10px 0;
    position: relative;
    margin: 0;

    input {
      border: 0;
      height: 40px;
      width: 100%;
      max-width: $input-size;
      font-size: 18px;
      padding: 2px 10px;
      border-radius: 3px;
      background: #53545c;
      color: white;

      &:focus {
        outline: none;
      }
    }

    button {
      position: absolute;
      right: 15px;
      border: 0;
      background: none;
      top: 20px;
      color: $global-color-danger;
      line-height: 0;

      &.hidden {
        display: none;
      }

      @media screen and (min-width: #{$input-size + 35px}) {
        right: calc((100% - #{$input-size})/2 + 5px);
      }
    }
  }
</style>
