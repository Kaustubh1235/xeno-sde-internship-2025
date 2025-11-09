const Customer = require('../models/customer');

// Helper function to build the MongoDB query from the query object
// Now supports both AND and OR logic, matching the server implementation
const buildMongoQuery = (query) => {
  const { logic, rules } = query;

  const queryConditions = rules.map(rule => {
    const { field, operator, value } = rule;
    let condition = {};

    // Handle numeric fields
    if (field === 'totalSpends' || field === 'visitCount') {
      const numericValue = parseInt(value, 10);
      switch (operator) {
        case '>':
          condition[field] = { $gt: numericValue };
          break;
        case '<':
          condition[field] = { $lt: numericValue };
          break;
        case '=':
          condition[field] = { $eq: numericValue };
          break;
        case '>=':
          condition[field] = { $gte: numericValue };
          break;
        case '<=':
          condition[field] = { $lte: numericValue };
          break;
      }
    }
    // Handle date fields
    else if (field === 'lastVisit') {
      const daysAgo = parseInt(value, 10);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);

      switch (operator) {
        // "Less than X days ago" means the date is MORE RECENT than X days ago
        case '<':
          condition[field] = { $gt: date };
          break;
        // "Greater than X days ago" means the date is OLDER than X days ago
        case '>':
          condition[field] = { $lt: date };
          break;
      }
    }
    return condition;
  });

  if (queryConditions.length === 0) return {};

  // Support both AND and OR logic based on the query.logic field
  return { [logic === 'AND' ? '$and' : '$or']: queryConditions };
};


// @desc    Get the size of an audience based on rules
// @route   POST /api/audience/preview
// @access  Public (for now)
const previewAudience = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || !query.rules || !Array.isArray(query.rules)) {
      return res.status(400).json({ message: 'A valid query object with a rules array is required.' });
    }

    const mongoQuery = buildMongoQuery(query);

    // countDocuments is more efficient than find().length
    const count = await Customer.countDocuments(mongoQuery);

    res.status(200).json({ count });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { previewAudience, buildMongoQuery };