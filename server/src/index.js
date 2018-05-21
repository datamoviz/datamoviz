const express = require('express');
const MongoClient = require('mongodb');
const cors = require('cors');

const app = express();
const router = express.Router();

app.use(cors());

app.set('mongoClient', MongoClient.connect(process.env.DATABASE_CONNECTION_STRING));

app.use(function(req, res, next) {
  res.setHeader('Cache-Control', 'max-age=86400');
  next();
});

require('./aggregate')(app, router);
require('./count')(app, router);
require('./countries')(app, router);
require('./filtered')(app, router);
require('./list')(app, router);
require('./network')(app, router);

app.use('/api', router);

const port = process.env.PORT || 3030;
app.listen(port, () => console.log(`Server listening on port ${port}`));
