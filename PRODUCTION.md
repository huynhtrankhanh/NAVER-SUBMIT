# UniFlow Production Deployment

This document explains how to run UniFlow in production mode with a single server serving both the frontend and backend.

## Quick Start

### Option 1: Use the production script (Recommended)
```bash
./production.sh
```

### Option 2: Use npm scripts
```bash
# Build everything and start production server
npm run build-and-start

# Or build and start separately
npm run build
npm start
```

### Option 3: Manual setup
```bash
# Build client
cd client && npm install && npm run build

# Build and start server
cd ../server && npm install && npm run build && NODE_ENV=production npm start
```

## Production Features

- **Single Port**: Both frontend and backend run on the same port (default: 5001)
- **Static File Serving**: Built React app is served directly from the server
- **API Endpoints**: All API routes are prefixed with `/api/` to avoid conflicts
- **SPA Routing**: React Router works correctly with server-side fallback
- **Environment Variables**: Configurable port via `PORT` environment variable

## API Endpoints

- `GET /api/health` - Server health check and active jobs count
- `POST /api/schedule` - Schedule notifications for tasks
- `POST /api/cancel` - Cancel scheduled notifications

## Environment Variables

- `PORT` - Server port (default: 5001)
- `NODE_ENV` - Set to `production` for production mode

## Examples

### Custom port
```bash
PORT=3000 ./production.sh
```

### Production with custom settings
```bash
export PORT=8080
export NODE_ENV=production
npm start
```

## Architecture

```
┌─────────────────────┐
│   Production Server │
│     (Port 5001)     │
├─────────────────────┤
│  Express.js Server  │
│  ├─ Static Files    │ ← Serves React build files
│  ├─ API Routes      │ ← /api/schedule, /api/cancel, /api/health  
│  └─ SPA Fallback    │ ← /* → index.html for React Router
└─────────────────────┘
```

The client is configured to use relative API paths in production, so all requests go to the same server.