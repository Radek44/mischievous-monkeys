import express from 'express';
import helmet from 'helmet';
import os from 'os';

const app = express();
const port = process.env.PORT || 5000;
const backend = process.env.GAZELLE;

// Validate required environment variables
if (!backend) {
  console.error('Error: GAZELLE environment variable not specified');
  process.exit(1);
}

// Security middleware
app.use(helmet());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'hatless-hippo' });
});

// Main endpoint
app.get('/', async (req, res) => {
  console.log('Processing request');

  try {
    const response = await fetch(backend, {
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const json = await response.json();

    res.json({
      frontend: { host: os.hostname(), time: new Date() },
      backend: { host: json.host, time: json.time }
    });
  } catch (error) {
    console.error('Error calling backend:', error.message);
    res.status(503).json({
      error: 'Service unavailable',
      message: 'Failed to communicate with backend service'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const server = app.listen(port, () => {
  console.log(`Frontend app listening on port ${port}`);
  console.log(`Backend configured at: ${backend}`);
  console.log(`Node.js version: ${process.version}`);
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n${signal} received, shutting down gracefully...`);
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });

  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));