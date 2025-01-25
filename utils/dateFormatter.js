// utils/dateFormatter.js
function formatDate(date) {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  }
  
  module.exports = { formatDate };
  