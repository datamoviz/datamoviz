module.exports = function (app) {

  app.use('/network', {
    async find() {
      const db = await app.get('mongoClient');
      const movies = await db.collection('movies').find().limit(100).toArray();

      const moviesIds = collectMoviesIds(movies);

      const credits = await db.collection('credits').find({ id: { $in:moviesIds } }, { cast: 1, id: 1 }).toArray();

      const actors = await db.collection('credits').distinct('cast.name', { id: { $in:moviesIds } });

      const network = getActorsNetworkLink(credits, actors);

      return {actors, network}
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

        // Keep only (actorname1, actorname2) and throw (actorname2, actorname1)
        if(actor.localeCompare(actorObject2.name) > 0) {
          return;
        }

        const linkObject = {
          actor1: actor,
          actor2: actorObject2.name
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

function getActorsNetworkLink(credits, actors) {
  const actorsLinkMap = getActorsLinkMap(credits, actors);

  const links = [];

  actorsLinkMap.forEach((count, strLink) => {
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
