// ===================================
// 1. IMPORTS
// ===================================
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const audienceRoutes = require('./routes/audienceRoutes');
const campaignRoutes = require('./routes/campaignRoutes');

// ===================================
// 2. INITIAL CONFIGURATION
// ===================================
dotenv.config();
connectDB();

// ===================================
// 3. INITIALIZE EXPRESS APP  <-- VERY IMPORTANT
// ===================================
const app = express();
const PORT = process.env.PORT || 3001;

// ===================================
// 4. MIDDLEWARE
// ===================================
app.use(cors());
app.use(express.json());

// ===================================
// 5. ROUTES
// ===================================
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/audience', audienceRoutes);
app.use('/api/campaigns', campaignRoutes);

// ===================================
// 6. START SERVER
// ===================================
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});