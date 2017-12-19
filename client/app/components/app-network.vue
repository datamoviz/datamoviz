<template>
  <section class="highlight">
    <div class="container" data-aos="fade">
      <div class="row">
        <div class="col">
          <h3>Actors network</h3>
          <p>This network shows how many common actors movies shares.</p>
          <div class="row">
            <div class="col-12 col-md-4">
              <label for="network-actor-filter">Actors count</label>
              <input type="range" min="1" max="20" step="1" v-model="actorCount" v-on:change="onChangeReloadGraph" id="network-actor-filter" class="slider" />
              <input type="number" min="1" max="20" v-model="actorCount" v-on:change="onChangeReloadGraph"/>
            </div>
            <div class="col-12 col-md-4">
              <label for="network-crew-filter">Crew count</label>
              <input type="range" min="1" max="10" step="1" v-model="crewCount" v-on:change="onChangeReloadGraph" id="network-crew-filter" class="slider">
              <input type="number" min="1" max="10" v-model="crewCount" v-on:change="onChangeReloadGraph"/>
            </div>
            <div class="col-12 col-md-4">
              <label for="network-movie-filter">Movie count</label>
              <input type="range" min="1" max="100" step="1" v-model="movieCount" v-on:change="onChangeReloadGraph" id="network-movie-filter" class="slider">
              <input type="number" min="1" max="100" v-model="movieCount" v-on:change="onChangeReloadGraph"/>
            </div>
          </div>
          <svg ref="actorsNetwork"></svg>
          <div class="row">
            <div class="col col-sm-6">
              <small><span class="badge badge-info">Pro tip</span> You can click on a movie cluster to show its cast. Movies are colored by genre and crew members by role.</small>
            </div>
            <div class="col col-sm-6 network-choices">
              <input type="checkbox" id="show-movies-name-checkbox" v-model="showMovieName" v-on:change="onMovieNameChangeVisibility">
              <label for="show-movies-name-checkbox">Show movies name</label>

              <input type="checkbox" id="show-actor-name-checkbox" v-model="showActorName" v-on:change="onActorNameChangeVisibility">
              <label for="show-actor-name-checkbox">Show actors name</label>

              <a id="reset-zoom-buton" href="#" @click.prevent="resetZoom"><i class="fa fa-search-minus"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  // Collapsible node adapted from : http://bl.ocks.org/GerHobbelt/3071239
  import * as d3 from 'd3';
  import {
    FILTERS_UPDATE
  } from '../event-bus';

  export default {
    id: 'app-network',

    data: () => ({
      showMovieName: true,
      showActorName: true,
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
      network: null,
      fillColorMovie: null,
      fillColorActor: null,
      height: 500,
      actorCount: 5,
      crewCount: 1,
      movieCount: 30,
      zoom: null
    }),
    methods: {
      resetZoom() {
        d3.select(this.$refs.actorsNetwork).transition()
          .duration(750)
          .call(this.zoom.transform, d3.zoomIdentity);
      },
      onChangeReloadGraph() {
        this.loadGraphData(this.filters).then(() => {
          this.updateGraph();
          this.updateGraph();
        });
      },
      onMovieNameChangeVisibility() {
        document.querySelectorAll('.text-movie').forEach((text) => {
          text.style.visibility = this.showMovieName ? 'visible' : 'hidden';
        });
      },
      onActorNameChangeVisibility() {
        document.querySelectorAll('.text-actor').forEach((text) => {
          text.style.visibility = this.showActorName ? 'visible' : 'hidden';
        });
      },
      loadGraphData(filters) {
        filters = filters || {};

        return fetch(`${process.env.SERVER_URL}/network?filters=${encodeURI(JSON.stringify(filters))}&movieCount=${this.movieCount}
                                                                        &actorCount=${this.actorCount}&crewCount=${this.crewCount}`)
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

        function removeMovieIdFromActorName(name) {
          return name ? name.split('_')[0] : null;
        }

        function getCrewTitle(d) {
          if (d.name) {
            return `${removeMovieIdFromActorName(d.name)} (${d.job || d.character || ''})`;
          }
          return null;
        }

        // constructs the network to visualize
        function getNetwork(data, prev, index, expand) {
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
            // always count movieGroup size as we also use it
            // to tweak the force graph strengths/distances
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
            if (u !== v) {
              movieGroupMap[u].link_count++;
              movieGroupMap[v].link_count++;
            }
            u = expand[u] ? nodeMap[e.source.name] : nodeMap[u];
            v = expand[v] ? nodeMap[e.target.name] : nodeMap[v];
            const i = (u < v ? `${u}|${v}` : `${v}|${u}`);
            const l = linkMap[i] || (linkMap[i] = {
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
            if (i === 9999) continue;
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

        this.expand[9999] = true;

        this.network = getNetwork(data, this.network, getGroup, this.expand);
        const ticked = () => {
          if (!this.hull.empty()) {
            this.hull.data(convexHulls(this.network.nodes, getGroup, off))
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

        const simulation = d3.forceSimulation(this.network.nodes)
          .force('link', d3.forceLink(this.network.links)
            .id(d => this.network.nodes.indexOf(d))
            .distance((link) => {
              const n1 = link.source;
              const n2 = link.target;
              // larger distance for bigger groups:
              // both between single nodes and _other_ groups (where size of own node group still counts),
              // and between two group nodes.
              //
              // reduce distance for groups with very few outer links,
              // again both in expanded and grouped form, i.e. between individual nodes of a group and
              // nodes of another group or other group node or between two group nodes.
              //
              // The latter was done to keep the single-link groups ('blue', rose, ...) close.
              return 30 +
                Math.min(
                  20 * Math.min(
                    (n1.size || (n1.movieGroup !== n2.movieGroup ? n1.movieGroup_data.size : 0)),
                    (n2.size || (n1.movieGroup !== n2.movieGroup ? n2.movieGroup_data.size : 0))
                  ), -30 +
                  30 * Math.min(
                    (n1.link_count || (n1.movieGroup !== n2.movieGroup ? n1.movieGroup_data.link_count : 0)),
                    (n2.link_count || (n1.movieGroup !== n2.movieGroup ? n2.movieGroup_data.link_count : 0))
                  ),
                  100
                );
            }))
          .force('charge', d3.forceManyBody().strength(-600))
          .force('center', d3.forceCenter(this.width / 2, this.height / 2))
          .force('y', d3.forceY())
          .force('x', d3.forceX())
          .on('tick', ticked);

        this.hullg.selectAll('path.hull').remove();
        this.hull = this.hullg.selectAll('path.hull')
          .data(convexHulls(this.network.nodes, getGroup, off))
          .enter().append('path')
          .attr('class', 'hull')
          .attr('d', drawCluster)
          .style('fill', d => this.fillColorMovie(this.graph.moviesTitleMap[d.movieGroup].genre))
          .on('click', (d) => {
            this.expand[d.movieGroup] = false;
            this.updateGraph();
            this.updateGraph();
          });

        this.link = this.linkg.selectAll('line.link').data(this.network.links, linkid);
        this.link.exit().remove();
        this.link.enter().append('line')
          .attr('class', 'link')
          .style('stroke-width', d => d.size || 1)
          .merge(this.link);

        this.node = this.nodeg.selectAll('circle.node').data(this.network.nodes, d => this.network.nodes.indexOf(d));
        this.node.exit().remove();
        this.node.enter().append('circle')
          .attr('class', d => `node${d.size ? '' : ' leaf'}`)
          .attr('r', d => (d.size ? d.size + dr : dr + 1))
          .style('fill', d => (d.group ? this.fillColorActor(d.group) : this.fillColorMovie(this.graph.moviesTitleMap[d.movieGroup].genre)))
          .on('click', (d) => {
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

        this.node.append('title').text(d => getCrewTitle(d) || `${this.graph.moviesTitleMap[d.movieGroup].title} (${this.graph.moviesTitleMap[d.movieGroup].genre})`);
        this.node.merge(this.node);

        this.textg.selectAll('*').remove(); // Small fix TODO: fix the correct way
        this.text = this.textg.selectAll('.text').data(this.network.nodes, d => this.network.nodes.indexOf(d));
        this.text.exit().remove();
        this.text = this.text.enter().append('text')
          .attr('class', d => (d.size ? 'text-movie' : 'text-actor'))
          .attr('x', 8)
          .attr('y', '.31em')
          .text(d => removeMovieIdFromActorName(d.name) || this.graph.moviesTitleMap[d.movieGroup].title)
          .merge(this.text);

        simulation.nodes(this.network.nodes);
        simulation.force('link').links(this.network.links);
        simulation.alpha(0.1).restart();

        this.onMovieNameChangeVisibility();
        this.onActorNameChangeVisibility();
      },
      drawGraph(svg) {
        this.fillColorMovie = d3.scaleOrdinal(d3.schemeCategory20);
        this.fillColorActor = d3.scaleOrdinal(d3.schemeCategory20);

        svg
          .attr('width', this.width)
          .attr('height', this.height);

        this.hullg = svg.append('g');
        this.linkg = svg.append('g').attr('stroke', '#d6d6d6');
        this.nodeg = svg.append('g');
        this.textg = svg.append('g').attr('class', 'texts');

        svg.attr('opacity', 1e-6)
          .transition()
          .duration(1000)
          .attr('opacity', 1);

        function zoomed() {
          this.hullg.attr('transform', d3.event.transform);
          this.linkg.attr('transform', d3.event.transform);
          this.nodeg.attr('transform', d3.event.transform);
          this.textg.attr('transform', d3.event.transform);
        }

        this.zoom = d3.zoom()
          .scaleExtent([1, 40])
          .translateExtent([[-100, -100], [this.width + 90, this.height + 100]])
          .on('zoom', zoomed.bind(this));

        svg.call(this.zoom);

        this.updateGraph();
        this.updateGraph();
      },
      updateWindow() {
        const e = document.documentElement;
        const g = document.getElementsByTagName('body')[0];

        let width = window.innerWidth || e.clientWidth || g.clientWidth;
        width *= 0.6;

        this.width = width;

        const svg = d3.select(this.$refs.actorsNetwork);
        svg.attr('width', width);
      }
    },
    mounted() {
      this.$bus.$on(FILTERS_UPDATE, (filters) => {
        this.filters = filters;
        this.loadGraphData(this.filters).then(() => {
          this.updateGraph();
          this.updateGraph();
        });
      });

      const svg = d3.select(this.$refs.actorsNetwork).attr('class', 'actors-network');

      this.loadGraphData().then(() => {
        this.updateWindow();
        this.drawGraph(svg);
        d3.select(window).on('resize.updatesvg', () => {
          this.updateWindow();
          this.updateGraph();
          this.updateGraph();
        });
      });
    }
  };
</script>

<style lang="scss" ref="stylesheet/scss">
  @import '../scss/vars';

  svg.actors-network {
    display: block;
    margin: 0 auto;

    .text-actor {
      font: 8px sans-serif;
      fill: white;
    }
    .text-movie {
      font: 12px sans-serif;
      fill: white;
    }
    circle.node {
      fill: lightsteelblue;
      stroke: #555;
      stroke-width: 3px;
      cursor: pointer;
    }
    circle.leaf {
      stroke: #fff;
      stroke-width: 1.5px;
    }
    path.hull {
      fill: lightsteelblue;
      fill-opacity: 0.3;
    }
    line.link {
      stroke-opacity: 0.5;
      pointer-events: none;
    }
  }

  input[type=number] {
    background: lighten($global-color-background, 2);
    border: none;
    border-radius: 2px;
    color: white;
    padding: 2px 3px;
    width: 50px;
  }

  .network-choices {
    text-align: right;
  }

  #reset-zoom-buton {
    color: $global-color-primary
  }
</style>
