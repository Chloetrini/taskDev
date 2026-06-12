# TaskDev — Personal Task Manager

A full-stack MERN application for managing personal tasks with categories, filtering, and full CRUD functionality. Built as part of the Techstudio Internship Program — Week 1 submission.

---

## Tech Stack

- **Frontend:** React (functional components + hooks), CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Tools:** Vite, Nodemon

---

## Features

- Create, read, update, and delete tasks
- Each task includes a title, description, due date, category, and completion status
- Filter tasks by category (Work, Personal, Urgent) and completion status
- Form validation — all fields required; due date cannot be set in the past
- Responsive layout — works on both desktop and mobile
- REST API following standard HTTP conventions

---

## Project Structure

```
taskdev/
├── task-duty-client/                # React frontend
│   └── src/
│       ├── components/
│       │   ├── Modal.tsx
│       │   ├── NavBar.tsx
│       │   └── TaskCard.tsx
│       ├── context/
│       │   └── AddTaskContext.tsx
│       ├── hooks/
│       ├── pages/
│       │   ├── EditTaskPage.tsx
│       │   ├── LandingPage.tsx
│       │   ├── NewTaskPage.tsx
│       │   └── TasksPage.tsx
│       └── services/
│           └── api.ts
│
└── task-duty-server/                # Express backend
    ├── config/
    ├── controllers/
    │   └── taskController.ts
    ├── models/
    │   └── TaskDev.ts
    ├── routes/
    │   └── taskRoutes.ts
    ├── types/
    │   └── express.d.ts
    └── server.ts
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (v18 or higher)
- npm
- MongoDB (local instance or MongoDB Atlas URI)

---

### 1. Clone the repository

```bash
git clone https://github.com/chloetrini/taskDev.git
cd taskdev
```

---

### 2. Set up the server

```bash
cd tax-duty-server
npm install
```

Create a `.env` file in the `task-duty-server/` folder:

```env
PORT=5200
MONGO_URI=your_mongodb_connection_string
```

Start the server:

```bash
npm run dev
```

The server runs on `http://localhost:5200`

---

### 3. Set up the client

```bash
cd ../task-duty-client
npm install
npm run dev
```

The client runs on `http://localhost:5173`

---

## API Endpoints

| Method | Endpoint         | Description          |
|--------|------------------|----------------------|
| GET    | /tasks           | Get all tasks        |
| POST   | /tasks           | Create a new task    |
| PUT    | /tasks/:id       | Update a task        |
| DELETE | /tasks/:id       | Delete a task        |

---

## Known Issues

> None at the time of submission. This section will be updated if any issues are discovered after submission.

---

Techstudio Internship Program — Online Stage, Week 1
