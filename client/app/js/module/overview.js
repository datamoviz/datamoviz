import 'c3/src/scss/main.scss';

import c3 from 'c3';
import { filtersStore } from '../store';
import $ from 'jquery';
import BaseModule from './base';

/**
 * This module is in charge to handle the rendering of the overall movies
 * section.
 */
export default class OverviewModule extends BaseModule {
  constructor(section) {
    super(section);
  }

  render() {
    c3.generate({
      bindto: this.section.id,
      data: {
        columns: [
          ['Evolution of movies budget', 30, 200, 100, 400, 150, 250]
        ],
        colors: {
          'Evolution of movies budget': '#009946'
        }
      }
    });

    document.addEventListener('filtersUpdate', function() {
      fetch('http://localhost:3030/filtered/movies?' + $.param(filtersStore.getFilters()))
        .then(response => response.json())
        .then(json => {
          json.forEach(function(movie) {
            console.log(movie.original_title);
          })
        });
    })
  }
}
