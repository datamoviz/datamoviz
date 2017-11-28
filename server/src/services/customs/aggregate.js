const parse = require('./parser');

module.exports = function (app) {

  app.use('/aggregate/years', {
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

            let yearsList = [];
            let years = [];
            for (let y = startDate; y <= endDate; ++y) {
              yearsList.push(y);
              years.push(0);
            }

            years.forEach((value, index) => {
              const matchedYear = aggregate.find((matchedYear) => {
                return startDate + index === matchedYear._id;
              });

              years[index] = matchedYear ? matchedYear.count : 0;
            });

            yearsList.unshift('list');
            years.unshift('years');
            return [yearsList, years];
          });
      });
    }
  });

  app.use('/aggregate/years-colors', {
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
              year: { $year: ['$release_date'] },
              color: '$color'
            }
          },
          {
            $unwind: {
              path: '$color'
            }
          },
          {
            $group: {
              _id: {
                'year':'$year',
                'color': '$color'
              },
              value: { $sum: 1 }
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

            let blackAndWhite = [];
            let color = [];
            for (let y = startDate; y <= endDate; ++y) {
              blackAndWhite.push(0);
              color.push(0);
            }

            color.forEach((value, index) => {
              const matchedYear = aggregate.find((matchedYear) => {
                return startDate + index === matchedYear._id.year && matchedYear._id.color === "Color";
              });

              color[index] = matchedYear ? matchedYear.value : 0;
            });

            blackAndWhite.forEach((value, index) => {
              const matchedYear = aggregate.find((matchedYear) => {
                return startDate + index === matchedYear._id.year && matchedYear._id.color === "Black and White";
              });

              blackAndWhite[index] = matchedYear ? matchedYear.value : 0;
            });

            blackAndWhite.unshift('b_and_w');
            color.unshift('color');
            return [blackAndWhite, color];
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
              _id: '$genre',
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
              displayedGenres.push({_id: genres[i]._id, value: genres[i].value});

              ++i;
              if ((i < genres.length - 1 && genres[i].value / total < 0.02) || i > 8) {
                break;
              }
            }

            if (i !== genres.length) {
              displayedGenres.push({_id: 'Others', value: Math.round((1 - sum) * total)});
            }

            return displayedGenres;
          })
      });
    }
  });

  app.use('/aggregate/colors', {
    find(request) {
      let filters = parse(request.query.filters);

      return app.get('mongoClient').then(db => {
        return db.collection('movies').aggregate([
          {
            $match: filters
          },
          {
            $project: {
              color: '$color'
            }
          },
          {
            $unwind: {
              path: '$color'
            }
          },
          {
            $group: {
              _id: '$color',
              value: { $sum: 1 }
            }
          },
          {
            $sort: {
              value: -1
            }
          }
        ]).toArray().then((colors) => {
          const formattedColors = [];

          colors.forEach((color) => {
            formattedColors.push([color._id, color.value]);
          });

          return formattedColors;
        });
      });
    }
  });
};
