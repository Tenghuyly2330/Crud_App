# Simple CRUD App

A minimalist monochrome CRUD application with:
- **Backend**: Express + Neon PostgreSQL (`pg`)
- **Frontend**: React + Tailwind CSS
- **Table**: `items` (`title`, `description`)

---

## Running with Docker (Recommended)

Run both the frontend and backend with a single command:

```bash
docker compose up --build
```

- **Frontend**: Accessible at [http://localhost](http://localhost) or [http://localhost:5173](http://localhost:5173)
- **Backend API**: Accessible at [http://localhost:5000](http://localhost:5000)

To stop the containers:
```bash
docker compose down
```

---

## Running Locally (Without Docker)

### 1. Start Backend (Port 5000)
```bash
cd backend
npm start
```

### 2. Start Frontend (Port 5173)
```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 API Endpoints

- `GET /api/items` - List all items
- `POST /api/items` - Create a new item (`{ "title": "...", "description": "..." }`)
- `PUT /api/items/:id` - Update an item (`{ "title": "...", "description": "..." }`)
- `DELETE /api/items/:id` - Delete an item by ID
