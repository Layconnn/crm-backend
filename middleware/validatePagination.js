const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;

  // Validate `page`
  if (page && (!Number.isInteger(Number(page)) || Number(page) <= 0)) {
    return res
      .status(400)
      .json({ message: "'page' must be a positive integer." });
  }

  // Validate `limit`
  if (limit && (!Number.isInteger(Number(limit)) || Number(limit) <= 0)) {
    return res
      .status(400)
      .json({ message: "'limit' must be a positive integer." });
  }

  next();
};

module.exports = validatePagination;
