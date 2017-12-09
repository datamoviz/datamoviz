<template>
  <div :class="{ 'collapsed': hide, 'edit-mode': edit }" class="filters-menu">
    <app-filters></app-filters>
    <div class="filters-list" :class="{ 'hidden': hide }">
      <span class="filter" v-for="genre, key in values.genres" :key="key">
        <i class="fa fa-folder"></i> {{ genre }} <a href="#" @click.prevent="removeFilter('genres', key)"><i class="fa fa-times"></i></a>
      </span><template v-if="values.dates.length > 0">
        <span class="filter">
          <i class="fa fa-calendar"></i> {{ values.dates[0]|date('%Y') }} - {{ values.dates[1]|date('%Y') }} <a href="#" @click.prevent="removeFilter('dates')"><i class="fa fa-times"></i></a>
        </span>
      </template><span class="filter" v-for="country, key in values.countries" :key="key">
        <i class="fa fa-globe"></i> {{ country.name }} <a href="#" @click.prevent="removeFilter('countries', key)"><i class="fa fa-times"></i></a>
      </span><template  v-if="values.search.length !== 0">
        <span class="filter" v-for="word, key in values.search.split(' ')" :key="key">
          <i class="fa fa-search"></i> {{ word }} <a href="#" @click.prevent="removeFilter('search', key)"><i class="fa fa-times"></i></a>
        </span>
      </template><span class="filter" v-for="rating, key in values.ratings" :key="key">
        <i class="fa fa-child"></i> {{ rating }} <a href="#" @click.prevent="removeFilter('ratings', key)"><i class="fa fa-times"></i></a>
      </span>
      <a href="#" @click.prevent="edit = !edit" class="toggle-edit">
        <template v-if="edit">Close filters</template>
        <template v-else>Edit filters</template>
      </a>
    </div>
  </div>
</template>

<script>
  import { FILTERS_UPDATE } from '../event-bus';
  import AppFilters from './app-filters.vue';

  export default {
    name: 'app-filters-list',
    components: {
      AppFilters
    },
    data() {
      return {
        hide: true,
        edit: false,
        filters: {
          'countries': ['production_countries', '$all'],
          'genres': ['genres', '$all'],
          'dates': ['release_date', ['$gte', '$lte']],
          'ratings': ['content_rating', '$in'],
          'search': ['$text', '$search']
        },
        values: {
          'countries': [],
          'genres': [],
          'dates': [],
          'ratings': [],
          'search': []
        }
      }
    },
    methods: {
      removeFilter(type, key) {
        const { filters } = this.$bus;

        if (key === undefined) {
          delete filters[this.filters[type][0]];
        } else {
          const filter = filters[this.filters[type][0]][this.filters[type][1]];
          filter.splice(key, 1);

          if (filter.length === 0) {
            delete filters[this.filters[type][0]];
          }
        }

        this.$bus.$emit(FILTERS_UPDATE, filters);
      }
    },
    mounted() {
      this.$bus.$on(FILTERS_UPDATE, (filters) => {
        Object.keys(this.filters).forEach(key => {
          const key1 = this.filters[key][0];
          if (filters.hasOwnProperty(key1)) {
            const key2 = this.filters[key][1];
            if (Array.isArray(key2)) {
              key2.forEach(subKey => {
                this.values[key].push(filters[key1][subKey]);
              })
            } else {
              this.values[key] = filters[key1][key2];
            }
          } else {
            this.values[key] = [];
          }
        });

        this.hide = Object.keys(filters).length === 0;
      });
    }
  };
</script>

<style scoped lang="scss" ref="stylesheet/scss">
  @import '../scss/vars';

  div.filters-menu {
    background: $global-color-primary;
    white-space: nowrap;
    position: fixed;
    width: 100%;
    z-index: 100;
    transition: top .5s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    top: -57px;

    .filters-list {
      border-top: 1px solid rgba(255, 255, 255, 0.3);
      padding-right: 100px;
      margin-top: 10px;
      height: 44px;
      transition: height .5s;
      overflow-x: scroll;
      width: 100%;

      &.hidden {
        border-top: 0;
        margin-top: 0;
        height: 44px;
      }

      &::-webkit-scrollbar {
        height: 0;
        background: transparent;
      }
    }

    &.collapsed {
      top: -57px;

      .filters-list {
        height: 0;
      }
    }

    &.edit-mode {
      top: 64px;
    }

    .filter, a.toggle-edit {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 15px;
      padding: 3px 10px;
      display: inline-block;
      margin: 9px 3px 9px;
      font-size: 0.8em;
      color: white;

      a {
        color: darken($global-color-primary, 2.5);
      }
    }

    a.toggle-edit {
      position: fixed;
      right: 10px;
      top: 63px;
      background: white;
      color: $global-color-primary;
      transition: opacity .5s linear .5s;
      opacity: 1;
      border: 1px solid #009946;
    }
  }
</style>
