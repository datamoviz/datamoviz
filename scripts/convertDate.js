const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017/datamoviz-api';

(async function () {
  const db = await MongoClient.connect(url)

  var cursor = db.collection('movies').find({"release_date": {"$exists": true, "$type": 2 }});
  while (await cursor.hasNext()) {
      let doc = await cursor.next();

      let dt;
      if(doc.release_date === '') {
        dt = new Date(2030, 12, 1)
      } else {
        const parts = doc.release_date.split("-");
        dt = new Date(
                    parseInt(parts[0], 10), // year
                    parseInt(parts[1], 10) - 1, // month
                    parseInt(parts[2], 10) // day
                );
      }

      await db.collection('movies').update(
          {"_id": doc._id},
          {"$set": {"release_date": dt}}
      )
      process.stdout.write('.');
  }

  console.log('')
  console.log('Completed !')


}()).catch(e => {
  console.log(e)
})
