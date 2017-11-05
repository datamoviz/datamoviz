import c3 from 'c3'

/**
 * This module is in charge to handle the rendering of the overall movies
 * section.
 */
export default class OverviewModule {
  constructor(selector) {
    this.selector = selector;
  }

  render() {
    c3.generate({
        bindto: this.selector,
        data: {
          columns: [
            ['Evolution of movies budget', 30, 200, 100, 400, 150, 250]
          ],
          colors: {
            'Evolution of movies budget': '#009946'
          }
        }
    });
  }
}
