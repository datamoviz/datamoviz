const MINIMUM_LINK = 1;
const MINIMUM_MOVIE_COUNT = 2;
const MAIN_ACTORS_COUNT = 5;

module.exports = function (app) {
  app.use('/network', {
    async find() {
      const db = await app.get('mongoClient');
      const moviesIds = await db.collection('movies').find({}, {id:1, _id:0}).limit(1000).map(x => x.id).toArray();

      const credits = await db.collection('credits').find({ id: { $in:moviesIds } }, { cast: 1, id: 1 }).toArray();

      // let actors = await db.collection('credits').distinct('cast.name', { id: { $in:moviesIds }});
      let actors = await db.collection('credits').aggregate([
        { "$match": { "id": {"$in":moviesIds} } },
        { "$unwind": "$cast" },
         { "$match": { "cast.order": {"$lt":MAIN_ACTORS_COUNT} } }, // Get only main actors
         { "$project": {"cast.name":1} },
         { "$group": { "_id": "$cast.name" }}
       ]).map(x => x._id).toArray()

      let links = getActorsNetworkLink(credits, actors);

      actors = getActorNodeObject(actors, links, credits);

      let actorsLinks = removeActorsMinMovieCount(actors, links)
      actors = actorsLinks.actors
      links = actorsLinks.links

      return {actors, links}
    }
  });
};

function getActorsLinkMap(credits, actors) {
  const actorsLink = new Map();
  actors.forEach(actor => {
    credits.forEach(movieCast => {

      if(!castContainActor(movieCast.cast, actor)) {
        return;
      }

      movieCast.cast.forEach(actorObject2 => {
        if(actor === actorObject2.name) {
          return;
        }

        if(!actors.includes(actorObject2.name)) {
          return;
        }

        // Keep only (actorname1, actorname2) and throw (actorname2, actorname1)
        if(actor.localeCompare(actorObject2.name) > 0) {
          return;
        }

        const linkObject = {
          source: actor,
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
      creditObject.cast.forEach(actorObject => {
        if(actorObject.name === actor) {
          movieCount++;
        }
      })
    })
    return {name: actor, group:1, movieCount}
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

function castContainActor(cast, actor) {
  let found = false;
  cast.forEach(actorObject => {
    if(actorObject.name === actor) {
      found = true;
      return false;
    }
  })

  return found;
}
