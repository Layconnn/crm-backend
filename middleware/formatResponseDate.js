// middleware/formatResponseDates.js
const formatDate = require('../utils/dateFormatter');

const formatResponseDates = (req, res, next) => {
  const formatDates = (obj) => {
    for (const key in obj) {
      if (obj[key] instanceof Date) {
        obj[key] = formatDate(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        formatDates(obj[key]);
      }
    }
  };

  const oldJson = res.json;
  res.json = function (data) {
    if (data) formatDates(data);
    oldJson.call(res, data);
  };

  next();
};

module.exports = formatResponseDates;
