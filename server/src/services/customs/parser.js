module.exports = function (filtersUri) {
  let filters;

  if (filtersUri === undefined) {
    filters = {}
  } else {
    filters = JSON.parse(decodeURI(filtersUri));
  }

  if (Object.keys(filters).includes('release_date')) {
    filters['release_date'].$gte = new Date(filters['release_date'].$gte);
    filters['release_date'].$lte = new Date(filters['release_date'].$lte);
  }

  return filters;
};
