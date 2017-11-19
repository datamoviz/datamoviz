const MINIMUM_LINK = 1;

module.exports = function (app) {
  app.use('/network', {
    async find() {
      const db = await app.get('mongoClient');
      const movies = await db.collection('movies').find().limit(1000).toArray();

      const moviesIds = collectMoviesIds(movies);

      const credits = await db.collection('credits').find({ id: { $in:moviesIds } }, { cast: 1, id: 1 }).toArray();

      // let actors = await db.collection('credits').distinct('cast.name', { id: { $in:moviesIds }});
      let actors = await db.collection('credits').aggregate([
        { "$match": { "id": {"$in":moviesIds} } },
        { "$unwind": "$cast" },
         { "$match": { "cast.order": {"$lt":2} } }, // Get only main actors
         { "$project": {"cast.name":1} },
         { "$group": { "_id": "$cast.name" }}
       ]).map(x => x._id).toArray()

      const links = getActorsNetworkLink(credits, actors);

      actors = getActorNodeObject(actors, links, credits);

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
  actors = removeActorsLowLinks(actors, links);

  return actors.map(actor => {
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
}

function removeActorsLowLinks(actors, links) {
  let actorsIndexToRemove = [];

  for (let i = 0; i < actors.length; i++) {
    let actor = actors[i];
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
