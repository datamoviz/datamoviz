<template>
  <footer class="container">
    <div class="row">
      <div class="col">
        Made by
        <span class="name">Quentin de Longraye</span>,
        <span class="name">Aymen Gannouni</span> &amp;
        <span class="name">Victor Le</span> at
        <span class="name">EPFL</span>
      </div>
    </div>
  </footer>
</template>

<script>
  import $ from 'jquery';
  import CountUp from 'countup.js';
  import { FILTERS_UPDATE } from '../event-bus';

  export default {
    name: 'app-footer'
  }
</script>

<style scoped lang="scss" ref="stylesheet/scss">
  @import '../scss/vars';

  footer {
    font-size: 0.8em;
    text-align: center;
    padding: 20px 0;
    color: $global-color-primary;

    .name {
      color: white;
    }
  }
</style>
