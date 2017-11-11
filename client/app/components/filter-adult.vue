<template>
  <div class="col-12">
    <h3>Adult movies</h3>
    <input type="checkbox" id="filter-adult" @change="refreshFilter()" v-model="exclude" />
    <label for="filter-adult">
      Exclude adult movies <span class="badge"><i class="fa fa-warning"></i> NSFW results may still occur</span>
    </label>
  </div>
</template>

<script>
  import { FILTERS_UPDATE } from '../event-bus';

  export default {
    name: 'filter-adult',
    data() {
      return {
        exclude: false
      };
    },
    methods: {
      refreshFilter() {
        const { filters } = this.$bus;

        if (this.exclude) {
          filters.adult = { $ne: true };
        } else {
          delete filters.adult;
        }

        this.$bus.$emit(FILTERS_UPDATE, filters);
      }
    }
  };
</script>

<style scoped lang="scss" ref="stylesheet/scss">
</style>
