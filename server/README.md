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
