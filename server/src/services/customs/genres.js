module.exports = function (app) {
  const moviesService = app.service('movies');
  app.use('/genres', {
    find() {
      return moviesService.find({query:{
        budget:0
      }});
    },
  });
};
