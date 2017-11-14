module.exports = function (app) {

  app.use('/aggregate/movies', {
    find(request) {
      let filters;
      if (request.query.filters === undefined) {
        filters = {};
      } else {
        filters = JSON.parse(decodeURI(request.query.filters));
      }

      return app.get('mongoClient').then(db => {
        return db.collection('movies').aggregate([
          {
            $match: filters
          },
          {
            $project: {
              year: { $year: ['$release_date'] }
            }
          },
          {
            $group: {
              _id: '$year',
              count: { $sum: 1 }
            }
          },
          {
            $sort: {
              _id: -1
            }
          }
        ]).toArray()
      });
    }
  });
};
