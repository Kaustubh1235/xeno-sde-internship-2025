// ... (keep the Customer require statement)

const buildMongoQuery = (query) => {
  const { logic, rules } = query;

  const queryConditions = rules.map(rule => {
    // ... (keep the entire switch-case logic from Step 6 here)
    const { field, operator, value } = rule;
    let condition = {};
    if (field === 'totalSpends' || field === 'visitCount') {
      const numericValue = parseInt(value, 10);
      switch (operator) {
        case '>': condition[field] = { $gt: numericValue }; break;
        case '<': condition[field] = { $lt: numericValue }; break;
        case '=': condition[field] = { $eq: numericValue }; break;
        case '>=': condition[field] = { $gte: numericValue }; break;
        case '<=': condition[field] = { $lte: numericValue }; break;
      }
    } else if (field === 'lastVisit') {
      const daysAgo = parseInt(value, 10);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      switch (operator) {
        case '<': condition[field] = { $gt: date }; break;
        case '>': condition[field] = { $lt: date }; break;
      }
    }
    return condition;
  });

  if (queryConditions.length === 0) return {};

  // Use the logic property to decide between $and and $or
  return { [logic === 'AND' ? '$and' : '$or']: queryConditions };
};

const previewAudience = async (req, res) => {
  try {
    // Now expect the query object instead of just rules
    const { query } = req.body;
    if (!query || !query.rules || !Array.isArray(query.rules)) {
      return res.status(400).json({ message: 'Query object with rules array is required.' });
    }

    const mongoQuery = buildMongoQuery(query);
    const count = await Customer.countDocuments(mongoQuery);
    res.status(200).json({ count });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { previewAudience, buildMongoQuery }; // Export the buildMongoQuery function