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
};
