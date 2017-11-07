/**
 * TODO : Actor network
 */
export default class ActorNetworkModule {
  constructor(selector) {
    this.section = document.querySelector(selector);
  }

  render() {
    this.section.innerHTML = 'Actor network Hello world!';
  }
}
