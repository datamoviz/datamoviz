module.exports = function (app) {

  app.use('/genres', {
    find() {
      return app.get('mongoClient').then(db => {
        return db.collection('movies').distinct('genres');
      });
    },
  });
};
