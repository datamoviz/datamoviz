// Initializes the `movies` service on path `/movies`
const createService = require('feathers-mongodb');
const hooks = require('./movies.hooks');
const filters = require('./movies.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');
  const mongoClient = app.get('mongoClient');
  const options = { paginate };

  // Initialize our service with any options it requires
  app.use('/movies', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('movies');

  mongoClient.then(db => {
    service.Model = db.collection('movies');
  });

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
