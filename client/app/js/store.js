class FiltersStore {
  reset() {
    this.filters = {
      'production_countries.iso_3166_1': { $in: [] },
      'genres': []
    }
  }

  setFilters(filters) {
    this.filters = filters;

    document.dispatchEvent(new CustomEvent('filtersUpdate', this.filters));
  }

  getFilters() {
    return this.filters;
  }
}

export const filtersStore = new FiltersStore();
