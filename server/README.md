# Datamoviz api

## Database
We use mongodb to store the movies related data.  
You need to have a mongodb instance running
```
mongod --dbpath "path/to/your/data"
```
We use two collections :
- movies
- credits

### Load the nedb db to mongodb
You can use this tool [nedb-mongodb](https://github.com/b3rew/nedb-mongodb)
```
npm install -g nedb-mongodb
nedb-mongodb  -d datamoviz-api -c movies -n path/to/movies.db -k false
nedb-mongodb  -d datamoviz-api -c credits -n path/to/credits.db -k false
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
You can register your custom endpoint in `./src/services/customs`
