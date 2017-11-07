import CountUp from 'countup.js';

/**
 * This module is in charge to animate header.
 */
export default class HeaderModule {
  constructor(selector) {
    this.selector = selector;
  }

  countMovies() {
    return fetch('http://localhost:3030/movies')
      .then(response => response.json())
      .then(json => json.total)
      .then(total => {
        const counter = new CountUp(this.selector, 0, total, null, 3, {separator: ' '});
        counter.start();
      });
  }

  render() {
    this.countMovies();
  }
}
