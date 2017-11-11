<template>
  <div class="gauge">
      <div ref="gauge"></div>
      <div>{{ title }}</div>
  </div>
</template>

<script>
  import c3 from 'c3';

  export default {
    name: 'gauge',
    props: ['value', 'name', 'max', 'size', 'title', 'thresholds'],
    mounted() {
      c3.generate({
        bindto: this.$refs.gauge,
        data: {
          columns: [
            [this.name, this.value]
          ],
          type: 'gauge'
        },
        gauge: {
          min: 0,
          max: this.max
        },
        color: {
          pattern: ['#de3e38', '#c19518', '#009946'],
          threshold: {
            values: this.thresholds
          }
        },
        size: {
          height: this.size
        }
      });
    }
  };
</script>

<style scoped lang="scss" ref="stylesheet/scss">
  .gauge {
    display: inline-block;
    width: 125px;
    font-size: 0.8em;
    font-style: italic;
    text-align: center;
  }
</style>
