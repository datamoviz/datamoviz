<template>
  <section>
    <div class="container">
      <div class="row">
        <div class="col">
          <h2>Actors network</h2>
          <svg ref="actorsNetwork" width="900" height="600"></svg>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  import * as d3 from 'd3';
  import {
    FILTERS_UPDATE
  } from '../event-bus';

  export default {
    id: 'app-network',

    data: () => {
      return {
        graph: {},
        link: {},
        node: {},
        simulation: {},
        text: {}
      }
    },

    methods: {
      loadGraphData(filters) {
        filters = filters || {};

        return fetch(`${process.env.SERVER_URL}/network?filters=${encodeURI(JSON.stringify(filters))}`)
          .then(response => {
            return response.json();
          })
          .then(json => {
            this.graph = json;
          });
      },

      updateGraph() {
        const color = d3.scaleOrdinal(d3.schemeCategory20);

        function dragstarted(d) {
          if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }

        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }

        function dragended(d) {
          if (!d3.event.active) this.simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }

        this.link = this.link.data(this.graph.links, d => {
          d.source.name + "-" + d.target.name
        });
        this.link.exit().remove();
        this.link = this.link.enter().append("line").merge(this.link);

        this.node = this.node.data(this.graph.actors, d => d.name);
        this.node.exit().remove();
        this.node = this.node.enter().append("circle")
          .attr('r', d => Math.min(d.movieCount + 1, 7))
          .attr('fill', d => color(d.group))
          .call(d3.drag()
            .on('start', dragstarted.bind(this))
            .on('drag', dragged)
            .on('end', dragended.bind(this)))
          .merge(this.node);

        this.node.append('title').text(d => d.name);

        this.text = this.text.data(this.graph.actors, d => d.name)
        this.text.exit().remove();
        this.text = this.text.enter()
          .append('text')
          .attr('x', 8)
          .attr('y', '.31em')
          .text(d => d.name)
          .merge(this.text);

        this.simulation
          .nodes(this.graph.actors)
          .on('tick', () => {
            this.link
              .attr('x1', d => d.source.x)
              .attr('y1', d => d.source.y)
              .attr('x2', d => d.target.x)
              .attr('y2', d => d.target.y);

            this.node.attr('transform', d => `translate(${d.x},${d.y})`);
            this.text.attr('transform', d => `translate(${d.x},${d.y})`);
          });

        this.simulation.force('link').links(this.graph.links);
        // this.simulation.alpha(1).restart();
      },
      drawGraph(svg) {
        const color = d3.scaleOrdinal(d3.schemeCategory20);

        this.link = svg.append("g").attr("stroke", "white").attr("stroke-width", 1.5).selectAll(".link")
        this.node = svg.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll(".node");
        this.text = svg.append('g').attr('class', 'texts').selectAll('.text')

        this.updateGraph()
      }
    },

    mounted() {
      this.$bus.$on(FILTERS_UPDATE, (filters) => {
        this.loadGraphData(filters).then(() => {
          this.updateGraph();
        });
      });

      const svg = d3.select(this.$refs.actorsNetwork).attr('class', 'actors-network');
      const width = +svg.attr('width');
      const height = +svg.attr('height');

      this.simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id(d => d.name))
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(width / 2, height / 2));


      this.loadGraphData().then(() => {
        this.drawGraph(svg);
      });
    }
  };
</script>

<style lang="scss" ref="stylesheet/scss">
  svg.actors-network text {
    font: 10px sans-serif;
    stroke: white;
  }
</style>
