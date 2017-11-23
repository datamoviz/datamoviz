<template>
  <a href="#" title="Back to top" class="badge badge-info elevator"><i class="fa fa-arrow-up"></i> go top</a>
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
  a.elevator {
    position: fixed;
    bottom: 10px;
    right: 10px;
    color: white;

    &:hover {
      color: white;
    }
  }
</style>
