<template>
  <div class="movie-container">
    <a href="#" :class="{ highlighted: highlighted, hidden: hidden }" @click.prevent="select()">
      <img :src="posterPath" />
      <span class="title">
        {{ movie.title }}
        <span class="badge" v-if="movie.adult">NSFW</span>
      </span>
    </a><!--
    --><div class="details" :class="{ visible: highlighted }">
      <h3>
        <span v-for="country in movie.production_countries" :key="country.iso_3166_1"><img :src="`http://www.geonames.org/flags/s/${country.iso_3166_1.toLowerCase()}.png`" :alt="country.name" :title="country.name" />&nbsp;</span><!--
        -->{{ movie.original_title }}
        <small><i class="fa fa-language"></i> {{ movie.spoken_languages.map(a => a.name).join(', ') }}</small>
      </h3>
      <p>
        <span class="badge">IMDb {{ movie.imdb_id }}</span>
        <span class="badge">{{ movie.release_date }}</span>
      </p>
      <p class="overview">{{ movie.overview }}</p>
      <p>
        {{ movie.vote_average }}<i class="fa fa-star"></i>/10, {{ movie.vote_count }} evaluations
        <small>(popularity: {{ movie.popularity }})</small> &bull;
        Budget: ${{ movie.budget }}, revenue: ${{ movie.revenue }}.
      </p>
      <p><span v-for="genre in movie.genres" :key="genre.id"><span class="badge">{{ genre.name }}</span>&nbsp;</span></p>
    </div>
  </div>
</template>

<script>
  import { FILTERS_UPDATE, MOVIE_SELECTED } from '../event-bus';

  export default {
    name: 'thumbnail',
    props: ['movie', 'position', 'total'],
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
        highlighted: false,
        hidden: false
      };
    },
    methods: {
      select() {
        this.highlighted = true;
        this.$bus.$emit(MOVIE_SELECTED, this.movie, this.shift());
      },
      shift() {
        if (!this.highlighted) {
          return 0;
        }

        const shift = (this.total + 1) - (this.position * 2);

        return 100 * shift;
      }
    },
    mounted() {
      this.$bus.$on(MOVIE_SELECTED, (movie) => {
        this.highlighted = movie.imdb_id === this.movie.imdb_id;
        this.hidden = !this.highlighted;
      });
      this.$bus.$on(FILTERS_UPDATE, () => {
        this.hidden = false;
        this.highlighted = false;
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

      &:focus {
        opacity: 1;
        outline: none;
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

      &.hidden {
        opacity: 0;
        pointer-events: none;
      }

      img {
        height: 300px;
        display: block;
        width: 100%;
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
      height: 390px;
      text-align: left;
      width: 0;
      overflow: hidden;
      padding: 0;
      transition: opacity 0s, width .6s linear, padding .6s linear;
      opacity: 0;

      &.visible {
        width: 900px;
        opacity: 1;
        padding: 0 10px 0 30px;
        transition: opacity 1s linear .6s, width .6s linear;
      }

      p {
        text-align: justify;

        &.overview {
          margin-bottom: 30px;
        }
      }
    }
  }
</style>
