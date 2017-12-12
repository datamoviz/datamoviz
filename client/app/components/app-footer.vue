<template>
  <footer class="container">
    <div class="row">
      <div class="col-12">
        <p>
          Made by
          <span class="name">Quentin de Longraye</span>,
          <span class="name">Aymen Gannouni</span> &amp;
          <span class="name">Victor Le</span> at
          <span class="name">EPFL</span>
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
  export default {
    name: 'app-footer'
  };
</script>

<style scoped lang="scss" ref="stylesheet/scss">
  @import '../scss/vars';

  footer {
    font-size: 0.8em;
    text-align: center;
    color: $global-color-primary;

    p {
      padding: 20px 0;

      .name {
        color: white;
      }
    }
  }
</style>
