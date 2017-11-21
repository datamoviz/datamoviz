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

  function loadGraph() {
    return fetch(`${process.env.SERVER_URL}/network`)
      .then(response => response.json());
  }


  export default {
    id: 'app-network',
    mounted() {
      const svg = d3.select(this.$refs.actorsNetwork);
      const width = +svg.attr('width');
      const height = +svg.attr('height');


      const color = d3.scaleOrdinal(d3.schemeCategory20);

      const simulation = d3.forceSimulation()
        .force('link', d3.forceLink().id(d => d.name))
        .force('charge', d3.forceManyBody())
        .force('center', d3.forceCenter(width / 2, height / 2));


      loadGraph().then((graph) => {
        const link = svg.append('g')
          .attr('class', 'links')
          .selectAll('line')
          .data(graph.links)
          .enter()
          .append('line')
          .attr('stroke-width', d => Math.sqrt(d.value))
          .attr('stroke', 'white');


        function dragstarted(d) {
          if (!d3.event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        }
        function dragged(d) {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        }
        function dragended(d) {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }

        const node = svg.append('g')
          .attr('class', 'nodes')
          .selectAll('circle')
          .data(graph.actors)
          .enter()
          .append('circle')
          .attr('r', d => Math.min(d.movieCount + 1, 7))
          .attr('fill', d => color(d.group))
          .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));

        node.append('title')
          .text(d => d.name);

        const text = svg.append('g')
          .attr('class', 'texts')
          .selectAll('text')
          .data(graph.actors)
          .enter()
          .append('text')
          .attr('x', 8)
          .attr('y', '.31em')
          .text(d => d.name);

        function ticked() {
          link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

          node.attr('transform', d => `translate(${d.x},${d.y})`);
          text.attr('transform', d => `translate(${d.x},${d.y})`);
        }

        simulation
          .nodes(graph.actors)
          .on('tick', ticked);

        simulation.force('link')
          .links(graph.links);
      });
    }
  };
</script>

<style lang="scss" ref="stylesheet/scss">
text {
  font: 10px sans-serif;
  stroke: white;
}
</style>
