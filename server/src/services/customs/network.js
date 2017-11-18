module.exports = function (app) {

  app.use('/network', {
    async find() {
      const db = await app.get('mongoClient');
      const movies = await db.collection('movies').find().limit(2).toArray();

      const moviesIds = collectMoviesIds(movies);
      console.log(moviesIds)

      const credits = await db.collection('credits').find({ id: { $in:moviesIds } }).toArray();
      console.log(credits)


      return movies
    }
  });
};

function collectMoviesIds(movies) {
  let moviesIds = [];
  Object.keys(movies).forEach(index => {
    var id = movies[index].id;
    moviesIds.push(id);
  });

  return moviesIds;
}
