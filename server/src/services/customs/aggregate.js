module.exports = function (app) {

  app.use('/aggregate/movies', {
    find(request) {
      let rules;
      if (request.query.rules === undefined) {
        rules = [];
      } else {
        rules = JSON.parse(decodeURI(request.query.rules));
      }

      return app.get('mongoClient').then(db => {
        return db.collection('movies').aggregate(rules, (err, res) => {
          return res;
        });
      });
    }
  });
};
