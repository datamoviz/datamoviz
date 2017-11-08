class FiltersStore {
  reset() {
    this.filters = {
      'production_countries.iso_3166_1': { $in: [] },
      'genres.name': { $nin: [] }
    }

    Object.freeze(this.filters);
  }

  setFilters(filters) {
    this.filters = filters;
    Object.freeze(this.filters);

    document.dispatchEvent(new CustomEvent('filtersUpdate', this.filters));
  }

  getFilters() {
    return Object.assign({}, this.filters); // Cloning immutable object
  }
}

export const filtersStore = new FiltersStore();
