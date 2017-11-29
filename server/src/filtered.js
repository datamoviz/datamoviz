const parse = require('./parser');

module.exports = function (app, router) {

  router.get('/filtered/movies', (req, res) => {
    const filters = parse(req.query.filters);

    return app.get('mongoClient').then(db => {
      return db.collection('movies').find(filters).sort({imdb_nb_reviews:-1}).limit(15).toArray().then(data => res.json(data));
    });
  });
};
