# DataMoviz API

## Database

We use MongoDB to store the movies related data.  
You need to have a MongoDB instance running:

```
mongod --dbpath "../data/mongo"
```

We use two collections :

- movies
- credits

### Load NeDB database into MongoDB

See the [scripts](https://github.com/quentinus95/datamoviz/tree/master/scripts) readme.

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

