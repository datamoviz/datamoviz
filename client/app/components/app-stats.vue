<template>
  <section>
    <div class="container">
      <div class="row">
        <div class="col col-md-8">
          <div class="row">
            <stats-genres></stats-genres>
            <stats-colors></stats-colors>
          </div>
        </div>
        <stats-words></stats-words>
      </div>
    </div>
  </section>
</template>

<script>
  import StatsGenres from './stats-genres.vue';
  import StatsColors from './stats-colors.vue';
  import StatsWords from './stats-words.vue';

  export default {
    name: 'app-stats',
    components: {
      StatsGenres,
      StatsColors,
      StatsWords
    }
  };
</script>
