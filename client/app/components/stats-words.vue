<template>
  <div class="col col-md-4">
    <h3>Popular words</h3>
    <p>Here is the top 15 of the most used words in selected movie titles.</p>
    <svg ref="chart" class="bubble" width="330" height="330"></svg>
    <small><span class="badge badge-info">Pro tip</span> Keep your mouse on a bubble to see the number of occurrences.</small>
  </div>
</template>

<script>
  import * as d3 from 'd3';
  import { FILTERS_UPDATE } from '../event-bus';

  export default {
    name: 'stats-words',
    data() {
      return {
        chart: null,
        pack: null,
        words: []
      };
    },
    methods: {
      bubbleChart() {
        this.chart = d3.select(this.$refs.chart);
        const width = +this.chart.attr('width');
        const height = +this.chart.attr('height');

        this.pack = d3.pack()
          .size([width, height])
          .padding(1.5);
      },
      updateChart() {
        const color = d3.scaleOrdinal(d3.schemeCategory20);

        const transition = d3.transition().duration(750);
        const hierarchy = d3.hierarchy({ children: this.words }).sum(d => d.value);

        const circle = this.chart.selectAll('circle').data(this.pack(hierarchy).leaves(), d => d.data._id);
        const text = this.chart.selectAll('text').data(this.pack(hierarchy).leaves(), d => d.data._id);

        circle.exit()
          .transition(transition)
          .attr('r', 1e-6)
          .remove();

        text.exit().remove();

        circle
          .transition(transition)
          .attr('r', d => (Number.isNaN(d.r) ? 1e-6 : d.r))
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
          .style('fill', d => color(d.data.value));

        circle.select('title').text(d => `${d.data._id}: ${d.data.value} occurrences`);

        text
          .transition(transition)
          .attr('x', d => d.x)
          .attr('y', d => d.y + 3)
          .attr('class', 'kept');

        const test = circle.enter().append('circle')
          .attr('r', 1e-6)
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
          .style('fill', d => color(d.data.value));

        test.transition(transition).attr('r', d => (Number.isNaN(d.r) ? 1e-6 : d.r));

        test.append('svg:title').text(d => `${d.data._id}: ${d.data.value} occurrences`);

        text.enter().append('text')
          .attr('x', d => d.x)
          .attr('y', d => d.y + 3)
          .text(d => d.data._id)
          .attr('opacity', 1e-6)
          .transition(transition)
          .attr('opacity', 1);
      },
      loadWords(filters) {
        filters = filters || {};

        return fetch(`${process.env.SERVER_URL}/count/words?filters=${encodeURI(JSON.stringify(filters))}`)
          .then(response => response.json())
          .then((words) => {
            this.words = words;
            this.updateChart();
          });
      }
    },
    mounted() {
      this.bubbleChart();
      this.loadWords();

      this.$bus.$on(FILTERS_UPDATE, (filters) => {
        this.loadWords(filters);
      });
    }
  };
</script>

<style lang="scss" ref="stylesheet/scss">
  @import '../scss/_vars.scss';

  svg.bubble text {
    text-anchor: middle;
    font: 11px sans-serif;
    padding-top: 0.3em;
  }
</style>
