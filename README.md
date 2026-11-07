**NOTE: THIS IS A PRACTICE PROJECT, NOTHING HERE IS MEANT TO GIVE ANY REAL ADVICE**

**Prerequisites**
Python 3.12+
Node.js 20+
Git

**Installation**
Clone the repository:
git clone <your-repo-url>
cd clearday-clt

**Backend Setup**
cd backend

uv venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

uv sync

uv run uvicorn main:app --reload


Backend will be available at:
http://127.0.0.1:8000

**Frontend Setup**
(OPEN A SECOND TERMINAL)
cd frontend

npm install

npm run dev

FRONTEND WILL BE AVAILABLE AT: 
http://localhost:5173


**Demo**

Run both backend and frontend simultaneously:
Backend:  http://127.0.0.1:8000
Frontend: http://localhost:5173

**Then open:**

http://localhost:5173
