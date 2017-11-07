/**
 * This module is in charge to handle the filters.
 */
export default class FiltersModule {
  constructor(selector) {
    this.section = document.querySelector(selector);
  }

  loadGenres() {
    return fetch('http://localhost:3030/genres')
      .then(response => response.json())
      .then(json => json);
  }

  showGenres() {
    const div = this.section.querySelector('#filters-genres');

    this.loadGenres().then((genres) => {
      div.innerHTML = '';
      genres.forEach((genre) => {
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

  render() {
    this.showGenres();
  }
}
