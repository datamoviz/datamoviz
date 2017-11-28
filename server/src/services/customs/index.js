module.exports = function (app) {
  require('./list')(app);
  require('./countries')(app);
  require('./count')(app);
  require('./filtered')(app);
  require('./aggregate')(app);
  require('./network')(app);
};
