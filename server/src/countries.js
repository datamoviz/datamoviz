module.exports = function (app, router) {

  router.get('/countries', (req, res) => {
    return app.get('mongoClient').then(db => {
      return db.collection('movies').distinct('production_countries').then(result => {
        return res.json(result.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }

          if (a.name > b.name) {
            return 1;
          }

          return 0;
        }));
      });
    });
  });
};
