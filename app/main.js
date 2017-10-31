import * as d3 from 'd3';
import 'bootstrap-reboot/bootstrap-reboot.scss';
import 'bootstrap-4-grid/scss/grid.scss';
import './scss/main.scss';







// Old boilerplate stuff (to be adapted)

import { createCircleChart } from './js/circle';
import makeBarChart from './js/bar';

const chartWidth = 800;
const chartHeight = 400;

window.addEventListener('resize', makeBarChart('viz', d3.range(10), chartWidth, chartHeight));

// Homework

import ColorHistogram from './js/color.js'

new ColorHistogram('#colors', 'https://upload.wikimedia.org/wikipedia/commons/0/05/Odd-eyed_cat_by_ihasb33r.jpg?' + Math.random())
