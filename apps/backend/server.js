const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('redis');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Redis Client (optional fallback)
let redisClient;
(async () => {
  try {
    redisClient = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });
    redisClient.on('error', (err) => console.log('Redis Client Error (will proceed without cache)', err));
    await redisClient.connect();
    console.log('Redis connected successfully.');
  } catch (err) {
    console.log('Proceeding without Redis cache.');
    redisClient = null; // graceful fallback
  }
})();

// Caching Middleware
const checkCache = (keyPrefix) => async (req, res, next) => {
  if (!redisClient) return next();
  try {
    const key = `${keyPrefix}:${req.query.state || 'national'}`;
    const data = await redisClient.get(key);
    if (data) {
      console.log(`Cache hit for ${key}`);
      return res.status(200).json(JSON.parse(data));
    }
    next();
  } catch (err) {
    next();
  }
};

// Endpoints
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 1. Timeline Endpoint
app.get('/api/timeline', checkCache('timeline'), async (req, res) => {
  const { state } = req.query;
  
  // MOCK: In production, this would make an axios call to ECI public data
  // const response = await axios.get(`https://api.eci.gov.in/timeline?state=${state}`);
  
  const mockData = {
    state: state || 'national',
    phases: [
      { phase: 1, date: '2026-04-10', status: 'upcoming' },
      { phase: 2, date: '2026-04-18', status: 'upcoming' },
      { results: '2026-05-15' }
    ],
    source: 'Election Commission of India Data API'
  };

  if (redisClient) {
    await redisClient.setEx(`timeline:${state || 'national'}`, 3600, JSON.stringify(mockData)); // Cache for 1 hour
  }

  res.status(200).json(mockData);
});

// 2. Polling Booth Data (Location based)
app.get('/api/polling-booth', checkCache('booth'), async (req, res) => {
  const { pincode } = req.query;
  
  if (!pincode) return res.status(400).json({ error: 'Pincode is required' });

  const mockData = {
    pincode,
    booths: [
      { name: 'Govt Primary School, Block A', address: 'Main Road', distance: '1.2 km' },
      { name: 'Community Center', address: 'Sector 4', distance: '2.5 km' }
    ]
  };

  if (redisClient) {
    await redisClient.setEx(`booth:${pincode}`, 86400, JSON.stringify(mockData)); // Cache for 24h
  }

  res.status(200).json(mockData);
});

app.listen(PORT, () => {
  console.log(`API Gateway server running on port ${PORT}`);
});
