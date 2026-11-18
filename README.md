# Simple CRUD App

A minimalist monochrome CRUD application with:
- **Backend**: Express + Neon PostgreSQL (`pg`)
- **Frontend**: React + Tailwind CSS
- **Table**: `items` (`title`, `description`)

---

## 🐳 Docker Hub Images

Images are automatically built and published via GitHub Actions to Docker Hub:
- `docker pull <username>/crud-backend:latest`
- `docker pull <username>/crud-frontend:latest`

---

## 🚀 Running Locally with Docker Compose

Run both frontend and backend with a single command:

```bash
docker compose up --build
```

- **Frontend**: Accessible at [http://localhost](http://localhost) or [http://localhost:5173](http://localhost:5173)
- **Backend API**: Accessible at [http://localhost:6000](http://localhost:6000)

To stop the containers:
```bash
docker compose down
```

---

## 💻 Running Without Docker

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

---

## 📡 API Endpoints

- `GET /api/items` - List all items
- `POST /api/items` - Create a new item (`{ "title": "...", "description": "..." }`)
- `PUT /api/items/:id` - Update an item (`{ "title": "...", "description": "..." }`)
- `DELETE /api/items/:id` - Delete an item by ID
