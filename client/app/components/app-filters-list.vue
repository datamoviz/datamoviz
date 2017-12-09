<template>
  <div :class="{ 'collapsed': hide, 'edit-mode': edit }" class="filters-menu">
    <app-filters></app-filters>
    <div class="filters-list" :class="{ 'hidden': hide }">
      <span class="filter" v-for="genre, key in genres" :key="key">
        <i class="fa fa-folder"></i> {{ genre }}
      </span><template v-if="startDate !== null && endDate !== null">
        <span class="filter">
          <i class="fa fa-calendar"></i> {{ startDate|date('%Y') }} - {{ endDate|date('%Y') }}
        </span>
      </template><span class="filter" v-for="country, key in countries" :key="key">
        <i class="fa fa-globe"></i> {{ country.name }}
      </span><template  v-if="keywords !== ''">
        <span class="filter" v-for="word, key in keywords.split(' ')" :key="key">
          <i class="fa fa-search"></i> {{ word }}
        </span>
      </template><span class="filter" v-for="rating, key in contentRatings" :key="key">
        <i class="fa fa-child"></i> {{ rating }}
      </span>
      <a href="#" @click.prevent="edit = !edit">
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
        genres: [],
        countries: [],
        contentRatings: [],
        startDate: null,
        endDate: null,
        keywords: '',
        hide: true,
        edit: false
      }
    },
    methods: {
      loadGenres(filters) {
        if (filters.hasOwnProperty('genres')) {
          this.genres = filters.genres.$all;
        } else {
          this.genres = [];
        }
      },
      loadDateRange(filters) {
        if (filters.hasOwnProperty('release_date')) {
          this.startDate = filters.release_date.$gte;
          this.endDate = filters.release_date.$lte;
        } else {
          this.startDate = null;
          this.endDate = null;
        }
      },
      loadCountries(filters) {
        if (filters.hasOwnProperty('production_countries')) {
          this.countries = filters.production_countries.$all;
        } else {
          this.countries = [];
        }
      },
      loadKeywords(filters) {
        if (filters.hasOwnProperty('$text')) {
          this.keywords = filters.$text.$search;
        } else {
          this.keywords = '';
        }
      },
      loadContentRatings(filters) {
        if (filters.hasOwnProperty('content_rating')) {
          this.contentRatings = filters.content_rating.$in;
        } else {
          this.contentRatings = [];
        }
      }
    },
    mounted() {
      this.$bus.$on(FILTERS_UPDATE, (filters) => {
        this.loadGenres(filters);
        this.loadDateRange(filters);
        this.loadCountries(filters);
        this.loadKeywords(filters);
        this.loadContentRatings(filters);

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

    .filter, a {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 15px;
      padding: 3px 10px;
      display: inline-block;
      margin: 9px 3px 9px;
      font-size: 0.8em;
      color: white;
    }

    a {
      position: fixed;
      right: 10px;
      top: 64px;
      background: white;
      color: $global-color-primary;
      transition: opacity .5s linear .5s;
      opacity: 1;
    }
  }
</style>
