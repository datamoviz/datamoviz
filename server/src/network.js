const parse = require('./parser');

let MAIN_ACTORS_COUNT = 5;
let CREW_COUNT = 1;
let MOVIE_COUNT = 30;

const ACTOR_GROUP = 1;
const DIRECTOR_GROUP = 2;

module.exports = function (app, router) {
  router.get('/network', async (req, res) => {
    const filters = parse(req.query.filters);
    MAIN_ACTORS_COUNT = req.query.actorCount ? parseInt(req.query.actorCount) : 5
    CREW_COUNT = req.query.crewCount ? parseInt(req.query.crewCount) : 1
    MOVIE_COUNT = req.query.movieCount ? parseInt(req.query.movieCount) : 30

    const db = await app.get('mongoClient');
    const moviesIds = await db.collection('movies').find(filters, {id:1, _id:0, original_title:1}).sort({imdb_nb_reviews:-1}).limit(MOVIE_COUNT).map(x => x.id).toArray();
    const moviesTitles = await db.collection('movies').find(filters, {id:1, _id:0, original_title:1}).sort({imdb_nb_reviews:-1}).limit(MOVIE_COUNT).toArray()
    const moviesTitleMap = {}
    moviesTitles.forEach(movie => {
      moviesTitleMap[movie.id] = movie.original_title
    })

    const credits = await db.collection('credits').find({ id: { $in:moviesIds } }, { crew:1, cast: 1, id: 1 }).toArray();

    // let actors = await db.collection('credits').aggregate([
    //   { "$match": { "id": {"$in":moviesIds} } },
    //   { "$unwind": "$cast" },
    //    { "$match": { "cast.order": {"$lt":MAIN_ACTORS_COUNT} } }, // Get only main actors
    //    { "$project": {"cast.name":1} },
    //    { "$group": { "_id": "$cast.name" }}
    //  ]).map(x => { return {name: x._id, group: ACTOR_GROUP}}).toArray()
    //
    //
    // let directors = await db.collection('credits').aggregate([
    //   { "$match": { "id": {"$in":moviesIds} } },
    //   { "$unwind": "$crew" },
    //    { "$match": { "crew.job": {"$in":["Director"]} } },
    //    { "$project": {"crew":1} },
    //    { "$group": { "_id": "$crew.name" }}
    //  ]).map(x => { return {name: x._id, job:'Director', group:DIRECTOR_GROUP}}).toArray()
    //
    // let people = actors.concat(directors);

    let actorsLinks = getActorsNetworkLink(credits);
    actors = actorsLinks.actors
    links = actorsLinks.links

    return res.json({nodes:actors, links, moviesTitleMap});
  });
};

function getActorsNetworkLink(credits) {
  const links = [];
  const actorsMoviesMap = new Map() // map[actorName] => [movieId1, movieId2 ...]

  let actorsObjects = [];
  credits.forEach(movieCast => {

    let cast = movieCast.cast.slice(0, MAIN_ACTORS_COUNT);
    cast = cast.concat(movieCast.crew.slice(0, CREW_COUNT));

    cast.forEach(actorObject1 => {
      const existingMovieArray = actorsMoviesMap.get(actorObject1.name);
      if(existingMovieArray) {
        existingMovieArray.push(movieCast.id)
        actorsMoviesMap.set(actorObject1.name, existingMovieArray);
      } else {
        actorsMoviesMap.set(actorObject1.name, [movieCast.id]);
      }

      actorsObjects.push({
        name: actorObject1.name + '_' + movieCast.id,
        group: actorObject1.job ? DIRECTOR_GROUP : ACTOR_GROUP,
        movieGroup: movieCast.id
      })

      cast.forEach(actorObject2 => {
        if(actorObject1.name === actorObject2.name) {
          return;
        }
        // Keep only (actorname1, actorname2) and throw (actorname2, actorname1)
        if(actorObject1.name.localeCompare(actorObject2.name) > 0) {
          return;
        }

        const linkObject = {
          source: actorObject1.name + '_' + movieCast.id,
          target: actorObject2.name + '_' + movieCast.id
        }

        links.push(linkObject)
      })
    })
  })

  // Add links between same actors
  actorsMoviesMap.forEach((moviesIdArray, actorName) => {
    moviesIdArray.forEach(movieId1 => {
      moviesIdArray.forEach(movieId2 => {
        if(movieId1 >= movieId2) {
          return;
        }
        links.push({
          source: actorName + '_' + movieId1,
          target: actorName + '_' + movieId2
        })

      })
    })
  });

  return {links, actors: actorsObjects};
}
