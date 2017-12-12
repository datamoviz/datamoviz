module.exports = function (app, router) {

  router.get('/countries', (req, res) => {
    return app.get('mongoClient').then(db => {
      return db.collection('movies').distinct('production_countries').then(result => res.json(result));
    });
  });
};
