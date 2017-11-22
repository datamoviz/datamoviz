const franc = require('franc');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/datamoviz-api';
const pluralize = require('pluralize');
const sw = require('stopword');
const XRegExp = require('xregexp');

const stopwords = {
  eng: sw.en,
  fra: sw.fr,
  spa: sw.es,
  ita: sw.it,
  deu: sw.de,
  global: ['la', 'le', 'de', 'el', 'der']
};

(async function () {
  const db = await MongoClient.connect(url);
  await db.collection('movies').createIndex({'title': 'text'});
  let cursor = db.collection('movies').find({});

  while(await cursor.hasNext()) {
    let doc = await cursor.next();
    let language = franc(doc.title, {minLength: 3});
    language = ['eng', 'deu', 'spa', 'ita', 'fra'].includes(language) ? language : 'eng';

    let titleKeywords = sw.removeStopwords(doc.title.split(' '), stopwords[language]);
    let cleanedKeywords = titleKeywords.map((keyword) => { return pluralize.singular(keyword.toLowerCase()) });

    cleanedKeywords = cleanedKeywords.filter(function (value) {
      return value !== '' && XRegExp("^\\p{L}+$").test(value) && !stopwords.global.includes(value);
    });

    db.collection('movies').update(
      {
        _id: doc._id
      },
      {
        $set: {'title_keywords': cleanedKeywords}
      }
    );
  }

  console.log('Completed !');
  process.exit(0);
}()).catch(e => {
  console.log(e);
  process.exit(1);
});
