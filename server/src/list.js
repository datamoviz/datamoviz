module.exports = function (app, router) {

  router.get('/list/genres', (req, res) => {
    return app.get('mongoClient').then(db => {
      return db.collection('movies').distinct('genres').then(data => res.json(data));
    });
  });

  router.get('/list/content-ratings', (req, res) => {
    return app.get('mongoClient').then(db => {
      return db.collection('movies').distinct('content_rating').then(data => res.json(data));
    });
  });
};
