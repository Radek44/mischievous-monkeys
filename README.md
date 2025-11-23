# mischievous-monkeys

Exploring microservices in a containerized world - Updated with November 2025 best practices

## Overview

This repository demonstrates modern microservices architecture with two containerized Node.js services:

- **gallant-gazelle**: Backend service providing system information
- **hatless-hippo**: Frontend service that aggregates data from the backend

## Best Practices Implemented (Nov 2025)

### Node.js & Dependencies
- **Node.js 22.x LTS**: Using the latest long-term support version with enhanced performance and security
- **ES Modules**: Modern JavaScript module system (`type: "module"` in package.json)
- **Native fetch API**: Replaced deprecated `request` package with built-in fetch
- **Latest dependencies**: Express 4.21.2, Helmet 8.0.0 for security headers
- **Engine specification**: Explicitly defined Node.js version requirements

### Docker Best Practices
- **Multi-stage builds**: Reduced image size and improved build caching
- **Non-root user**: Running containers as user `nodejs` (UID 1001) for security
- **Alpine Linux**: Using minimal base images (node:22-alpine)
- **dumb-init**: Proper signal handling and zombie process reaping
- **.dockerignore**: Optimized build context, excluding unnecessary files
- **COPY over ADD**: Using COPY for better clarity
- **Health checks**: Built-in Docker HEALTHCHECK directives
- **Explicit environment**: NODE_ENV=production set in containers

### Application Security
- **Helmet middleware**: Security headers (XSS protection, HSTS, etc.)
- **Error handling**: Comprehensive try-catch blocks and error middleware
- **Input validation**: Environment variable validation on startup
- **Timeout controls**: Request timeouts to prevent hanging connections
- **Graceful shutdown**: Proper SIGTERM/SIGINT handling
- **Request logging**: Structured logging with timestamps

### Code Quality
- **Async/await**: Modern asynchronous patterns
- **Error responses**: Proper HTTP status codes and error messages
- **Health endpoints**: `/health` endpoints for monitoring and orchestration
- **Clean code**: Removed deprecated 'use strict' directives (not needed with ES modules)

## Architecture

```
┌─────────────────┐      HTTP      ┌─────────────────┐
│  hatless-hippo  │─────────────────▶│ gallant-gazelle │
│   (Frontend)    │                 │   (Backend)     │
│   Port: 5000    │                 │   Port: 3000    │
└─────────────────┘                 └─────────────────┘
```

## Running the Services

### Prerequisites
- Docker and Docker Compose
- Node.js 22.x (for local development)

### Using Docker

Build and run gallant-gazelle (backend):
```bash
cd gallant-gazelle
docker build -t gallant-gazelle .
docker run -p 3000:3000 gallant-gazelle
```

Build and run hatless-hippo (frontend):
```bash
cd hatless-hippo
docker build -t hatless-hippo .
docker run -p 5000:5000 -e GAZELLE=http://localhost:3000/info hatless-hippo
```

### Local Development

```bash
# Backend
cd gallant-gazelle
npm install
npm start

# Frontend (in another terminal)
cd hatless-hippo
npm install
GAZELLE=http://localhost:3000/info npm start
```

## API Endpoints

### gallant-gazelle (Backend)
- `GET /info` - Returns hostname, timestamp, Node.js version, and uptime
- `GET /health` - Health check endpoint

### hatless-hippo (Frontend)
- `GET /` - Returns aggregated data from frontend and backend
- `GET /health` - Health check endpoint

## Environment Variables

### hatless-hippo
- `PORT` - Server port (default: 5000)
- `GAZELLE` - Backend service URL (required)

### gallant-gazelle
- `PORT` - Server port (default: 3000)

## Security Features

1. **Helmet.js**: Sets various HTTP headers for security
2. **Non-root containers**: Runs as dedicated nodejs user
3. **Timeout protection**: 5-second timeout on backend requests
4. **Error boundaries**: Prevents information leakage in error messages
5. **Minimal attack surface**: Alpine-based images, minimal dependencies

## Monitoring & Health

Both services expose `/health` endpoints that return:
```json
{
  "status": "healthy",
  "service": "service-name"
}
```

Docker health checks automatically monitor these endpoints every 30 seconds.

## License

Apache-2.0
