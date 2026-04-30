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

Deploying a MERN stack on Railway is straightforward. We can deploy them as two separate services for simplicity and better scaling.

### Option 1: Deploy Backend and Frontend as separate Railway services
1. Push this repository to GitHub.
2. Go to [Railway](https://railway.app/) and create a new project.
3. Select **Deploy from GitHub repo**.

#### Backend Service Setup:
1. Select the repository.
2. In the deployment settings, change the **Root Directory** to `/backend`.
3. Go to the **Variables** tab and add your production variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A strong secret key.
   - `PORT`: Railway will automatically set this, but you can set it to `5000`.
4. Railway will automatically detect Node.js and run `npm start` (make sure you add `"start": "node server.js"` in `backend/package.json`).

#### Frontend Service Setup:
1. Go back to your Railway project dashboard.
2. Click **New** -> **GitHub Repo** and select the same repository again.
3. In the deployment settings, change the **Root Directory** to `/frontend`.
4. Go to the **Variables** tab and add:
   - `VITE_API_URL`: The public URL of your deployed Backend service (e.g., `https://your-backend.up.railway.app/api`).
5. Railway will detect it's a Vite static site and will run `npm run build` and serve the static files.

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
