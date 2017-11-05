import * as d3 from 'd3';
import 'bootstrap-reboot/bootstrap-reboot.scss';
import 'bootstrap-4-grid/scss/grid.scss';
import 'c3/src/scss/main.scss';
import './scss/main.scss';

import HomeworkModule from './js/module/homework'
import BoilerplateModule from './js/module/homework'
import OverviewModule from './js/module/overview'

let homework = new HomeworkModule('#colors', 'https://upload.wikimedia.org/wikipedia/commons/0/05/Odd-eyed_cat_by_ihasb33r.jpg');
let overview = new OverviewModule('#overview-chart')

homework.render();
overview.render();
