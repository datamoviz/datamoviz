const english = require('stopwords').english;
const french = require('stopwords').french;
const spanish = require('stopwords').spanish;
const italian = require('stopwords').italian;
const german = require('stopwords').german;

module.exports = function (app) {

  app.use('/count/movies', {
    find(request) {
      let filters;
      if (request.query.filters === undefined) {
        filters = {};
      } else {
        filters = JSON.parse(decodeURI(request.query.filters));
      }

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

      let map = function() {
        let title = this.title;
        if (title) {
          title = title.toLowerCase().replace(/[^a-zA-Z ]/g, '').split(' ').filter(function (value) {
            return stopwords.indexOf(value.toLowerCase()) === -1;
          });

          for (let i = title.length - 1; i >= 0; i--) {
            if (title[i]) {
              emit(title[i], 1);
            }
          }
        }
      };

      let reduce = function(key, values) {
        let count = 0;
        values.forEach(function(v) {
          count +=v;
        });
        return count;
      };

      //let filters;
      //if (request.query.filters === undefined) {
      //  filters = {};
      //} else {
      //  filters = JSON.parse(decodeURI(request.query.filters));
      //}

      return app.get('mongoClient')
        .then(db => {
          return db.collection('movies').mapReduce(map, reduce, {
            out: 'word_count',
            scope: {
              stopwords: [...french, ...english, ...spanish, ...german, ...italian]
            }
          });
        })
        .then((results) => {
          return results.find({}).sort({ value: -1 }).limit(20).toArray();
        });
    }
  });
};
