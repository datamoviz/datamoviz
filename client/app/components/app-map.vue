<template>
  <section>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h3>Production countries</h3>
          <div ref="map" class="map"></div>
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

  let map;

  export default {
    name: 'app-map',
    data() {
      return {
        countries: []
      };
    },
    methods: {
      countCountries(filters) {
        filters = filters || {};

        return fetch(`${process.env.SERVER_URL}/count/countries?filters=${encodeURI(JSON.stringify(filters))}`)
          .then(response => response.json())
          .then((json) => {
            this.displayCountries(json);
          });
      },
      displayCountries(json) {
        /*const reset = {};
        this.countries.forEach((item) => {
          reset[this.translateCountryCode(item._id.iso_3166_1)] = null;
        });

        map.updateChoropleth(reset);*/

        this.countries = json;

        const list = this.countries.map(item => { return {
          iso: this.translateCountryCode(item._id.iso_3166_1),
          value: item.value,
          countryName: item._id.name
        }});
        const paletteScale = d3.scaleSqrt().domain([
          d3.min(list, c => c.value),
          d3.max(list, c => c.value)
        ])
          .range([d3.rgb('#21a8ff'), d3.rgb('#1975b4')]);
        const countries = {};
        list.forEach((item) => {
          countries[item.iso] = { movies: item.value, countryName: item.countryName, fillColor: paletteScale(item.value) };
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

  .map {
    height:700px;
  }

  .datamaps-hoverover .hoverinfo {
    color: $global-color-background;
    box-shadow: 7px 7px 12px -9px #777;
    border: 1px solid #CCC;
  }
</style>
