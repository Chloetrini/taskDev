# TaskDev — Personal Task Manager

A full-stack MERN application for managing personal tasks with authentication, email verification, and full CRUD functionality. Built as part of the Techstudio Internship Program — Week 2 submission.

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
│       │   └── TasksPage.tsx
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

| Method | Endpoint | Description                      | Protected |
|--------|----------|----------------------------------|-----------|
| GET    | /        | Get all tasks for logged in user | Yes       |
| GET    | /:id     | Get a single task                | Yes       |
| POST   | /        | Create a new task                | Yes       |
| PUT    | /:id     | Update a task                    | Yes       |
| DELETE | /:id     | Delete a task                    | Yes       |

---

## Security

- Passwords hashed with bcrypt (12 salt rounds)
- JWT stored in httpOnly cookie — not accessible via JavaScript
- Email verification tokens hashed with SHA-256 before storing in database
- Password reset tokens expire after 1 hour
- All task routes scoped to authenticated user — users cannot access other users' tasks

---

## Known Issues

> None at the time of submission. This section will be updated if any issues are discovered after submission.

---

Techstudio Internship Program — Online Stage, Week 2