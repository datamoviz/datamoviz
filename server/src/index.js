/* eslint-disable no-console */
const feathers = require('feathers');


const logger = require('winston');
const api = require('./app');

const app = feathers();
const port = api.get('port');
app.use('/api/', api);
const server = app.listen(port);
api.setup(server);

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info(`Feathers application started on ${api.get('host')}:${port}`)
);
