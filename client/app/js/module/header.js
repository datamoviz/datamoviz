import CountUp from 'countup.js';
import { filtersStore } from '../store';
import $ from 'jquery';

/**
 * This module is in charge to animate header.
 */
export default class HeaderModule {
  constructor(selector) {
    this.selector = selector;
    this.currentTotal = 0;
  }

  countMovies(filters) {
    filters = filters || {};

    return fetch('http://localhost:3030/count/movies?' + $.param(filters))
      .then(response => response.json())
      .then(json => json)
      .then(total => {
        const counter = new CountUp(this.selector, this.currentTotal, total, null, 2, {separator: ' '});
        counter.start();
        this.currentTotal = total;
      });
  }

  render() {
    this.countMovies();

    document.addEventListener('filtersUpdate', () => {
      this.countMovies(filtersStore.getFilters());
    });
  }
}
