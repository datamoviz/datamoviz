# DataMoviz 🎥

Deep into the movie scene:
- Website: https://datamoviz.dldl.io
- Process Book: https://github.com/datamoviz/datamoviz/raw/master/report/process-book.pdf
- Screencast: TBD
- Data: https://github.com/datamoviz/datamoviz-data

<a href="https://datamoviz.dldl.io">
    <img src="https://github.com/datamoviz/datamoviz/raw/master/docs/mockup.png" alt="" />
</a>

Image generated with [MockUpPhone](https://mockuphone.com/).

## Installation

First, [import the data](https://github.com/datamoviz/datamoviz-data).

Then:

```bash
cd client/
npm install
cd ../server
npm install
```

You also need a populated MongoDB database, see the [server](https://github.com/quentinus95/datamoviz/tree/master/server) readme.

## Running

First, [start the server](https://github.com/datamoviz/datamoviz/tree/master/server).

Then:

```bash
cd client/
npm start
```

Access to the server at the following url: http://127.0.0.1:8080.

## Deploying

Compile the client:

```bash
cd client/
npm run deploy
```

You can export the `build` folder to your server.

## Licence

MIT
