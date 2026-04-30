# Team Task Manager

A complete full-stack MERN application for managing team tasks. Built with role-based access control (Admin and Member). Designed to be simple, fast, and efficient.

## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS + React Router + Axios
- **Backend**: Node.js + Express.js + MongoDB (Mongoose)
- **Authentication**: JWT + bcryptjs

## Prerequisites
- Node.js installed
- MongoDB URI (local or Atlas)

## Local Development Setup

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory.
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the provided format or edit the existing one:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/team-task-manager
   JWT_SECRET=supersecretkey12345
   NODE_ENV=development
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```
   *Note: Ensure your MongoDB is running locally or provide an Atlas connection string in `MONGO_URI`.*

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory.
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the provided localhost URL (usually `http://localhost:5173`) in your browser.

## Deployment on Railway

Deploying a MERN stack monorepo on Railway is straightforward when deployed as **two separate services** within the same project. 

### Step 1: Database Setup
1. Create a free M0 Sandbox cluster on **MongoDB Atlas**.
2. Under **Database Access**, create a database user and save the username and password.
3. Under **Network Access**, allow access from anywhere by adding IP `0.0.0.0/0` (this is required for Railway to connect).
4. Get your connection string and insert your database name (e.g., `team-task-manager`) before the `?` in the URL.

### Step 2: Backend Service Deployment
1. Push this repository to GitHub.
2. In Railway, click **New Project** -> **Deploy from GitHub repo** and select this repository.
3. Once the service card is created, click it and go to the **Settings** tab.
4. Set the **Root Directory** to `/backend`.
5. Under **Networking**, click **Generate Domain**.
6. Go to the **Variables** tab and add the following:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A strong secret key for authentication.
   - `NODE_ENV`: `production`
7. Wait for the backend to build and show a green Success checkmark. Copy the generated domain URL.

### Step 3: Frontend Service Deployment
1. In your Railway project, click **+ New** -> **GitHub Repo** and select the same repository again.
2. Click the new service card and go to the **Settings** tab.
3. Set the **Root Directory** to `/frontend`.
4. Under **Networking**, click **Generate Domain** (Leave the port box empty if prompted).
5. Go to the **Variables** tab and add:
   - `VITE_API_URL`: The public URL of your deployed backend service with `/api` appended (e.g., `https://your-backend-app.up.railway.app/api`).
   - `PORT`: `3000` (Forces the app to match the standard port for the `serve` package).
6. Railway will detect the `start` script, build the Vite app, and serve it statically.

## Features & Roles
- **Signup / Login**: Secure JWT authentication.
- **Admin Role**:
  - Can create new Projects.
  - Can create Tasks and assign them to specific users.
  - Views all tasks and projects in the dashboard.
- **Member Role**:
  - Can only view tasks assigned specifically to them.
  - Can update the status of their assigned tasks (Pending, In Progress, Completed).
- **Dashboard**:
  - Displays total tasks, completed tasks, pending tasks, and overdue tasks (filtered by role).
