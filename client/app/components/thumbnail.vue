<template>
  <a href="#" :class="{ highlighted: highlighted }" @click.prevent="select()">
    <img :src="posterPath" />
    <span class="title">{{ title }}</span>
  </a>
</template>

<script>
  import { FILTERS_UPDATE, MOVIE_SELECTED } from '../event-bus';

  export default {
    name: 'thumbnail',
    props: ['title', 'poster'],
    computed: {
      posterPath: function () {
        if (this.poster === null) {
          return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL4AAAEDCAMAAAC8iU6wAAAAGFBMVEWZmZmwsLCcnJyqqqqkpKSnp6efn5+tra2TtCY9AAACRklEQVR4nO3Z626CMABAYWhLef83HhdRaEzUWTw0OSf7sS4ZfCiWrutyaLium75aTj6ZfDL5ZPLJ5JPJJ5NPJp9MPpl8Mvlk8snkk8knk08mn0w+mXwy+WTyyeSTySeTTyafTD6ZfDL5ZPLJ5JPJJ5NPJp9MPpl8Mvlk8snkk8knk08mn0w+mXwy+WTyyeSTySeTTyafTD6ZfDL55RHTVDk+61Wqfdwc+6VhO/6wjuM5F1D5qKnfGpcjh/H+g/Tqd/9TXX7u+4N/p+/7XPVUa3X5e+18/8T9eKx6qrWq/NQfCuE4PuH2qcqPBbe4nOH1ET7tl/xY81xr8h81zi8/uvk4vvpH9zjTxGIivfzEeXz5w/Exdspjt/KiYSi0u+s5Ydqsv2RLt/tlvC0R8jY+ZclzwoI5DTEOu/VNnsclPox1pqGa/Mn5ou0qpvfkSvw0w4pZ/2mrP1V7CFThz5zcvaFf0cP9u6+rxk9v8+PjQr7u9/y4ex++7sf84jb6Ovny/5385vlh2dVplt+FeROzXf6S/I+TvyX/437Mf2yetMq/7fm3yr+9/u3yl78WG+bPi6TL8cfX+vtWW7rePk/Y7+g8v5bqW+T+V51MPpl8Mvlk8snkk8knk08mn0w+mXwy+WTyyeSTySeTTyafTD6ZfDL5ZPLJ5JPJJ5NPJp9MPpl8Mvlk8snkk8knk08mn0w+mXwy+WTyyeSTySeTTyafTD6ZfDL5ZPLJ5JPJJ5NPJp9MPpl8Mvlk8snkk8knk08mnyyHhuv+AMviDaCX0YnaAAAAAElFTkSuQmCC';
        }

        return `https://image.tmdb.org/t/p/w320${this.poster}`;
      }
    },
    data() {
      return {
        highlighted: false
      }
    },
    methods: {
      select() {
        const { filters } = this.$bus;

        filters['$text'] = { $search: this.title };

        this.$bus.$emit(MOVIE_SELECTED, filters);
      }
    },
    mounted() {
      this.$bus.$on(FILTERS_UPDATE, (filters) => {
        if (!filters.hasOwnProperty('$text')) {
          this.highlighted = false;
        } else {
          this.highlighted = filters['$text'].$search.replace(/"/g, '') === this.title;
        }
      });
    }
  };
</script>

<style scoped lang="scss" ref="stylesheet/scss">
  @import '../scss/vars';

  a {
    display: inline-block;
    opacity: 0.5;
    transition: opacity .4s;
    color: white;
    text-align: center;
    vertical-align: top;

    &:hover {
      opacity: 1;
    }

    &.highlighted {
      background: $global-color-primary;
      opacity: 1;
      border-bottom-left-radius: 3px;
      border-bottom-right-radius: 3px;
    }

    img {
      height: 300px;
      display: block;
    }

    .title {
      display: inline-block;
      width: 180px;
      font-size: 0.9em;
      padding: 10px 0;
      height: 60px;
    }
  }
</style>
