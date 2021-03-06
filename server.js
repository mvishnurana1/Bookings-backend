const express = require('express');
const app = express();
const connectDB = require('./config/db');

connectDB();

// Init middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));
