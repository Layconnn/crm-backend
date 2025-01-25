const express = require('express');
const cors = require('cors');
const connectDB = require('./conifg/db');  // Ensure the correct path for db.js
const taskRoutes = require('./routes/taskRoutes');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const contactRoutes = require('./routes/contactRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const salesOpportunityRoutes = require('./routes/salesOpportunityRoutes');
const userRoutes = require('./routes/userRoutes');
const formatResponseDates = require('./middleware/formatResponseDate');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(express.json()); // Parse JSON bodies

// Connect to MongoDB
connectDB();  // Ensure connectDB handles connection setup correctly

// Routes
// Use the users route

app.use('/api/auth', authRoutes); // Use the authentication routes (no auth middleware here)

app.use(authMiddleware); // Apply the auth middleware globally
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/sales-opportunities', authMiddleware, salesOpportunityRoutes);

// Apply globally
app.use(formatResponseDates);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
