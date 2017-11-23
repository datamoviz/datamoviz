<template>
  <section>
    <div class="container">
      <div class="row">
        <div class="col col-md-8">
          <h3>Statistics</h3>
          <div class="row">
            <stats-genres></stats-genres>
            <div class="col col-sm-6 col-md-6">
              <h4>Colors distribution</h4>
            </div>
            <div class="col col-sm-6 col-md-4">
              <p>Average duration</p>
            </div>
            <div class="col col-sm-6 col-md-4">
              <p>Repartition of languages</p>
            </div>
            <div class="col col-sm-6 col-md-4">
              <p>Average evaluation of movies (with average number of evaluations)</p>
            </div>
            <div class="col col-sm-6 col-md-4">
              <p>Repartition of content ratings</p>
            </div>
            <div class="col">
              <p>Repartition of movies / month</p>
            </div>
          </div>
        </div>
        <stats-words></stats-words>
      </div>
    </div>
  </section>
</template>

<script>
  import StatsGenres from './stats-genres.vue';
  import StatsWords from './stats-words.vue';

  export default {
    name: 'app-stats',
    components: {
      StatsGenres,
      StatsWords
    }
  };
</script>
