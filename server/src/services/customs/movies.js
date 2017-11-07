module.exports = function (app) {
  const moviesService = app.service('movies');
  app.use('/movies/count', {
    find() {
      return moviesService.count()
    },
  });
};
