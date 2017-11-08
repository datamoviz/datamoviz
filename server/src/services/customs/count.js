module.exports = function (app) {

  app.use('/count/movies', {
    find(request) {
      const query = request.query;
      return app.get('mongoClient').then(db => {
        return db.collection('movies').find(query).count();
      });
    }
  });
};
