# System Design Document: India Election Assistant 2026

## 1. Architectural Overview
The system will follow a modern, decoupled client-server architecture. The frontend will be a Progressive Web Application (PWA) to ensure offline availability and low-bandwidth usage. The backend will consist of lightweight microservices deployed on Google Cloud Platform (GCP) acting as an API gateway to public election data.

## 2. Technology Stack (Open Source)
*   **Frontend:** React.js (via Vite for fast, lightweight builds).
*   **PWA Framework:** Workbox (for service workers, offline caching, and background sync).
*   **Styling:** Vanilla CSS with custom design tokens (no heavy CSS frameworks) to keep payload sizes minimal.
*   **State Management:** React Context API or Zustand (lightweight).
*   **Backend / API Gateway:** Node.js with Express (to proxy requests and cache public API responses).
*   **Database / Cache:** Redis (for caching public API queries to reduce latency and API calls).
*   **Infrastructure & Deployment (GCP):**
    *   **Frontend Hosting:** Google Cloud Storage + Cloud CDN (or Cloud Run for SSR).
    *   **Backend Hosting:** Google Cloud Run (serverless, scales down to zero, handles traffic spikes well).
    *   **Translation / Vernacular:** GCP Translation API (cached locally) combined with local dictionaries.

## 3. UI/UX Design Guidelines (Relatable & Accessible)
*   **Audio-Visual First Interface:**
    *   Minimal text. Heavy reliance on universally understood icons (e.g., a hand pressing an EVM button, a calendar for timelines, an ID card for documents).
    *   A prominent "Read to Me" / Audio toggle on every screen.
*   **Vernacular Interface:**
    *   Onboarding screen entirely dedicated to language selection using regional scripts (e.g., हिंदी, বাংলা, తెలుగు) alongside audio cues.
*   **Color Palette:**
    *   High-contrast colors to ensure visibility outdoors in bright sunlight.
    *   Familiar, culturally resonant colors (saffron, green, white, earthy tones) but neutral enough to avoid political bias.
*   **Component Design:**
    *   Large, easily tappable buttons.
    *   Card-based layouts for timelines and steps.
    *   "Swipe" or "Next" interactions instead of complex scrolling.

## 4. System Components
### 4.1 Frontend PWA
*   **Service Worker:** Intercepts network requests. Caches the app shell, static assets (icons, audio snippets), and previously fetched timeline data for offline viewing.
*   **Walkthrough Engine:** A JSON-driven component that renders the step-by-step guides (e.g., "How to check your name in the voter list").
*   **Localization Manager:** dynamically loads language packs (JSON files) to minimize the initial load size.

### 4.2 Backend API Gateway (GCP Cloud Run)
*   **Data Aggregator:** Fetches, normalizes, and caches data from external public sources (e.g., ECI portals, public data endpoints).
*   **Endpoints:**
    *   `/api/timeline?state={state_code}`
    *   `/api/polling-booth?pin={pincode}`
    *   `/api/requirements`

## 5. Data Flow & Network Strategy
1.  **Initial Load:** User downloads the PWA shell (HTML/CSS/JS) via Cloud CDN. Total size < 1MB.
2.  **Asset Caching:** Local vernacular language pack and core audio instructions are cached in the browser's Cache Storage.
3.  **Data Fetching:** When the user queries their timeline, the app makes an API call to the Node.js backend.
4.  **Resilience:** If the network fails, the UI falls back to the locally cached generic national timeline and displays a "Low Network - Offline Mode" indicator, still allowing the user to view the static EVM guides and documentation requirements.

## 6. Public APIs & Data Sources
*   **Election Commission of India (ECI):** Publicly available datasets for voter list search and polling booth locations (subject to available endpoints/web scraping rules).
*   **Google Maps/Places API:** (Optional, if budget allows) for routing to polling stations, otherwise OpenStreetMap.
*   **National Voters' Services Portal (NVSP):** Public links and forms integration.
