<template>
  <div class="col col-md-4">
    <h3>Popular words</h3>
    <p>Here is the top 15 of the most used words in movie titles.</p>
    <svg ref="chart" class="bubble" width="330" height="330"></svg>
    <small><span class="badge badge-info">Pro tip</span> Keep your mouse on a bubble to see the number of occurrences.</small>
  </div>
</template>

<script>
  import { FILTERS_UPDATE } from '../event-bus';
  import * as d3 from 'd3';

  export default {
    name: 'app-words',
    data() {
      return {
        chart: null,
        pack: null,
        words: []
      }
    },
    methods: {
      bubbleChart() {
        this.chart = d3.select(this.$refs.chart);
        let width = +this.chart.attr('width'),
            height = +this.chart.attr('height');

        this.pack = d3.pack()
          .size([width, height])
          .padding(1.5);
      },
      updateChart() {
        let transition = d3.transition().duration(750);
        let hierarchy = d3.hierarchy({ children: this.words }).sum(function(d) { return d.value; });

        let circle = this.chart.selectAll('circle').data(this.pack(hierarchy).leaves(), (d) => { return d.data._id; });
        let text = this.chart.selectAll('text').data(this.pack(hierarchy).leaves(), (d) => { return d.data._id; });

        circle.exit()
          .transition(transition)
          .attr('r', 1e-6)
          .remove();

        text.exit().remove();

        circle
          .transition(transition)
          .attr('r', (d) => { return isNaN(d.r) ? 1e-6 : d.r })
          .attr('cx', (d) => { return d.x; })
          .attr('cy', (d) => { return d.y; })
          .attr('class', 'kept');

        circle.select('title').text((d) => { return `${d.data._id}: ${d.data.value} occurrences`; });

        text
          .transition(transition)
          .attr('x', (d) => { return d.x; })
          .attr('y', (d) => { return d.y + 3; })
          .attr('class', 'kept');

        let test = circle.enter().append('circle')
          .attr('r', 1e-6)
          .attr('cx', (d) => { return d.x; })
          .attr('cy', (d) => { return d.y; });

        test.transition(transition).attr('r', (d) => { return isNaN(d.r) ? 1e-6 : d.r });

        test.append('svg:title').text((d) => { return `${d.data._id}: ${d.data.value} occurrences`; });

        text.enter().append('text')
          .attr('x', (d) => { return d.x; })
          .attr('y', (d) => { return d.y + 3; })
          .text((d) => { return d.data._id; })
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

  svg.bubble {
    circle {
      overflow: hidden;
      fill: $global-color-primary;
    }

    text {
      text-anchor: middle;
      font: 10px sans-serif;
      padding-top: 0.3em;
    }
  }
</style>
