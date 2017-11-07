# DataMoviz API

## Database

We use MongoDB to store the movies related data.  
You need to have a MongoDB instance running:

```
mongod --dbpath "./data"
```

We use two collections :

- movies
- credits

### Load the NeDB db to MongoDB

You can use this tool [nedb-mongodb](https://github.com/b3rew/nedb-mongodb)

```
npm install -g nedb-mongodb
nedb-mongodb -d datamoviz-api -c movies -n path/to/movies.db -k false
nedb-mongodb -d datamoviz-api -c credits -n path/to/credits.db -k false
```

## Installation

```
npm install
```

## Usage

```
npm start
```

## Custom endpoint

You can register your custom endpoint in `./src/services/customs`.
