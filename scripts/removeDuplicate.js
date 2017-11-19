const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/datamoviz-api';

(async function () {
  const db = await MongoClient.connect(url);

  collectionName = 'movies'

  const duplicated = await db.collection(collectionName).aggregate([{
          $group: {
              _id: {
                  id: "$id",
              },
              uniqueIds: {
                  $addToSet: "$_id"
              },
              count: {
                  $sum: 1
              }
          }
      },
      {
          $match: {
              count: {
                  $gt: 1
              }
          }
      }
  ]).toArray()

  for (let result of duplicated) {
      result.uniqueIds.shift();
      await db.collection(collectionName).remove({
          "_id": {
              "$in": result.uniqueIds
          }
      })
  }

  console.log('Completed !')


}()).catch(e => {
  console.log(e)
})
