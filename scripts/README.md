# Datamoviz utils scripts

## Install dependencies
```
npm install
```

## importDb.js
Import your neDb files to mongoDb
```
node --max-old-space-size=4096 importDb.js
```


## convertDate.js
Convert the `release_date` attribute to date for `movies` collection.
```
node convertDate.js
```
