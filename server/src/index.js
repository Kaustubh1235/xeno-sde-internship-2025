const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const customerRoutes = require('./routes/customerRoutes'); // Import customer routes

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Use the customer routes
// Any request to /api/customers will be handled by customerRoutes
app.use('/api/customers', customerRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});