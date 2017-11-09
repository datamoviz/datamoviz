import Vue from 'vue';
import * as d3 from 'd3';
import 'font-awesome/scss/font-awesome.scss';
import AppMain from './modules/app-main.vue';

import FiltersModule from './js/module/filters';
import OverviewModule from './js/module/overview';
import ActorsNetworkModule from './js/module/actors-network';
new Vue(AppMain).$mount('#app-main');
// To be removed
import HomeworkModule from './js/module/homework';

const modules = [
  new FiltersModule(document.querySelector('#filters')),
  new OverviewModule(document.querySelector('#overview-chart')),
  new ActorsNetworkModule(document.querySelector('#actor-network')),

  // To be removed
  new HomeworkModule('#colors', 'https://upload.wikimedia.org/wikipedia/commons/0/05/Odd-eyed_cat_by_ihasb33r.jpg')
];

modules.forEach((module) => {
  module.render();
});
