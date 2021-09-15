const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

// Create the server
const app = express();

// Connect to data base
connectDB();

// Habilite cors
/* const configCors = {
    origin: process.env.FRONTEND_URL
} */
app.use( cors() );
// Port of the server
const port = process.env.PORT || 4000;

// Allow read value of request body
app.use( express.json() );

// Routes of the app
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/links', require('./routes/links'));
app.use('/api/files', require('./routes/files'));

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`The server is running on the port ${port}`);
});