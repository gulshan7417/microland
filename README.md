## Medicine Companion for Elderly (Adherence + Safety)

Simple full-stack hackathon prototype focusing on medication adherence and safety for elderly users.

### Stack

- **Frontend**: React + Vite (`frontend/`)
- **Backend**: Node.js + Express (`backend/`)
- **Database**: MongoDB via Mongoose
- **Auth**: JWT, passwords hashed with bcrypt
- **AI**: OpenAI Chat Completions API (falls back to mock when no key)

### Folder Structure

- `backend/`
  - `package.json`
  - `src/`
    - `server.js`
    - `models/`
      - `User.js`
      - `Medicine.js`
    - `controllers/`
      - `authController.js`
      - `medicineController.js`
      - `aiController.js`
    - `routes/`
      - `authRoutes.js`
      - `medicineRoutes.js`
      - `aiRoutes.js`
    - `middleware/`
      - `authMiddleware.js`
      - `errorHandler.js`
- `frontend/`
  - `package.json`
  - `vite.config.mts`
  - `index.html`
  - `src/`
    - `main.jsx`
    - `App.jsx`
    - `components/`
      - `LoginForm.jsx`
      - `RegisterForm.jsx`
      - `MedicineForm.jsx`
      - `MedicineList.jsx`
      - `AIScheduler.jsx`
    - `services/`
      - `api.js`
      - `reminders.js`
- `.env.example`

### Running Locally

1. **Prerequisites**
   - Node.js (LTS)
   - MongoDB running locally or a MongoDB Atlas URI

2. **Configure environment**

   - Copy the example:

     ```bash
     cp .env.example .env
     ```

   - Edit `.env` and set:
     - `MONGO_URI`
     - `JWT_SECRET`
     - `OPENAI_API_KEY` (optional; if missing a mock AI response is used)

3. **Install dependencies**

   ```bash
   cd backend
   npm install

   cd ../frontend
   npm install
   ```

4. **Run backend**

   ```bash
   cd backend
   npm start
   ```

   - Backend runs on `http://localhost:4000`

5. **Run frontend**

   ```bash
   cd frontend
   npm run dev
   ```

   - Frontend runs on `http://localhost:5173`
   - Vite dev server proxies `/api` calls to the backend

### Example AI Prompt

The backend sends a structured prompt similar to this (see `aiController.js`):

```text
User profile:
- Name: Alice
- Age: 78
- Conditions: hypertension, diabetes

Current medicines:
- Blood pressure pill, dosage: 10mg, time: 08:00, duration: 30 days
- Metformin, dosage: 500mg, time: 12:00, duration: 30 days

Task:
- Propose an optimized, easy-to-follow daily schedule for these medicines for an elderly person.
- Avoid obvious conflicts (e.g., too many medicines at the exact same time) and spread doses through the day when safe in general.
- Suggest SIMPLE precautions (e.g., "take with water", "avoid alcohol", "may cause drowsiness").
- ALWAYS include a clear warning that this is not medical advice and must be confirmed with a doctor.

Output JSON with this exact structure:
{
  "optimizedSchedule": [
    { "time": "HH:MM", "medicines": ["name1", "name2"], "notes": "short note" }
  ],
  "precautions": ["short precaution 1", "short precaution 2"],
  "doctorWarning": "short warning"
}
```

### Sample API Requests

Replace `TOKEN` with the JWT from login/register.

- **Register**

  ```bash
  curl -X POST http://localhost:4000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Alice",
      "age": 78,
      "conditions": ["hypertension", "diabetes"],
      "email": "alice@example.com",
      "password": "secret123"
    }'
  ```

- **Login**

  ```bash
  curl -X POST http://localhost:4000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "alice@example.com",
      "password": "secret123"
    }'
  ```

- **Add medicine**

  ```bash
  curl -X POST http://localhost:4000/api/medicines \
    -H "Authorization: Bearer TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "Blood pressure pill",
      "dosage": "10mg",
      "time": "08:00",
      "duration": "30 days"
    }'
  ```

- **Get daily schedule**

  ```bash
  curl -X GET http://localhost:4000/api/medicines/daily \
    -H "Authorization: Bearer TOKEN"
  ```

- **Mark medicine taken**

  ```bash
  curl -X PATCH http://localhost:4000/api/medicines/MEDICINE_ID/status \
    -H "Authorization: Bearer TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"status": "taken"}'
  ```

- **Generate AI schedule**

  ```bash
  curl -X POST http://localhost:4000/api/ai/generate \
    -H "Authorization: Bearer TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"query": "Generate safe schedule and precautions"}'
  ```

- **Apply AI schedule** (after user has manually reviewed/approved)

  ```bash
  curl -X POST http://localhost:4000/api/ai/apply \
    -H "Authorization: Bearer TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "optimizedSchedule": [
        { "time": "08:00", "medicines": ["Blood pressure pill"], "notes": "Take with water" }
      ]
    }'
  ```

### Scalability Notes (High Level)

- **Horizontal scaling**: Backend is stateless and uses JWT for auth, so multiple Node/Express instances can run behind a load balancer (each with its own MongoDB connection to a shared cluster).
- **Caching**: AI responses or frequently-read medicine schedules could be cached in Redis (e.g., keyed by `userId`) in `aiController.js` or a dedicated service layer.
- **Containerization**: Both `backend` and `frontend` can be containerized with Docker (one Dockerfile each) and orchestrated with Docker Compose or Kubernetes. Environment variables in `.env` map cleanly to container env vars.
- **Reminders**: For production, the simple `setTimeout` based frontend reminders can evolve into backend cron jobs plus push notifications or SMS, without changing the core data model.

# microland
