function advancedResults(model, populate) {
  return async function (req, res, next) {
    let query;

    const reqQuery = { ...req.query };

    // Exclude queries
    const removeFields = ['select', 'sort', 'limit', 'page'];
    removeFields.forEach((field) => delete reqQuery[field]);

    // Stringify to patch queries
    let queryStr = JSON.stringify(reqQuery);

    // Patch queries to include "$"
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    // Dynamic query base
    query = model.find(JSON.parse(queryStr));

    // Select queries
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }

    // Sort queries
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort({ createdAt: 'asc', name: -1 });
    }

    // Pagination queries
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = page > 0 ? (page - 1) * limit : 0;
    const endIndex = page * limit;
    const total = await model.countDocuments(queryStr);

    query = query.skip(startIndex).limit(limit);

    // Populate queries
    if (populate) {
      query = query.populate(populate);
    }

    // Execute chained query
    const results = await query;

    // Pagination results
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    // Advanced results into response
    res.advancedResults = {
      success: true,
      count: results.length,
      pagination,
      data: results,
    };

    next();
  };
}

module.exports = advancedResults;
