const parse = require('./parser');

const MINIMUM_LINK = 1;
const MINIMUM_MOVIE_COUNT = 1;
const MAIN_ACTORS_COUNT = 5;

const ACTOR_GROUP = 1
const DIRECTOR_GROUP = 2

module.exports = function (app, router) {
  router.get('/network', async (req, res) => {
    const filters = parse(req.query.filters);

    const db = await app.get('mongoClient');
    const moviesIds = await db.collection('movies').find(filters, {id:1, _id:0, original_title:1}).sort({imdb_nb_reviews:-1}).limit(20).map(x => x.id).toArray();
    const moviesTitles = await db.collection('movies').find(filters, {id:1, _id:0, original_title:1}).sort({imdb_nb_reviews:-1}).limit(20).toArray()
    const moviesTitleMap = {}
    moviesTitles.forEach(movie => {
      moviesTitleMap[movie.id] = movie.original_title
    })

    const credits = await db.collection('credits').find({ id: { $in:moviesIds } }, { crew:1, cast: 1, id: 1 }).toArray();

    // let actors = await db.collection('credits').distinct('cast.name', { id: { $in:moviesIds }});
    let actors = await db.collection('credits').aggregate([
      { "$match": { "id": {"$in":moviesIds} } },
      { "$unwind": "$cast" },
       { "$match": { "cast.order": {"$lt":MAIN_ACTORS_COUNT} } }, // Get only main actors
       { "$project": {"cast.name":1} },
       { "$group": { "_id": "$cast.name" }}
     ]).map(x => { return {name: x._id, group: ACTOR_GROUP}}).toArray()


    let directors = await db.collection('credits').aggregate([
      { "$match": { "id": {"$in":moviesIds} } },
      { "$unwind": "$crew" },
       { "$match": { "crew.job": {"$in":["Director"]} } },
       { "$project": {"crew":1} },
       { "$group": { "_id": "$crew.name" }}
     ]).map(x => { return {name: x._id, job:'Director', group:DIRECTOR_GROUP}}).toArray()

    let people = actors.concat(directors);

    let links = getActorsNetworkLink(credits, people);

    people = getActorNodeObject(people, links, credits);

    let actorsLinks = removeActorsMinMovieCount(people, links)
    actors = actorsLinks.actors
    links = actorsLinks.links

    return res.json({nodes:actors, links, moviesTitleMap});
  });
};

function getActorsLinkMap(credits, actors) {
  const actorsLink = new Map();
  actors.forEach(actor => {
    credits.forEach(movieCast => {

      if(actor.group === ACTOR_GROUP && !peopleObjectsContainsName(movieCast.cast, actor.name)) {
        return;
      }

      if(actor.group === DIRECTOR_GROUP && !peopleObjectsContainsName(movieCast.crew, actor.name)) {
        return;
      }

      if(actor.movieGroup) {
        actor.movieGroup = 9999 // multiple movies
      } else {
        actor.movieGroup = movieCast.id
      }

      movieCast.cast.forEach(actorObject2 => {
        if(actor.name === actorObject2.name) {
          return;
        }

        if(!peopleObjectsContainsName(actors, actorObject2.name)) {
          return;
        }

        // Keep only (actorname1, actorname2) and throw (actorname2, actorname1)
        if(actor.name.localeCompare(actorObject2.name) > 0) {
          return;
        }

        const linkObject = {
          source: actor.name,
          target: actorObject2.name
        }

        const key = JSON.stringify(linkObject);

        const existingCount = actorsLink.get(key);
        if(existingCount) {
          actorsLink.set(key, existingCount + 1);
        } else {
          actorsLink.set(key, 1);
        }

      })

    })

  });

  return actorsLink;
}

function getActorNodeObject(actors, links, credits) {
  actors =  actors.map(actor => {
    let movieCount = 0;
    credits.forEach(creditObject => {

      // Actor
      if(actor.group === ACTOR_GROUP) {
        creditObject.cast.forEach(actorObject => {
          if(actorObject.name === actor.name) {
            movieCount++;
            return false;
          }
        })
      }

      // Director
      if(actor.group === DIRECTOR_GROUP && movieCount === 0) {
        creditObject.crew.forEach(actorObject => {
          if(actorObject.name === actor.name) {
            movieCount++;
            return false;
          }
        })
      }


    })
    return {name: actor.name, group: actor.group, movieCount, movieGroup: actor.movieGroup}
  });

  return actors
}

function removeActorsMinMovieCount(actors, links) {
  actors = actors.filter(actor => actor.movieCount >= MINIMUM_MOVIE_COUNT);

  // Remove links not in actors
  links = links.filter(link => {
    for(let actor of actors) {

      if(link.source === actor.name) {
        for(let actor2 of actors) {
          if(link.target === actor2.name) {
            return true;
          }
        }
      } else if(link.target === actor.name) {
        for(let actor2 of actors) {
          if(link.source === actor2.name) {
            return true;
          }
        }
      }
    }
    return false;
  })


  // remove actor not in links
  actors = removeActorsNotInLinks(actors, links)

  return {actors, links}

}


function removeActorsNotInLinks(actors, links) {
  let actorsIndexToRemove = [];

  for (let i = 0; i < actors.length; i++) {
    let actor = actors[i].name;
    let found = false;
    links.forEach(link => {
      if((link.source === actor || link.target === actor) && link.count >= MINIMUM_LINK) {
        found = true;
        return false;
      }
    })

    if(!found) {
      actorsIndexToRemove.push(i);
    }
  }

  for (let i = actorsIndexToRemove.length -1; i >= 0; i--) {
    actors.splice(actorsIndexToRemove[i], 1);
  }

  return actors;
}

function getActorsNetworkLink(credits, actors) {
  const actorsLinkMap = getActorsLinkMap(credits, actors);
  const links = [];

  // MINIMUM_LINK criteria
  actorsLinkMap.forEach((count, strLink) => {
    if(count < MINIMUM_LINK) return;
    const linkObject = JSON.parse(strLink);
    linkObject.count = count;
    links.push(linkObject);
  })

  return links;
}

function collectMoviesIds(movies) {
  let moviesIds = [];
  Object.keys(movies).forEach(index => {
    var id = movies[index].id;
    moviesIds.push(id);
  });

  return moviesIds;
}

function peopleObjectsContainsName(cast, name) {
  let found = false;
  cast.forEach(actorObject => {
    if(actorObject.name === name) {
      found = true;
      return false;
    }
  })

  return found;
}
