
import React, { createContext, useState, useContext, useEffect } from "react";
import { getTasks, createTask, deleteTask as deleteTaskAPI, updateTask as updateTaskAPI } from "../Services/api";

//TYPES 
export type TagType = "Urgent" | "Important";
export type TagFilter = "All" | "Urgent" | "Important";
export type StatusFilter = "All" | "Completed" | "Pending";
export type ActivePage = "New Task" | "All Task" | "TaskDuty";
export type ModalType = "confirmDelete" | "deleteSuccess" | "createSuccess" | "updateSuccess";

export type TaskType = {
  _id: string;
  taskTitle: string;
  taskDescription: string;
  tags?: TagType;
  isDraft: boolean;
  isCompleted: boolean;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskContextType = {
  tasks: TaskType[];
  isLoading: boolean;
  error: string;

  // filters
  tagFilter: TagFilter;
  statusFilter: StatusFilter;
  setTagFilter: (f: TagFilter) => void;
  setStatusFilter: (f: StatusFilter) => void;
  filteredTasks: TaskType[];

  // actions
  fetchTasks: () => void;
  addTask: (data: object) => Promise<{ success: boolean; message?: string }>;
  deleteTask: (id: string) => void;
  editingTask: TaskType | null;
  setEditingTask: (task: TaskType | null) => void;
  updateTask: (id: string, data: object) => Promise<{ success: boolean; message?: string }>;
  toggleComplete: (task: TaskType) => void;

  // modal
  modal: ModalType | null;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
};


export const TaskContext = createContext<TaskContextType | null>(null);

//  HOOK 
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

// PROVIDER 
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [tagFilter, setTagFilter] = useState<TagFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [modal, setModal] = useState<ModalType | null>(null);
  const openModal = (type: ModalType) => setModal(type);
  const closeModal = () => setModal(null);

  // fetch all task from backend
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      setError("");
      const data = await getTasks();
      if (data.success) {
        console.log("Tasks fetched successfully from backend:", data.tasks);
        setTasks(data.tasks);
      } else {
        setError(data.message || "Failed to load tasks");
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
      setError("Could not connect to server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // create
  const addTask = async (data: object) => {
    try {
      const res = await createTask(data);
      if (res.success) {
        setTasks((prev) => [res.task, ...prev]);
      }
      return { success: res.success, message: res.message };
    } catch (err) {
      console.error("Create task error:", err);
      return { success: false, message: "Something went wrong" };
    }
  };

  // delete
  const deleteTask = async (id: string) => {
    try {
      const result = await deleteTaskAPI(id);
      if (result.success) {
        setTasks((prev) => prev.filter((task) => task._id !== id));
      } else {
        alert("Failed to delete task");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong during deletion");
    }
  };

  //update
  const updateTask = async (id: string, data: object) => {
    try {
      const res = await updateTaskAPI(id, data);
      if (res.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === id ? res.task : t))
        );
        setEditingTask(null);
      }
      return { success: res.success, message: res.message };
    } catch (err) {
      console.error("Update task error:", err);
      return { success: false, message: "Something went wrong" };
    }
  };

  // toggle complete
  const toggleComplete = async (task: TaskType) => {
    try {
      const res = await updateTaskAPI(task._id, { isCompleted: !task.isCompleted });
      if (res.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === task._id ? res.task : t))
        );
      }
    } catch (err) {
      console.error("Toggle complete error:", err);
    }
  };

  // filter
  const filteredTasks = tasks.filter((t) => {
    const tagMatch = tagFilter === "All" || t.tags === tagFilter;
    const statusMatch =
      statusFilter === "All" ||
      (statusFilter === "Completed" && t.isCompleted) ||
      (statusFilter === "Pending" && !t.isCompleted);
    return tagMatch && statusMatch;
  });

  return (
    <TaskContext.Provider
      value={{
        tasks,
        isLoading,
        error,
        tagFilter,
        statusFilter,
        setTagFilter,
        setStatusFilter,
        filteredTasks,
        fetchTasks,
        addTask,
        deleteTask,
        editingTask,
        setEditingTask,
        updateTask,
        toggleComplete,
        modal,
        openModal,
        closeModal,
      }}
    >
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="w-10 h-10 border-4 border-[#974FD0] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        children
      )}
    </TaskContext.Provider>
  );
};