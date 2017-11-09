<template>
  <div class="col-md-6">
    <h3>Genres</h3>
      <div class="row filters">
        <div class="col" v-if="genres.length === 0">
          <i class="fa fa-spinner fa-spin"></i> Loading...
        </div>
        <template v-else>
            <genre :name="'None (WIP)'"></genre>
            <genre v-for="genre in genres" :name="genre.name" :key="genre.id"></genre>
        </template>
      </div>
  </div>
</template>

<script>
  import Genre from './genre.vue';

  export default {
    name: 'genres',
    components: {
      Genre
    },
    data() {
      return {
        genres: []
      };
    },
    mounted() {
      return fetch('http://localhost:3030/genres')
        .then(response => response.json())
        .then((json) => {
          this.genres = json;
        });
    }
  };
</script>

<style lang="scss" ref="stylesheet/scss">
  @import '../scss/vars';

  div.filters div:first-child label {
    font-style: italic;
  }
</style>
