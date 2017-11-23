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

  app.use('/aggregate/genres', {
    find(request) {
      let filters = parse(request.query.filters);

      return app.get('mongoClient').then(db => {
        const countPromise = db.collection('movies').aggregate([
          {
            $match: filters
          },
          {
            $unwind: {
              path: '$genres'
            }
          },
          {
            $group: {
              _id: "total",
              count: { $sum: 1 }
            }
          }
        ]).toArray();
        const genresPromise = db.collection('movies').aggregate([
          {
            $match: filters
          },
          {
            $project: {
              genre: '$genres'
            }
          },
          {
            $unwind: {
              path: '$genre'
            }
          },
          {
            $group: {
              _id: '$genre.name',
              value: { $sum: 1 }
            }
          },
          {
            $sort: {
              value: -1
            }
          }
        ]).toArray();

        return Promise.all([countPromise, genresPromise])
          .then(([total, genres]) => {
            if (total.length === 0) {
              return [];
            }

            total = total[0].count;

            let sum = 0, i = 0;
            let displayedGenres = [];
            while (i < genres.length) {
              sum += genres[i].value / total;
              displayedGenres.push([genres[i]._id, genres[i].value]);

              ++i;
              if ((i < genres.length - 1 && genres[i].value / total < 0.02) || i > 8) {
                break;
              }
            }

            if (i !== genres.length) {
              displayedGenres.push(['Others',  (1 - sum) * total]);
            }

            return displayedGenres;
          })
      });
    }
  });
};
