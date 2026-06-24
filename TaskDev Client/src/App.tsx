import { Routes, Route } from "react-router-dom";
import './App.css'
import { TaskProvider } from './Context/AddTaskContext';
import ProtectedRoute from "./Components/ProtectedRoutes";
import LandingPage from './Pages/LandingPage'
import TasksPage from "./Pages/TasksPage";
import TrashPage from "./Pages/TrashPage";
import NewTaskPage from "./Pages/NewTaskPage";
import EditTaskPage from "./Pages/EditTaskPage";
import LoginPage from "./Pages/Auth/LoginPage";
import RegisterPage from "./Pages/Auth/RegisterPage";
import ForgotPasswordPage from "./Pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "./Pages/Auth/ResetPasswordPage";
import PasswordSuccessPage from "./Pages/Auth/PasswordSuccessPage";
import NotFoundPage from "./Pages/Error404Page";
import ProfilePage from "./Pages/Auth/profilePage";
import EmailVerifiedPage from "./Pages/Auth/EmailVerifiedPage";
import CheckEmailPage from "./Pages/Auth/CheckEmailPage";

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/check-email" element={<CheckEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/password-success" element={<PasswordSuccessPage />} />
      <Route path="/verify-email" element={<EmailVerifiedPage />} />
      
      {/* PROTECTED ROUTES */}
      <Route path="/tasks" element={
        <ProtectedRoute>
          <TaskProvider>
            <TasksPage />
          </TaskProvider>
        </ProtectedRoute>
      } />
      {/* TRASH PAGE — shows soft-deleted tasks the user can restore */}
      <Route path="/tasks/trash" element={
        <ProtectedRoute>
          <TaskProvider>
            <TrashPage />
          </TaskProvider>
        </ProtectedRoute>
      } />
      <Route path="/tasks/new" element={
        <ProtectedRoute>
          <TaskProvider>
            <NewTaskPage />
          </TaskProvider>
        </ProtectedRoute>
      } />
      <Route path="/tasks/:id/edit" element={
        <ProtectedRoute>
          <TaskProvider>
            <EditTaskPage />
          </TaskProvider>
        </ProtectedRoute>
      } />
    <Route path="/profile" element={
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    } />


      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App