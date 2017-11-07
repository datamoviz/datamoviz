module.exports = function (app) {

  app.use('/countries', {
    find() {
      return app.get('mongoClient').then(db => {
        return db.collection('movies').distinct('production_countries').then(result => {
          return result.sort((a, b) => {
            if (a.name < b.name) {
              return -1;
            }

            if (a.name > b.name) {
              return 1;
            }

            return 0;
          });
        });
      });
    },
  });
};
