# MedConnect Backend (Node/Express/Mongo)

Backend service for **MedConnect – Medicine Price Transparency Platform**.

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- MVC architecture

## Folder Structure

```text
Backend/
 ├── config/
 │   └── db.js
 ├── models/
 │   ├── Medicine.js
 │   ├── Pharmacy.js
 │   ├── Price.js
 │   └── ExpiryDeal.js
 ├── controllers/
 │   ├── medicineController.js
 │   ├── priceController.js
 │   ├── interactionController.js
 │   └── expiryController.js
 ├── routes/
 │   ├── medicineRoutes.js
 │   ├── priceRoutes.js
 │   ├── interactionRoutes.js
 │   └── expiryRoutes.js
 ├── utils/
 │   └── interactionRules.js
 ├── middleware/
 │   └── errorMiddleware.js
 ├── seed.js
 ├── index.js
 ├── package.json
 └── .env.example
```

## Getting Started

```bash
cd Backend
npm install
cp .env.example .env   # or create .env and set MONGO_URI
npm run seed           # insert sample medicines, pharmacies, prices, expiry deals
npm run dev            # start in dev mode (nodemon)
```

The server runs on `http://localhost:5000` by default.

## Key Endpoints

- `GET /api/medicines?name=` – search medicines by name (partial, case‑insensitive)
- `GET /api/medicines/:id` – get medicine by ID
- `GET /api/medicines/:id/generic` – find generic alternative with same salt
- `GET /api/prices/:medicineId` – prices for a medicine (sorted by lowest price) + savings info
- `POST /api/interactions` – rule‑based drug interaction checker  
  Body: `{ "medicines": ["Ibuprofen", "Warfarin"] }`
- `GET /api/expiry-deals?maxDays=90` – near‑expiry deals, optionally filtered by days remaining, sorted by highest discount

