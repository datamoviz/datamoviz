<template>
  <section>
    <div class="container">
      <div class="row">
        <div class="col-12">
          <h2>Map</h2>
          <p>{{test}}</p>
          <p>{{countries.map(country => country.name).join(', ')}}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    name: 'app-map',
    data(){
      return{
        test: 'Slt',
        countries:[]
      }
    },
      mounted() {
          return fetch(`${process.env.SERVER_URL}/countries`)
              .then(response => response.json())
              .then((json) => {
                  this.countries = json;
              });
      }
  };

</script>
