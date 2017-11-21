# Datamoviz utils scripts

## Install dependencies

```sh
npm install
```

## importDb.js

Be sure to pull submodules before running this command.

```sh
git submodule init
git submodule update
```

Import your neDb files to mongoDb
```sh
npm run import
```


## convertDate.js
Convert the `release_date` attribute to date for `movies` collection.
```sh
node convertDate.js
```

## removeDuplicate.js
Remove all duplicated entry for `movies` and `credits` collection.
```sh
node removeDuplicate.js
```
