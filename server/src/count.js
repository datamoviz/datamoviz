const parse = require('./parser');

module.exports = function (app, router) {

  router.get('/count/movies', (req, res) => {
    const filters = parse(req.query.filters);

    return app.get('mongoClient')
      .then(db => {
      return db.collection('movies').find(filters).count().then(data => res.json(data));
    });
  });

  router.get('/count/words', (req, res) => {
    const filters = parse(req.query.filters);

    return app.get('mongoClient')
      .then(db => {
        return db.collection('movies').aggregate([
          {
            $match: filters
          },
          {
            $project: {
              words: '$title_keywords'
            }
          },
          {
            $unwind: {
              path: '$words'
            }
          },
          {
            $group: {
              _id: '$words',
              value: { $sum: 1 }
            }
          },
          {
            $sort: {
              value: -1
            }
          },
          {
            $limit: 25
          }
        ]).toArray()
          .then(data => res.json(data));
      });
  });

  router.get('/count/countries', (req, res) => {
    const filters = parse(req.query.filters);

    return app.get('mongoClient')
      .then(db => {
        return db.collection('movies').aggregate([
          {
            $match: filters
          },
          {
            $project: {
              countries: '$production_countries'
            }
          },
          {
            $unwind: {
              path: '$countries'
            }
          },
          {
            $group: {
              _id: '$countries',
              value: { $sum: 1 }

            }
          },
          {
            $sort: {
              value: -1
            }
          },
          {
            $limit: 20
          }
        ]).toArray()
          .then(data => res.json(data));
    });
  });
};
