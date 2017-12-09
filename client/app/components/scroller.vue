<template>
  <a href="#" title="Back to top" class="elevator"><i class="fa fa-arrow-up"></i></a>
</template>

<script>
  import Elevator from 'elevator.js';

  export default {
    name: 'scroller',
    data() {
      return {
        elevator: null
      };
    },
    mounted() {
      this.elevator = new Elevator({
        element: document.querySelector('.elevator'),
        duration: 1000
      });
    }
  };
</script>

<style scoped lang="scss" ref="stylesheet/scss">
  @import '../scss/vars';

  a.elevator {
    position: fixed;
    bottom: 10px;
    right: 10px;
    color: white;
    border-radius: 50%;
    background: $global-color-primary;
    width: 30px;
    height: 30px;
    text-align: center;
    font-size: 1.3em;

    &:hover {
      color: white;
    }
  }
</style>
