const parse = require('./parser');

module.exports = function (app) {

  app.use('/aggregate/movies', {
    find(request) {
      const filters = parse(request.query.filters);

      return app.get('mongoClient').then(db => {
        const startPromise = db.collection('movies').find({}, {release_date: 1}).sort({release_date: 1}).limit(1).toArray();
        const endPromise = db.collection('movies').find({}, {release_date: 1}).sort({release_date: -1}).limit(1).toArray();
        const aggregatePromise = db.collection('movies').aggregate([
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
        ]).toArray();

        return Promise.all([startPromise, endPromise, aggregatePromise])
          .then(([start, end, aggregate]) => {
            const startDate = new Date(start[0].release_date).getFullYear();
            const endDate = new Date(end[0].release_date).getFullYear();
            const matchedYears = aggregate;

            let years = [];
            for (let y = startDate; y < endDate; ++y) {
              years.push({
                _id: y,
                count: 0
              });
            }

            years.map((year) => {
              return Object.assign(year, matchedYears.find((matchedYear) => {
                return year._id === matchedYear._id;
              }))
            });

            return years;
        });
      });
    }
  });
};
