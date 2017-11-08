module.exports = function (app) {

  app.use('/filtered/movies', {
    find(request) {
      const query = request.query;
      return app.get('mongoClient').then(db => {
        return db.collection('movies').find(query).limit(10).toArray();
      });
    }
  });
};
