<template>
  <section class="map">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <div ref="map" class="map"></div>
          <small>
            <span class="badge badge-info">Pro tip</span> Click on a country to filter on
          </small>
          <template v-if="paletteScale">
            <span v-for="b, key in paletteScale.clusters()" :key="key" class="legend">
              <span :style="{ background: paletteScale.range()[key] }" class="color"></span>
              <span class="limit">{{ b }}</span>
            </span>
            <span class="legend">
              <span :style="{ background: paletteScale.range()[paletteScale.clusters().length] }" class="color"></span>
            </span>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import * as d3 from 'd3';
  import Datamaps from 'datamaps';
  import IsoConverter from 'i18n-iso-countries';
  import { FILTERS_UPDATE } from '../event-bus';
  import scaleCluster from 'd3-scale-cluster';

  let map;

  export default {
    name: 'app-map',
    data() {
      return {
        countries: [],
        allCountries: {},
        paletteScale: null
      };
    },
    methods: {
      countCountries(filters) {
        filters = filters || {};

        return fetch(`${process.env.SERVER_URL}/count/countries?filters=${encodeURI(JSON.stringify(filters))}`)
          .then(response => response.json())
          .then((json) => {
            this.countries = this.formatCountries(json);

            if (Object.keys(this.allCountries).length === 0) {
              this.countries.forEach((item) => {
                this.allCountries[item.iso] = { movies: 0, countryName: item.countryName, fillColor: '#3f4045' };
              });
            }

            this.displayCountries();
          });
      },
      formatCountries(countries) {
        return countries.map((item) => {
          return {
            iso: this.translateCountryCode(item._id.iso_3166_1),
            value: item.value,
            countryName: item._id.name
          }
        });
      },
      displayCountries() {
        map.updateChoropleth(this.allCountries);

        if (this.countries.length === 0) {
          return;
        }

        this.paletteScale = scaleCluster() // Natural breaks
          .domain(this.countries.map(c => c.value))
          .range(['#dee7f3','#becee6','#9db8da','#7aa1cd','#548bc1','#1975b4']);

        const countries = {};
        this.countries.forEach((item) => {
          countries[item.iso] = { movies: item.value, countryName: item.countryName, fillColor: this.paletteScale(item.value) };
        });

        map.updateChoropleth(countries);
      },
      loadMap() {
        map = new Datamaps({
          element: this.$refs.map,
          projection: 'mercator',
          fills: { defaultFill: '#3f4045' },
          data: {},
          responsive: true,
          geographyConfig: {
            borderColor: '#333439',
            popupOnHover: true,
            highlightBorderWidth: 2,
            highlightFillColor(geo) {
              return geo.fillColor || '#3f4045';
            },
            highlightBorderColor: '#505156',
            popupTemplate(geo, data) {
              if (!data) {
                return;
              }
              return `<div class="hoverinfo">${data.countryName}: ${data.movies} movies</div>`;
            }
          }
        });
        window.addEventListener('resize', () => { map.resize(); });
      },
      translateCountryCode (code) {
        const oldCountries = {SU: 'RU', XG: 'DE', CS: 'RS', YU: 'RS', XC: 'SK', AN: 'NL'};

        if (oldCountries[code]) {
          code = oldCountries[code];
        }

        return IsoConverter.alpha2ToAlpha3(code);
      }
    },
    mounted() {
      this.loadMap();
      this.countCountries();
      this.$bus.$on(FILTERS_UPDATE, (filters) => {
        this.countCountries(filters);
      });
    }
  };

</script>

<style lang="scss" ref="stylesheet/scss">
  @import '../scss/vars';

  section.map {
    padding: 0 0 10px;

    .legend {
      font-size: 0.8em;
      margin: 10px 0 0 0;
      float: right;
      position: relative;

      .color {
        width: 50px;
        height: 10px;
        display: inline-block;
      }

      .limit {
        position: absolute;
        bottom: -11px;
        left: -25px;
        font-size: 0.75em;
        width: 50px;
        text-align: center;
      }
    }
  }

  .datamaps-hoverover .hoverinfo {
    color: $global-color-background;
    box-shadow: 7px 7px 12px -9px #777;
    border: 1px solid #CCC;
  }
</style>
