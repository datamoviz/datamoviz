import ColorHistogram from '../color';

/**
 * This module will be deleted.
 */
export default class HomeworkModule {
  constructor(selector, image) {
    this.selector = selector;
    this.image = `${image}?${Math.random()}`;
  }

  render() {
    const histogram = new ColorHistogram(this.selector);
    histogram.render(this.image);
  }
}
