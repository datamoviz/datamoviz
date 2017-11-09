import BaseModule from './base'

/**
 * TODO : Actor network
 */
export default class ActorNetworkModule extends BaseModule {
  constructor(section) {
    super(section);
  }

  render() {
    this.section.innerHTML = 'Actor network Hello world!';
  }
}
