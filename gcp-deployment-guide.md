# GCP Deployment Guide: India Election Assistant 2026

This guide covers two deployment strategies on Google Cloud Platform (GCP). The application can be deployed as a decoupled set of services (Frontend + Backend APIs) for maximum scalability, or as a single containerized monolith for simplicity and lower baseline costs. 

## Approach 1: Decoupled Multi-Service (Recommended for Scale)

This is the standard architecture for high-traffic public applications where frontend and backend scale independently.

### 1. Frontend (React PWA) -> Google Cloud Storage + Cloud CDN
Since the frontend is a fully static PWA (HTML, CSS, JS, Assets), it does not need a running server.

**Steps:**
1. Build the Vite project: `npm run build -w apps/frontend`
2. Create a Google Cloud Storage bucket (e.g., `gs://election-assistant-pwa`).
3. Set the bucket permissions to allow public read access (`allUsers` -> `Storage Object Viewer`).
4. Upload the built assets:
   ```bash
   gcloud storage cp apps/frontend/dist/* gs://election-assistant-pwa --recursive
   ```
5. Set up **Cloud CDN** and a Load Balancer pointing to this bucket as the backend service. This ensures edge-caching across India, reducing latency significantly for mobile users.

### 2. Backend (Node.js API) -> Google Cloud Run
Cloud Run is a serverless environment that auto-scales containers to zero when idle, and can scale up massively during peak loads (like election day).

**Steps:**
1. Create a `Dockerfile` in `apps/backend`:
   ```dockerfile
   FROM node:20-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --production
   COPY . .
   EXPOSE 5000
   CMD ["npm", "start"]
   ```
2. Build and push the container to Google Artifact Registry:
   ```bash
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/election-api apps/backend
   ```
3. Deploy to Cloud Run:
   ```bash
   gcloud run deploy election-api \
     --image gcr.io/YOUR_PROJECT_ID/election-api \
     --platform managed \
     --region asia-south1 \
     --allow-unauthenticated
   ```
   *(Note: Use `asia-south1` (Mumbai) or `asia-south2` (Delhi) for lowest latency in India).*

---

## Approach 2: Single Service Deployment (Monolith on Cloud Run)

If you prefer to deploy everything together to minimize moving parts and infrastructure overhead, you can serve the React frontend directly from the Node.js Express backend.

**Steps:**
1. Modify `apps/backend/server.js` to serve static files:
   ```javascript
   const express = require('express');
   const path = require('path');
   const app = express();
   
   // API Routes here...
   
   // Serve frontend build
   const frontendPath = path.join(__dirname, '../frontend/dist');
   app.use(express.static(frontendPath));
   
   // Fallback for React Router (SPA)
   app.get('*', (req, res) => {
     res.sendFile(path.join(frontendPath, 'index.html'));
   });
   
   app.listen(5000);
   ```
2. Create a root `Dockerfile` that builds the frontend and runs the backend:
   ```dockerfile
   FROM node:20-alpine AS builder
   WORKDIR /app
   COPY . .
   RUN npm install
   RUN npx turbo run build
   
   FROM node:20-alpine
   WORKDIR /app
   # Copy backend and frontend build
   COPY --from=builder /app/apps/backend ./backend
   COPY --from=builder /app/apps/frontend/dist ./frontend/dist
   WORKDIR /app/backend
   RUN npm install --production
   EXPOSE 5000
   CMD ["npm", "start"]
   ```
3. Deploy the single container to Cloud Run using the exact same `gcloud run deploy` command as above.

## Summary & Recommendation
*   **Use Approach 1 (Decoupled)** if you expect millions of hits on Election Day. Cloud CDN serving static assets will save massive server costs and reduce strain.
*   **Use Approach 2 (Monolith)** during Phase 1 & 2 for rapid iteration, testing, and initial UAT where traffic is low.
