module.exports = function (app) {

  app.use('/filtered/movies', {
    find(request) {
      let filters;
      if (request.query.filters === undefined) {
        filters = {};
      } else {
        filters = JSON.parse(decodeURI(request.query.filters));
      }

      return app.get('mongoClient').then(db => {
        return db.collection('movies').find(filters).limit(15).toArray();
      });
    }
  });

  app.use('/filtered/most-popular', {
    find() {
      return app.get('mongoClient').then(db => {
        return db.collection('movies').find({}).sort({popularity:-1}).limit(15).toArray();
      });
    }
  });
};
