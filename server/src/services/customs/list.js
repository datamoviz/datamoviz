module.exports = function (app) {

  app.use('/list/genres', {
    find() {
      return app.get('mongoClient').then(db => {
        return db.collection('movies').distinct('genres');
      });
    },
  });

  app.use('/list/content-ratings', {
    find() {
      return app.get('mongoClient').then(db => {
        return db.collection('movies').distinct('content_rating');
      });
    },
  });
};
