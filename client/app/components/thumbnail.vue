<template>
  <div class="movie-container">
    <a href="#" :class="{ highlighted: highlighted }" @click.prevent="select()">
      <img :src="posterPath" />
      <span class="title">{{ movie.title }}</span>
    </a><!--
    --><div class="details" :class="{ visible: highlighted }">
      <ul>
        <li>Original title: {{ movie.original_title }}</li>
        <li>IMDb ID: {{ movie.imdb_id }}</li>
        <li>Popularity: {{ movie.popularity }}</li>
        <li>Budget: ${{ movie.budget }}, Revenue: ${{ movie.revenue }}</li>
        <li>Spoken languages: {{ movie.spoken_languages.map(a => a.name).join(', ') }}</li>
        <li>Vote: {{ movie.vote_average }} ({{ movie.vote_count }} notes)</li>
        <li>Release date: {{ movie.release_date }}</li>
        <li>
          Production countries: {{ movie.production_countries.map(a => a.name).join(', ') }}
        </li>
        <li>Genres: {{ movie.genres.map(a => a.name).join(', ') }}</li>
      </ul>
      <p>{{ movie.overview }}</p>
    </div>
  </div>
</template>

<script>
  import { FILTERS_UPDATE, MOVIE_SELECTED } from '../event-bus';

  export default {
    name: 'thumbnail',
    props: ['movie'],
    computed: {
      posterPath () {
        if (this.movie.poster_path === null) {
          return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL4AAAEDCAMAAAC8iU6wAAAAGFBMVEWZmZmwsLCcnJyqqqqkpKSnp6efn5+tra2TtCY9AAACRklEQVR4nO3Z626CMABAYWhLef83HhdRaEzUWTw0OSf7sS4ZfCiWrutyaLium75aTj6ZfDL5ZPLJ5JPJJ5NPJp9MPpl8Mvlk8snkk8knk08mn0w+mXwy+WTyyeSTySeTTyafTD6ZfDL5ZPLJ5JPJJ5NPJp9MPpl8Mvlk8snkk8knk08mn0w+mXwy+WTyyeSTySeTTyafTD6ZfDL55RHTVDk+61Wqfdwc+6VhO/6wjuM5F1D5qKnfGpcjh/H+g/Tqd/9TXX7u+4N/p+/7XPVUa3X5e+18/8T9eKx6qrWq/NQfCuE4PuH2qcqPBbe4nOH1ET7tl/xY81xr8h81zi8/uvk4vvpH9zjTxGIivfzEeXz5w/Exdspjt/KiYSi0u+s5Ydqsv2RLt/tlvC0R8jY+ZclzwoI5DTEOu/VNnsclPox1pqGa/Mn5ou0qpvfkSvw0w4pZ/2mrP1V7CFThz5zcvaFf0cP9u6+rxk9v8+PjQr7u9/y4ex++7sf84jb6Ovny/5385vlh2dVplt+FeROzXf6S/I+TvyX/437Mf2yetMq/7fm3yr+9/u3yl78WG+bPi6TL8cfX+vtWW7rePk/Y7+g8v5bqW+T+V51MPpl8Mvlk8snkk8knk08mn0w+mXwy+WTyyeSTySeTTyafTD6ZfDL5ZPLJ5JPJJ5NPJp9MPpl8Mvlk8snkk8knk08mn0w+mXwy+WTyyeSTySeTTyafTD6ZfDL5ZPLJ5JPJJ5NPJp9MPpl8Mvlk8snkk8knk08mnyyHhuv+AMviDaCX0YnaAAAAAElFTkSuQmCC';
        }

        return `https://image.tmdb.org/t/p/w320${this.movie.poster_path}`;
      }
    },
    data() {
      return {
        highlighted: false
      };
    },
    methods: {
      select() {
        this.$bus.$emit(MOVIE_SELECTED, this.movie);
      }
    },
    mounted() {
      this.$bus.$on(FILTERS_UPDATE, (filters) => {
        if (!Object.prototype.hasOwnProperty.call(filters, 'imdb_id')) {
          this.highlighted = false;
        } else {
          this.highlighted = filters.imdb_id.$eq === this.movie.imdb_id;
        }
      });
    }
  };
</script>

<style scoped lang="scss" ref="stylesheet/scss">
  @import '../scss/vars';

  .movie-container {
    display: inline-block;

    a {
      opacity: 0.5;
      transition: opacity .4s;
      color: white;
      text-align: center;
      vertical-align: top;
      display: inline-block;
      width: 200px;
      overflow: hidden;

      &:hover {
        opacity: 1;
      }

      &.highlighted {
        opacity: 1;

        img {
          border-top-left-radius: 5px;
          border-top-right-radius: 5px;
        }

        .title {
          background: $global-color-primary;
          border-bottom-left-radius: 3px;
          border-bottom-right-radius: 3px;
        }
      }

      img {
        height: 300px;
        display: block;
      }

      .title {
        display: inline-block;
        width: 200px;
        font-size: 0.9em;
        padding: 10px 5px;
      }
    }
    .details {
      display: inline-block;
      height: 360px;
      text-align: left;
      width: 0;
      overflow: hidden;
      padding: 0;
      transition: width .5s;
      opacity: 0;

      &.visible {
        width: 900px;
        opacity: 1;
        padding: 10px;
      }

      p {
        text-align: justify;
      }
    }
  }
</style>
