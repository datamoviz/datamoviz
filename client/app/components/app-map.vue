<template>
  <section>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2>Map</h2>
          <p>{{test}}</p>
          <p>{{countries.map(country => country._id.name).join(', ')}}</p>
          <ul id="example-1">
            <li v-for="country in countries">
              {{ country._id.name}}:{{country.value}}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import { FILTERS_UPDATE, MOVIE_SELECTED } from '../event-bus';
  export default {
    name: 'app-map',
    data(){
      return{
        test: 'Slt',
        countries:[]
      }
    },methods: {
          countCountries(filters) {
              filters = filters || {};

              return fetch(`${process.env.SERVER_URL}/count/countries?filters=${encodeURI(JSON.stringify(filters))}`)
                  .then(response => response.json())
                  .then((json) => {
                      this.countries = json;
                  });
          },
      },
      mounted() {
          this.countCountries();

          this.$bus.$on(FILTERS_UPDATE, (filters) => {
              this.countCountries(filters);
          });
          this.$bus.$on(MOVIE_SELECTED, (filters) => {
              this.countCountries(filters);
          });
      }
  };

</script>
