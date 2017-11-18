const Promise = require('bluebird')
const Datastore = require('nedb-promises');

// NeDb
const neDb = {}
neDb.movieInfo = new Datastore('../data/movies.db');
neDb.movieCredits = new Datastore('../data/credits.db');

const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/datamoviz-api';

(async function () {
  const mongoDb = await MongoClient.connect(url)
  console.log('Dropping Mongodb database')
  mongoDb.dropDatabase()

  console.log('Loading movies info Nedb')
  await nedbToMongodb(neDb.movieInfo, mongoDb.collection('movies'))

  console.log('Loading movies credits Nedb')
  await nedbToMongodb(neDb.movieCredits, mongoDb.collection('credits'))

  console.log("Completed !")
  process.exit(0)
}()).catch(e => {
  console.log(e)
})

async function nedbToMongodb(nedbCollection, mongodbCollection) {
  let count = 0
  let batchSize = 10000
  do {
    let movieCredits = await nedbCollection.find({}).skip(count).limit(batchSize);
    if(movieCredits.length === 0) break;
    await mongodbCollection.insertMany(movieCredits);
    count += batchSize
    process.stdout.write('.');
  } while(true);
  console.log('')
}
