import 'choices.js/assets/styles/scss/choices.scss';

import Choices from 'choices.js';
import { filtersStore } from '../store';
import $ from 'jquery';

/**
 * This module is in charge to handle the filters.
 */
export default class FiltersModule {
  constructor(selector) {
    this.section = document.querySelector(selector);

    filtersStore.reset();
  }

  loadGenres() {
    return fetch('http://localhost:3030/genres')
      .then(response => response.json())
      .then(json => json);
  }

  showGenres() {
    const div = this.section.querySelector('#filters-genres');

    this.loadGenres().then(genres => {
      div.innerHTML = '';
      genres.forEach(genre => {
        const genreDiv = document.createElement('div');
        genreDiv.classList.add('col-sm-6', 'col-md-4');

        const genreInput = document.createElement('input');
        genreInput.setAttribute('type', 'checkbox');
        genreInput.setAttribute('id', `genre-${genre.name}`);
        genreInput.setAttribute('checked', true);

        const genreLabel = document.createElement('label');
        genreLabel.setAttribute('for', `genre-${genre.name}`);
        genreLabel.innerHTML = genre.name;

        genreDiv.append(genreInput);
        genreDiv.append(genreLabel);

        div.append(genreDiv);
      });
    });
  }

  loadCountries() {
    return fetch('http://localhost:3030/countries')
      .then(response => response.json())
      .then(json => json);
  }

  showCountries() {
    const div = this.section.querySelector('#filters-countries');

    this.loadCountries().then(countries => {
      div.innerHTML = '';

      const select = document.createElement('select');
      select.setAttribute('multiple', true);
      countries.forEach(country => {
        const option = document.createElement('option');

        option.setAttribute('value', country.iso_3166_1);
        option.innerHTML = country.name;

        select.append(option);
      })

      div.append(select);
      const choices = new Choices(select, {
        renderChoiceLimit: 10,
        removeItemButton: true
      });

      select.addEventListener('change', function() {
        let filters = filtersStore.getFilters();
        filters['production_countries.iso_3166_1'] = { $in: $(this).val() };
        filtersStore.setFilters(filters);
      });
    })
  }

  updateFilters(genres, countries) {

  }

  render() {
    this.showGenres();
    this.showCountries();
  }
}
