# FoodShare AI – Surplus Food Redistribution Platform

FoodShare AI is a modern SaaS platform designed to reduce food waste by connecting Restaurants, Hotels, Bakeries, Catering Services, individuals, NGOs, Food Banks, and Volunteers. It is powered by AI services for food freshness classification, OCR expiration date checking, matching scoring algorithms, and routing optimization.

---

## Technical Stack

- **Frontend**: Next.js 15 (React, TypeScript), Tailwind CSS v4, Lucide Icons, Framer Motion
- **Backend**: Express.js (Node.js, TypeScript), Socket.io, Mongoose (MongoDB), Helmet, JWT Auth
- **AI Service**: FastAPI, Uvicorn, Pillow, OpenCV-Python, Scikit-learn
- **DevOps**: Docker, Docker Compose, GitHub Actions CI

---

## Monorepo Workspace Structure

```
foodshare-ai/
├── apps/
│   ├── web/                    # Next.js Frontend
│   ├── api/                    # Express Backend API
│   └── ai/                     # FastAPI AI Service
├── docker/                     # App-specific Dockerfiles
├── scripts/                    # End-to-End API Integration test
├── docker-compose.yml          # Local MongoDB, Redis, API, Web, AI orchestration
└── package.json                # npm workspaces manager
```

---

## Local Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [MongoDB](https://www.mongodb.com/) (running locally, or run via Docker Compose)
- [Python 3.10+](https://www.python.org/) (for AI Service execution)

---

### Step 1: Install Dependencies

From the workspace root, run:
```bash
npm install
```
This automatically resolves dependencies for the root, `apps/web`, and `apps/api`.

For the AI service:
```bash
cd apps/ai
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cd ../..
```

---

### Step 2: Start Services

#### Option A: Running Locally (Separate Terminals)

1. **MongoDB**: Ensure a local MongoDB instance is listening on `mongodb://localhost:27017/foodshare`.
2. **AI Service**:
   ```bash
   cd apps/ai
   source venv/bin/activate
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```
3. **Backend API**:
   ```bash
   npm run dev:api
   ```
4. **Next.js Frontend**:
   ```bash
   npm run dev:web
   ```

#### Option B: Running with Docker Compose

Build and launch the complete stack (MongoDB, Redis, API, AI, Next.js Web App):
```bash
docker-compose up --build
```

---

## Running the E2E API Integration Verification

We have created an automated end-to-end integration test runner simulating the entire user lifecycle flow (registering accounts, submitting food posts, AI freshness scoring, NGO claims, volunteer pickup assignments, location updates, and OTP checks).

1. Ensure the **Express Backend** is running (`npm run dev:api`).
2. Run the test script:
   ```bash
   node scripts/test-api.js
   ```

---

## Key Features Implemented

1. **AI Freshness Scan**: Evaluates uploaded food packing base64 images, calculating quality indexes and shelf-life recommendations.
2. **Logistics OTP/QR Verification**: Volunteers enter verification codes or scan QR hashes to mark deliveries completed.
3. **Distance & Capacity Matching**: Matches surplus donations to nearby NGOs based on distance and food type rules.
4. **Fraud Detection Flags**: Identifies spoofing behaviors and unauthorized path deviations.
5. **Impact Slider**: Real-time Carbon footprint and Water savings calculator on the Landing Page.
