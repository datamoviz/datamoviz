const parse = require('./parser');

module.exports = function (app) {

  app.use('/filtered/movies', {
    find(request) {
      const filters = parse(request.query.filters);

      return app.get('mongoClient').then(db => {
        return db.collection('movies').find(filters).sort({imdb_nb_reviews:-1}).limit(15).toArray();
      });
    }
  });
};
