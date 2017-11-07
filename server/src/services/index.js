const movies = require('./movies/movies.service.js');
const credits = require('./credits/credits.service.js');
module.exports = function () {
  const app = this;
  app.configure(movies);
  app.configure(credits);

  require('./customs')(app);
};
