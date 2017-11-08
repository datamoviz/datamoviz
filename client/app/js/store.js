class FiltersStore {
  reset() {
    this.filters = {
      only_countries: [],
      genres: []
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
