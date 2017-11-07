/**
 * This module is in charge to handle the filters.
 */
export default class FiltersModule {
  constructor(selector) {
    this.section = document.querySelector(selector);
  }

  loadGenres() {
    return fetch('http://localhost:3030/genres')
      .then(response => {
        return response.json();
      })
      .then(json => {
        return json;
      });
  }

  showGenres() {
    const div = this.section.querySelector('#filters-genres');

    this.loadGenres().then(genres => {
      div.innerHTML = '';
      genres.forEach(genre => {
        let genreDiv = document.createElement('div');
        genreDiv.classList.add('col-sm-6', 'col-md-4');

        let genreInput = document.createElement('input');
        genreInput.setAttribute('type', 'checkbox');
        genreInput.setAttribute('id', `genre-${genre.name}`);
        genreInput.setAttribute('checked', true);

        let genreLabel = document.createElement('label');
        genreLabel.setAttribute('for', `genre-${genre.name}`);
        genreLabel.innerHTML = genre.name;

        genreDiv.append(genreInput);
        genreDiv.append(genreLabel);

        div.append(genreDiv);
      });
    })
  }

  render() {
    this.showGenres();
  }
}
