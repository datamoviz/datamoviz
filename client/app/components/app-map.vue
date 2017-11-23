<template>
  <section>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2>Map</h2>
          <p>{{ countries.map(country => country._id.name).join(', ') }}</p>
          <ul>
            <li v-for="country in countries">
              {{ country._id.name}}: {{country.value}}
            </li>
          </ul>
        <div ref="map" class="map">

        </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import { FILTERS_UPDATE } from '../event-bus';
  import Datamaps from 'datamaps';

  export default {
    name: 'app-map',
    data() {
      return {
        countries: [],
        map: null
      };
    },
    methods: {
      countCountries(filters) {
        filters = filters || {};

        return fetch(`${process.env.SERVER_URL}/count/countries?filters=${encodeURI(JSON.stringify(filters))}`)
          .then(response => response.json())
          .then((json) => {
            this.countries = json;
          });
      }
    },
    mounted() {
      this.countCountries();
      this.map = new Datamaps({element: this.$refs.map});
      this.$bus.$on(FILTERS_UPDATE, (filters) => {
              this.countCountries(filters);
          });
    }
  };

</script>

<style scoped lang="scss" ref="stylesheet/scss">
  .map{
    height:500px;
  }
</style>