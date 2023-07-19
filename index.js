const express = require('express');
const app = express();

const authRoutes = require('./authRoutes');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');

// Set up view engine (EJS)
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// The session middleware should come before any routes
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 1000 } // 10 minutes
}));

// Routes
app.use(authRoutes);

async function startServer() {
  const uri = 'mongodb+srv://admin:admin@cluster0.434hihe.mongodb.net/?retryWrites=true&w=majority';

  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connected to MongoDB');

      // Start the server
      app.listen(3000, () => {
        console.log('Server is running on port 3000');
      });
    })
    .catch((error) => {
      console.error('Error connecting to MongoDB:', error);
    });
}

startServer();