const assert = require('assert');
const app = require('../../src/app');

describe('\'credits\' service', () => {
  it('registered the service', () => {
    const service = app.service('credits');

    assert.ok(service, 'Registered the service');
  });
});
