const parse = require('./parser');

module.exports = function (app) {

  app.use('/count/movies', {
    find(request) {
      const filters = parse(request.query.filters);

      return app.get('mongoClient')
        .then(db => {
          return db.collection('movies').find(filters).count();
        })
        .then((count) => {
          if(count === 0) {
            return '0';
          }
          return count;
        });
    }
  });

  app.use('/count/words', {
    find(request) {
      const filters = parse(request.query.filters);

      return app.get('mongoClient')
        .then(db => {
          return db.collection('movies').aggregate([
            {
              $match: filters
            },
            {
              $project: {
                words: { $split: ['$title', ' '] }
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
          ]).toArray();
        });
    }
  });
};
