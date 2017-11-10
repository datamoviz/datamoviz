module.exports = function (app) {

  app.use('/count/movies', {
    find(request) {
      let filters;
      if (request.query.filters === undefined) {
        filters = {};
      } else {
        filters = JSON.parse(decodeURI(request.query.filters));
      }

      return app.get('mongoClient').then(db => {
        return db.collection('movies').find(filters).count();
      });
    }
  });
};
