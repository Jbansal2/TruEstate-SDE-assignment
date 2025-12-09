require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const connectDB = require('./utils/db');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: "https://truestate1.vercel.app",
  methods: "GET,POST,PUT,DELETE,PATCH",
  credentials: true
}));

app.use(morgan('dev'));
app.use(express.json());

app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

app.use('/api', routes);

app.get('/', (req, res) => res.send('TruEstate backend running'));

// Global error handler
app.use((err, req, res, next) => {
  console.error('[ERROR] ', err && err.message);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

// Start server
(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();
