2. README.md
# FuelEU Maritime Compliance Dashboard

## Overview
This project implements a Fuel EU Maritime compliance dashboard, covering Routes, Compare, Banking, and Pooling tabs.  
The platform computes Compliance Balance (CB), manages banking and pooling of CB among ships, and compares route emissions against a baseline.

## Architecture
- **Frontend:** React + TypeScript + TailwindCSS  
- **Backend:** Node.js + TypeScript + PostgreSQL  
- **Pattern:** Hexagonal architecture (core domain, ports, adapters)  



src/
core/ # Domain logic, use-cases, ports
adapters/
inbound/http/ # Express controllers, routes
outbound/postgres/ # Prisma client & repositories
infrastructure/ # Server & DB setup
shared/ # Common utilities


## Setup & Run Instructions

1. Clone the repo:
```bash
git clone <repo_url>
cd backend


Install dependencies:

npm install


Setup .env file:

DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/fueleu


Run Prisma migrations & seed data:

npx prisma migrate dev --name init
ts-node prisma/seed.ts


Start backend server:

npm run dev


Start frontend:

cd frontend
npm install
npm run dev

How to Execute Tests

Run unit tests (backend):

npm run test


Integration tests use Supertest to verify API endpoints.

Sample Requests / Responses

GET /routes

[
  {
    "routeId": "R001",
    "vesselType": "Container",
    "fuelType": "HFO",
    "year": 2024,
    "ghgIntensity": 91.0
  }
]


POST /banking/bank

{
  "shipId": "cuid123",
  "year": 2025,
  "amount": 50
}


Response

{
  "message": "CB banked successfully",
  "cb_before": 120,
  "applied": 50,
  "cb_after": 70
}
