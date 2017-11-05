// Initializes the `credits` service on path `/credits`
const createService = require('feathers-nedb');
const createModel = require('../../models/credits.model');
const hooks = require('./credits.hooks');
const filters = require('./credits.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'credits',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/credits', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('credits');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
