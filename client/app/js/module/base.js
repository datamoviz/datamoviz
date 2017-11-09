/**
 * This module is a base module providing utilities.
 */
export default class BaseModule {
  constructor(section) {
    this.section = section;
  }

  render() {
    throw('This method must be implemented by child class');
  }
}
