// ... (previous code)
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes'); // Import order routes

// ... (dotenv, connectDB, app setup)

// ... (root route)

app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes); // Use the order routes


// ... (app.listen)
