const Customer = require('../models/Customer');

// This helper function is now updated to accept the 'query' object
const buildMongoQuery = (query) => {
  const { logic, rules } = query;

  const queryConditions = rules.map(rule => {
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
  
  return { [logic === 'AND' ? '$and' : '$or']: queryConditions };
};

// This controller now correctly expects the `query` object
const previewAudience = async (req, res) => {
  try {
    const { query } = req.body; // <-- THE FIX IS HERE
    if (!query || !query.rules || !Array.isArray(query.rules)) {
      return res.status(400).json({ message: 'A valid query object with a rules array is required.' });
    }
    const mongoQuery = buildMongoQuery(query);
    const count = await Customer.countDocuments(mongoQuery);
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { previewAudience, buildMongoQuery };
