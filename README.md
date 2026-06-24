# TaskDev — Personal Task Manager

A full-stack MERN application for managing personal tasks with authentication, email verification, soft delete with a trash/restore workflow, and full CRUD functionality. Built as part of the Techstudio Internship Program — Week 3 submission.

---

## Tech Stack

- **Frontend:** React (functional components + hooks), TypeScript, Tailwind CSS, Vite
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB with Mongoose
- **Auth:** JWT stored in httpOnly cookies
- **Email:** Brevo (transactional email API)
- **Tools:** ts-node-dev

---

## Features

### Authentication
- User registration with email verification via Brevo
- Login with JWT stored in httpOnly cookie — secure and XSS-resistant
- Logout clears the cookie server-side
- Forgot password and reset password via email link
- Protected routes — unauthenticated users are redirected to login
- Auth modal — clicking protected nav links while logged out shows a sign up/login popup

### Tasks
- Create, read, update, and delete tasks
- Each task includes a title, description, due date, tag (Urgent/Important), and completion status
- Tasks are user-scoped — each user only sees their own tasks
- Filter tasks by tag and completion status
- Form validation — all fields required; due date cannot be in the past
- Responsive layout — works on desktop and mobile

### Soft Delete & Trash (Week 3)
- Deleting a task no longer removes it from the database — it's flagged as deleted and moved to a dedicated trash page
- Trash page lists every deleted task with its details and the date it was trashed
- Restore brings a trashed task back to the active task list
- The main task list only shows active tasks; trashed tasks are filtered out
- Implemented using an `isDeleted` flag and a `deletedAt` timestamp on the task model, so no data is ever lost on delete

### Extra Feature
- Password reset via email using Brevo with secure hashed reset tokens that expire after 1 hour
- Profile update for name

---

## Project Structure

```
taskDev-master/
├── TaskDev Client/                 # React frontend
│   └── src/
│       ├── Components/
│       │   ├── AuthModal.tsx
│       │   ├── Modal.tsx
│       │   ├── NavBar.tsx
│       │   ├── ProtectedRoute.tsx
│       │   └── TaskCard.tsx
│       ├── Context/
│       │   ├── AddTaskContext.tsx
│       │   └── AuthContext.tsx
│       ├── Pages/
│       │   ├── CheckEmailPage.tsx
│       │   ├── EditTaskPage.tsx
│       │   ├── EmailVerifiedPage.tsx
│       │   ├── ForgotPasswordPage.tsx
│       │   ├── LandingPage.tsx
│       │   ├── LoginPage.tsx
│       │   ├── NewTaskPage.tsx
│       │   ├── NotFoundPage.tsx
│       │   ├── PasswordSuccessPage.tsx
│       │   ├── RegisterPage.tsx
│       │   ├── ResetPasswordPage.tsx
│       │   ├── TasksPage.tsx
│       │   └── TrashPage.tsx
│       └── Services/
│           └── api.ts
│
└── TaskDev Server/                 # Express backend
    └── src/
        ├── config/
        │   ├── db.ts
        │   └── email.ts
        ├── controllers/
        │   ├── authController.ts
        │   └── taskController.ts
        ├── middlewares/
        │   └── authMiddleware.ts
        ├── models/
        │   ├── User.ts
        │   └── TaskDuty.ts
        ├── routes/
        │   ├── authRoutes.ts
        │   └── taskRoutes.ts
        ├── utils/
        │   ├── emailTemplate.ts
        │   └── generateToken.ts
        └── server.ts
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- MongoDB Atlas account
- Brevo account (for transactional emails)

---

### 1. Clone the repository

```bash
git clone https://github.com/chloetrini/taskDev.git
cd taskDev-master
```

---

### 2. Set up the server

```bash
cd "TaskDev Server"
npm install
```

Create a `.env` file in the `TaskDev Server/` folder:

```env
PORT=5200
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM=TaskDev <your_sender_email>
EMAIL_VERIFY_TOKEN_EXPIRE=86400000
RESET_TOKEN_EXPIRE=3600000
```

Build and start the server:

```bash
npm run build
npm start
```

Or for development with hot reload:

```bash
npm run dev
```

The server runs on `http://localhost:5200`

---

### 3. Set up the client

```bash
cd "../TaskDev Client"
npm install
npm run dev
```

The client runs on `http://localhost:5173`

---

## API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint               | Description                | Protected |
|--------|------------------------|----------------------------|-----------|
| POST   | /register              | Register a new user        | No        |
| GET    | /verify-email/:token   | Verify email address       | No        |
| POST   | /login                 | Login and set cookie       | No        |
| POST   | /logout                | Logout and clear cookie    | No        |
| POST   | /forgot-password       | Send password reset email  | No        |
| POST   | /reset-password/:token | Reset password             | No        |
| GET    | /me                    | Get current logged in user | Yes       |

### Task Routes — `/api/tasks`

| Method | Endpoint      | Description                          | Protected |
|--------|---------------|--------------------------------------|-----------|
| GET    | /             | Get all active tasks for the user    | Yes       |
| GET    | /trash        | Get all trashed tasks for the user   | Yes       |
| GET    | /:id          | Get a single task                    | Yes       |
| POST   | /             | Create a new task                    | Yes       |
| PUT    | /:id          | Update a task                        | Yes       |
| DELETE | /:id          | Soft delete a task (move to trash)   | Yes       |
| PUT    | /:id/restore  | Restore a trashed task               | Yes       |

---

## Branching Workflow (Week 3)

The soft delete and trash feature was built on a dedicated feature branch and then merged into `main`:

```bash
# create and switch to the feature branch
git checkout -b soft-delete

# build the feature, then commit and push to the feature branch
git add .
git commit -m "Add soft delete and trash feature"
git push -u origin soft-delete

# merge the feature branch into main
git checkout main
git merge soft-delete
git push
```

---

## Security

- Passwords hashed with bcrypt (12 salt rounds)
- JWT stored in httpOnly cookie — not accessible via JavaScript
- Email verification tokens hashed with SHA-256 before storing in database
- Password reset tokens expire after 1 hour
- All task routes scoped to authenticated user — users cannot access other users' tasks
- Soft delete and restore are scoped to the owner — users can only trash or restore their own tasks

---

## Known Issues

> None at the time of submission. This section will be updated if any issues are discovered after submission.

---

Techstudio Internship Program — Online Stage, Week 3
