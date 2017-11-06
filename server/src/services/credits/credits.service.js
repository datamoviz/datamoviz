// Initializes the `credits` service on path `/credits`
const createService = require('feathers-mongodb');
const hooks = require('./credits.hooks');
const filters = require('./credits.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate };

  // Initialize our service with any options it requires
  app.use('/credits', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('credits');

  mongoClient.then(db => {
    service.Model = db.collection('credits');
  });

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
