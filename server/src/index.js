// ===================================
// 1. IMPORTS
// ===================================
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios'); // <-- MAKE SURE THIS IS IMPORTED
const connectDB = require('./config/db');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const audienceRoutes = require('./routes/audienceRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
require('./config/passport-setup');

// ===================================
// 2. INITIAL CONFIGURATION
// ===================================
dotenv.config();
connectDB();

// ===================================
// 3. INITIALIZE EXPRESS APP
// ===================================
const app = express();
const PORT = process.env.PORT || 8000;

// ===================================
// 4. MIDDLEWARE
// ===================================
app.use(cors());
app.use(express.json());
app.use(session({
    secret: process.env.COOKIE_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));
app.use(passport.initialize());
app.use(passport.session());

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
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const aiRoutes = require('./routes/aiRoutes');

// ... (in the routes section, after campaigns)
app.use('/api/ai', aiRoutes);

// ===================================
// 6. DUMMY VENDOR API
// ===================================
app.post('/vendor/send', (req, res) => {
    const { logId, message } = req.body;
    console.log(`[Vendor] Received message for log ${logId}: "${message}"`);

    // Simulate a 90% success rate
    const isSent = Math.random() < 0.9;
    const status = isSent ? 'SENT' : 'FAILED';

    console.log(`[Vendor] Simulating delivery status: ${status}`);

    // Simulate the vendor calling our delivery receipt API back after a short delay
    setTimeout(() => {
        // NOTE: The port here must match your running server's port (e.g., 8000)
        axios.post(`http://localhost:${PORT}/api/campaigns/delivery-receipt`, { logId, status })
          .catch(err => console.error("[Vendor] Error calling receipt API:", err.message));
    }, Math.random() * 2000 + 500); // Random delay between 0.5 and 2.5 seconds

    res.status(200).json({ message: "Vendor accepted the message." });
});

// ===================================
// 7. START SERVER
// ===================================
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});