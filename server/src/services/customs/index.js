module.exports = function (app) {
  require('./genres')(app);
  require('./countries')(app);
};
