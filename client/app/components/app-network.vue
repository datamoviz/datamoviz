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

    data: () => ({
      graph: {},
      link: {},
      node: {},
      hull: {},
      simulation: {},
      text: {},
      nodeg: {},
      hullg: {},
      linkg: {},
      textg: {},
      expand: {},
      net: null,
      fillColor: null
    }),

    methods: {
      loadGraphData(filters) {
        filters = filters || {};

        return fetch(`${process.env.SERVER_URL}/network?filters=${encodeURI(JSON.stringify(filters))}`)
          .then(response => response.json())
          .then((json) => {
            this.graph = json;
          });
      },

      updateGraph() {
        function nodeid(n) {
          return n.size ? `_g_${n.movieGroup}` : n.name;
        }

        function linkid(l) {
          const u = nodeid(l.source);
          const v = nodeid(l.target);
          return u < v ? `${u}|${v}` : `${v}|${u}`;
        }

        function getGroup(node) {
          return node.movieGroup;
        }

        // constructs the network to visualize
        function network(data, prev, index, expand) {
          expand = expand || {};
          const movieGroupMap = {}; // movieGroup map
          const nodeMap = {}; // node map
          const linkMap = {}; // link map
          const prevMovieGroupNodes = {}; // previous movieGroup nodes
          const prevMovieGroupCentroids = {}; // previous movieGroup centroids
          const nodes = []; // output nodes
          const links = []; // output links

          // process previous nodes for reuse or centroid calculation
          if (prev) {
            prev.nodes.forEach((node) => {
              const i = index(node);
              if (node.size > 0) {
                prevMovieGroupNodes[i] = node;
                node.size = 0;
              } else {
                const o = prevMovieGroupCentroids[i] || (prevMovieGroupCentroids[i] = {
                  x: 0,
                  y: 0,
                  count: 0
                });
                o.x += node.x;
                o.y += node.y;
                o.count += 1;
              }
            });
          }

          // determine nodes
          for (let k = 0; k < data.nodes.length; ++k) {
            const n = data.nodes[k];
            const i = index(n);
            const l = movieGroupMap[i] || (movieGroupMap[i] = prevMovieGroupNodes[i]) || (movieGroupMap[i] = {
              movieGroup: i,
              size: 0,
              nodes: []
            });

            if (expand[i]) {
              // the node should be directly visible
              nodeMap[n.name] = nodes.length;
              nodes.push(n);
              if (prevMovieGroupNodes[i]) {
                // place new nodes at cluster location (plus jitter)
                n.x = prevMovieGroupNodes[i].x + Math.random();
                n.y = prevMovieGroupNodes[i].y + Math.random();
              }
            } else {
              // the node is part of a collapsed cluster
              if (l.size === 0) {
                // if new cluster, add to set and position at centroid of leaf nodes
                nodeMap[i] = nodes.length;
                nodes.push(l);
                if (prevMovieGroupCentroids[i]) {
                  l.x = prevMovieGroupCentroids[i].x / prevMovieGroupCentroids[i].count;
                  l.y = prevMovieGroupCentroids[i].y / prevMovieGroupCentroids[i].count;
                }
              }
              l.nodes.push(n);
            }
            // always count movieGroup size as we also use it to tweak the force graph strengths/distances
            l.size += 1;
            n.movieGroup_data = l;
          }

          for (const i in movieGroupMap) {
            movieGroupMap[i].link_count = 0;
          }

          // determine links
          for (let k = 0; k < data.links.length; ++k) {
            const e = data.links[k];
            let u = index(e.source);
            let v = index(e.target);
            if (u != v) {
              movieGroupMap[u].link_count++;
              movieGroupMap[v].link_count++;
            }
            u = expand[u] ? nodeMap[e.source.name] : nodeMap[u];
            v = expand[v] ? nodeMap[e.target.name] : nodeMap[v];
            let i = (u < v ? `${u}|${v}` : `${v}|${u}`),
              l = linkMap[i] || (linkMap[i] = {
                source: u,
                target: v,
                size: 0
              });
            l.size += 1;
          }
          for (const i in linkMap) {
            links.push(linkMap[i]);
          }

          return {
            nodes,
            links
          };
        }

        function convexHulls(nodes, index, offset) {
          const hulls = {};

          // create point sets
          for (let k = 0; k < nodes.length; ++k) {
            const node = nodes[k];
            if (node.size) continue;
            const i = index(node);
            const l = hulls[i] || (hulls[i] = []);
            l.push([node.x - offset, node.y - offset]);
            l.push([node.x - offset, node.y + offset]);
            l.push([node.x + offset, node.y - offset]);
            l.push([node.x + offset, node.y + offset]);
          }

          // create convex hulls
          const hullset = [];
          for (const i in hulls) {
            hullset.push({
              movieGroup: i,
              path: d3.polygonHull(hulls[i])
            });
          }

          return hullset;
        }

        function drawCluster(d) {
          return d3.line().curve(d3.curveCardinalClosed)(d.path);
        }

        // --------------------------------------------------------
        const width = 960; // svg width
        const height = 600; // svg height
        const dr = 4; // default point radius
        const off = 15; // cluster hull offset

        const data = this.graph;
        for (let i = 0; i < data.links.length; ++i) {
          const link = data.links[i];

          for (let j = 0; j < data.nodes.length; j++) {
            if (data.nodes[j].name === link.source) {
              link.source = data.nodes[j];
            } else if (data.nodes[j].name === link.target) {
              link.target = data.nodes[j];
            }
          }
        }

        this.net = network(data, this.net, getGroup, this.expand);
        const ticked = () => {
          if (!this.hull.empty()) {
            this.hull.data(convexHulls(this.net.nodes, getGroup, off))
              .attr('d', drawCluster);
          }

          this.link.attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);

          this.node.attr('cx', d => d.x)
            .attr('cy', d => d.y);

          this.text.attr('transform', d => `translate(${d.x},${d.y})`);
        };

        const simulation = d3.forceSimulation(this.net.nodes)
          .force('link', d3.forceLink(this.net.links)
            .id(d => this.net.nodes.indexOf(d))
            .distance((link) => {
              let n1 = link.source,
                n2 = link.target;
              return 30 +
                Math.min(
                  20 * Math.min(
                    (n1.size || (n1.movieGroup != n2.movieGroup ? n1.movieGroup_data.size : 0)),
                    (n2.size || (n1.movieGroup != n2.movieGroup ? n2.movieGroup_data.size : 0))
                  ), -30 +
                  30 * Math.min(
                    (n1.link_count || (n1.movieGroup != n2.movieGroup ? n1.movieGroup_data.link_count : 0)),
                    (n2.link_count || (n1.movieGroup != n2.movieGroup ? n2.movieGroup_data.link_count : 0))
                  ),
                  100
                );
            }))
          .force('charge', d3.forceManyBody().strength(-100))
          .force('center', d3.forceCenter(width / 2, height / 2))
          .force('y', d3.forceY())
          .force('x', d3.forceX())
          .on('tick', ticked);

        this.hullg.selectAll('path.hull').remove();
        this.hull = this.hullg.selectAll('path.hull')
          .data(convexHulls(this.net.nodes, getGroup, off))
          .enter().append('path')
          .attr('class', 'hull')
          .attr('d', drawCluster)
          .style('fill', d => this.fillColor(d.movieGroup))
          .on('click', (d) => {
            console.log('hull click', d, arguments, this, this.expand[d.movieGroup]);
            this.expand[d.movieGroup] = false;
            this.updateGraph();
            this.updateGraph();
          });

        this.link = this.linkg.selectAll('line.link').data(this.net.links, linkid);
        this.link.exit().remove();
        this.link.enter().append('line')
          .attr('class', 'link')
          .style('stroke-width', d => d.size || 1)
          .merge(this.link);

        this.node = this.nodeg.selectAll('circle.node').data(this.net.nodes, d => this.net.nodes.indexOf(d));
        this.node.exit().remove();
        this.node.enter().append('circle')
          .attr('class', d => `node${d.size ? '' : ' leaf'}`)
          .attr('r', d => (d.size ? d.size + dr : dr + 1))
          .style('fill', d => this.fillColor(d.movieGroup))
          .on('click', (d) => {
            console.log('node click', d, arguments, this, this.expand[d.movieGroup]);
            this.expand[d.movieGroup] = !this.expand[d.movieGroup];
            this.updateGraph();
            this.updateGraph();
          });

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

        this.node.call(d3.drag()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended));

        this.node.append('title').text(d => d.name || this.graph.moviesTitleMap[d.movieGroup]);
        this.node.merge(this.node);

        this.textg.selectAll('*').remove(); // Small fix TODO: fix the correct way
        this.text = this.textg.selectAll('.text').data(this.net.nodes, d => this.net.nodes.indexOf(d));
        this.text.exit().remove();
        this.text = this.text.enter().append('text')
          .attr('class', d => (d.size ? 'text-movie' : 'text-actor'))
          .attr('x', 8)
          .attr('y', '.31em')
          .text(d => d.name || this.graph.moviesTitleMap[d.movieGroup])
          .merge(this.text);

        simulation.nodes(this.net.nodes);
        simulation.force('link').links(this.net.links);
        simulation.alpha(0.1).restart();
      },
      drawGraph(svg) {
        const width = 960; // svg width
        const height = 600; // svg height

        this.fillColor = d3.scaleOrdinal(d3.schemeCategory20);


        svg
          .attr('width', width)
          .attr('height', height);

        this.hullg = svg.append('g');
        this.linkg = svg.append('g').attr('stroke', 'white');
        this.nodeg = svg.append('g');
        this.textg = svg.append('g').attr('class', 'texts');


        svg.attr('opacity', 1e-6)
          .transition()
          .duration(1000)
          .attr('opacity', 1);

        this.updateGraph();
        this.updateGraph();
      }
    },

    mounted() {
      this.$bus.$on(FILTERS_UPDATE, (filters) => {
        this.loadGraphData(filters).then(() => {
          this.updateGraph();
        });
      });

      const svg = d3.select(this.$refs.actorsNetwork).attr('class', 'actors-network');

      this.loadGraphData().then(() => {
        this.drawGraph(svg);
      });
    }
  };
</script>

<style lang="scss" ref="stylesheet/scss">
  svg.actors-network .text-actor {
     font: 8px sans-serif;
     stroke: white;
   }
   svg.actors-network .text-movie {
      font: 12px sans-serif;
      stroke: white;
  }
  svg.actors-network circle.node {
    fill: lightsteelblue;
    stroke: #555;
    stroke-width: 3px;
  }

  svg.actors-network circle.leaf {
    stroke: #fff;
    stroke-width: 1.5px;
  }

  svg.actors-network path.hull {
    fill: lightsteelblue;
    fill-opacity: 0.3;
  }

  svg.actors-network line.link {
    stroke-opacity: 0.5;
    pointer-events: none;
  }
</style>
