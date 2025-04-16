const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const budgetRoutes = require('./routes/budgetRoutes');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const householdRoutes = require('./routes/householdRoutes');
const goalRoutes = require('./routes/goalRoutes');

dotenv.config();

const app = express(); // ✅ moved up

// Middleware
app.use(cors());
app.use(express.json({limit: '50mb'})); // ✅ added limit
app.use(fileUpload());
app.use('/api/goals', goalRoutes); // already done if you're this far


// 5. Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// 6. Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/household', householdRoutes); // ✅ ADD THIS LINE
app.use('/api/budget', budgetRoutes);
app.use('/api/goals', goalRoutes);



// 7. Example route
app.get('/', (req, res) => {
    res.send('Finance Tracker API is running');
});

// 8. Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
