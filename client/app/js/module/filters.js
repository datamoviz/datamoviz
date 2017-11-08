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

  toggleGenre() {
    let filters = filtersStore.getFilters();
    const val = $(this).val();
    const i = filters['genres.name'].$nin.indexOf(val);
    if (i === -1) {
      filters['genres.name'].$nin.push(val);
    } else {
      filters['genres.name'].$nin.splice(i, 1);
    }

    filtersStore.setFilters(filters);
  }

  toggleAllGenres($genres) {
    let filters = filtersStore.getFilters();
    let filteredGenres = [];
    $genres.each(function(element) {
      if (!this.checked) {
        filteredGenres.push($(this).val());
      }
    });

    filters['genres.name'].$nin = filteredGenres;
    filtersStore.setFilters(filters);
  }

  appendGenre(genre, div) {
    const genreDiv = document.createElement('div');
    genreDiv.classList.add('col-sm-6', 'col-md-4');

    const genreInput = document.createElement('input');
    genreInput.setAttribute('type', 'checkbox');
    genreInput.setAttribute('id', `filters-genre-${genre.name}`);
    genreInput.setAttribute('checked', true);
    genreInput.setAttribute('value', genre.value);
    $(genreInput).on('click', this.toggleGenre);

    const genreLabel = document.createElement('label');
    genreLabel.setAttribute('for', `filters-genre-${genre.name}`);
    genreLabel.innerHTML = genre.name;

    genreDiv.append(genreInput);
    genreDiv.append(genreLabel);
    div.append(genreDiv);
  }

  showGenres() {
    const div = this.section.querySelector('#filters-genres');

    this.loadGenres().then(genres => {
      div.innerHTML = '';
      this.addToggleAll(div);
      this.appendGenre({
        name: 'None (wip)',
        value: ''
      }, div);

      genres.forEach(genre => {
        genre.value = genre.name;
        this.appendGenre(genre, div);
      });
    });
  }

  addToggleAll(div) {
    const toggleAll = document.createElement('input');
    toggleAll.setAttribute('type', 'checkbox');
    toggleAll.setAttribute('checked', true);
    toggleAll.setAttribute('id', 'filters-genres-toggle-all');
    toggleAll.addEventListener('change', () => {
      const $genres = $(div).find('[id^=filters-genre-]');
      $genres.prop('checked', toggleAll.checked);
      this.toggleAllGenres($genres);
    })
    const toggleAllLabel = document.createElement('label');
    toggleAllLabel.setAttribute('for', 'filters-genres-toggle-all');
    toggleAllLabel.classList.add('toggle-all');
    toggleAllLabel.innerHTML = 'Toggle all';

    $(this.section).find('h3:first').append(toggleAll).append(toggleAllLabel);
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
