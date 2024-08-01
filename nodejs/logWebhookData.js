const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const fs = require('fs');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
app.use(bodyParser.json());

const API_KEY = process.env.DOWNLINK_API_KEY; // Use your downlink API key if needed

// Middleware to authenticate using the API key
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-downlink-apikey'];
  if (apiKey && apiKey === API_KEY) {
    next();
  } else {
    res.status(403).json({ status: 'error', message: 'Forbidden: Invalid API Key' });
          console.log(JSON.stringify(req.headers));
  }
};

// Endpoint to receive and log webhook data
app.post('/ttn-webhook', authenticate, (req, res) => {
  const data = req.body;

  // Log the entire request body to the console
  console.log('Received Webhook Data:', JSON.stringify(data, null, 2));

  // Respond to TTN to acknowledge receipt
  res.status(200).json({ status: 'success' });
});

// SSL/TLS configuration
const options = {
  key: fs.readFileSync('/usr/local/hestia/data/users/admin/ssl/kierenblack.nz.key'), // Path to your private key
  cert: fs.readFileSync('/usr/local/hestia/data/users/admin/ssl/kierenblack.nz.pem'), // Path to your full chain certificate
  ca: fs.readFileSync('/usr/local/hestia/data/users/admin/ssl/kierenblack.nz.ca') // Path to your CA certificate

};

const PORT = process.env.PORT || 5000;
// Create HTTPS server
https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS Server running on port ${PORT}`);
});
