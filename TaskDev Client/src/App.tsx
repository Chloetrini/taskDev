import {  Routes, Route } from "react-router-dom";
import './App.css'
import LandingPage from './Pages/LandingPage'
import TasksPage from "./Pages/TasksPage";
import NewTaskPage from "./Pages/NewTaskPage";
import EditTaskPage from "./Pages/EditTaskPage";

function App() {
  

  return (
    <>
       <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks/new" element={<NewTaskPage />} />
            <Route path="/tasks/:id/edit" element={<EditTaskPage />} />
          </Routes>
    </>
  )
}

export default App
