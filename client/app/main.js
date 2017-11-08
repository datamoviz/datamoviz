import * as d3 from 'd3';
import 'bootstrap-reboot/bootstrap-reboot.scss';
import 'bootstrap-4-grid/scss/grid.scss';
import 'font-awesome/scss/font-awesome.scss';
import './scss/main.scss';

import HeaderModule from './js/module/header'
import FiltersModule from './js/module/filters';
import OverviewModule from './js/module/overview';
import ActorNetworkModule from './js/module/actor-network';

// To be removed
import HomeworkModule from './js/module/homework';

const modules = [
  new HeaderModule('header-movies-count'),
  new FiltersModule('#filters'),
  new OverviewModule('#overview-chart'),
  new ActorNetworkModule('#actor-network'),

  // To be removed
  new HomeworkModule('#colors', 'https://upload.wikimedia.org/wikipedia/commons/0/05/Odd-eyed_cat_by_ihasb33r.jpg')
];

modules.forEach((module) => {
  module.render();
});
