import * as d3 from 'd3';
import 'bootstrap-reboot/bootstrap-reboot.scss';
import 'bootstrap-4-grid/scss/grid.scss';
import 'font-awesome/scss/font-awesome.scss';
import 'c3/src/scss/main.scss';
import './scss/main.scss';

import HomeworkModule from './js/module/homework';
import FiltersModule from './js/module/filters';
import OverviewModule from './js/module/overview';

const modules = [
  new HomeworkModule('#colors', 'https://upload.wikimedia.org/wikipedia/commons/0/05/Odd-eyed_cat_by_ihasb33r.jpg'),
  new FiltersModule('#filters'),
  new OverviewModule('#overview-chart')
];

modules.forEach((module) => {
  module.render();
});
