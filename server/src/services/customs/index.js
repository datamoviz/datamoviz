module.exports = function (app) {
  require('./genres')(app);
  require('./countries')(app);
  require('./count')(app);
  require('./filtered')(app);
  require('./aggregate')(app);
  require('./network')(app);
};
