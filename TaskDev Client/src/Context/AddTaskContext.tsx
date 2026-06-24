import React, { createContext, useState, useContext, useEffect } from "react";
import {getTasks,createTask,deleteTask as deleteTaskAPI,updateTask as updateTaskAPI,getTrashedTasks as getTrashedTasksAPI, restoreTask as restoreTaskAPI } from "../Services/api";

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
  isDeleted: boolean;      
  deletedAt: string | null; 
  dueDate: string;
  createdAt: string;
  updatedAt: string;
};

export type TaskContextType = {
  tasks: TaskType[];
  trashedTasks: TaskType[]; 
  isLoading: boolean;
  trashLoading: boolean;
  error: string;

  // filters
  tagFilter: TagFilter;
  statusFilter: StatusFilter;
  setTagFilter: (f: TagFilter) => void;
  setStatusFilter: (f: StatusFilter) => void;
  filteredTasks: TaskType[];

  // actions
  fetchTasks: () => void;
  fetchTrashedTasks: () => void; 
  addTask: (data: object) => Promise<{ success: boolean; message?: string }>;
  deleteTask: (id: string) => void;
  restoreTask: (id: string) => void; // soft-delete: restore from trash
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
  const [trashedTasks, setTrashedTasks] = useState<TaskType[]>([]); 
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [trashLoading, setTrashLoading] = useState<boolean>(false); 
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

  const fetchTrashedTasks = async () => {
    try {
      setTrashLoading(true);
      setError("");
      const data = await getTrashedTasksAPI();
      if (data.success) {
        console.log("Trashed tasks fetched from backend:", data.tasks);
        setTrashedTasks(data.tasks);
      } else {
        setError(data.message || "Failed to load trashed tasks");
      }
    } catch (err) {
      console.error("Failed to fetch trashed tasks:", err);
      setError("Could not connect to server");
    } finally {
      setTrashLoading(false);
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

  // delete — now a SOFT delete on the backend.
  // We remove it from the active list and drop it into trashedTasks
  // so the trash page reflects it immediately without a refetch.
  const deleteTask = async (id: string) => {
    try {
      const result = await deleteTaskAPI(id);
      if (result.success) {
        setTasks((prev) => {
          const removed = prev.find((task) => task._id === id);
          // move the trashed task into the trashedTasks list locally
          if (removed) {
            setTrashedTasks((trash) => [
              { ...removed, isDeleted: true, deletedAt: new Date().toISOString() },
              ...trash,
            ]);
          }
          return prev.filter((task) => task._id !== id);
        });
      } else {
        alert("Failed to delete task");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Something went wrong during deletion");
    }
  };

  // soft-delete: restore a task from trash back into the active list
  const restoreTask = async (id: string) => {
    try {
      const result = await restoreTaskAPI(id);
      if (result.success) {
        setTrashedTasks((prev) => {
          const restored = prev.find((task) => task._id === id);
          // move the restored task back into the active tasks list locally
          if (restored) {
            setTasks((active) => [
              { ...restored, isDeleted: false, deletedAt: null },
              ...active,
            ]);
          }
          return prev.filter((task) => task._id !== id);
        });
      } else {
        alert("Failed to restore task");
      }
    } catch (err) {
      console.error("Restore error:", err);
      alert("Something went wrong during restore");
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
        trashedTasks,
        isLoading,
        trashLoading,
        error,
        tagFilter,
        statusFilter,
        setTagFilter,
        setStatusFilter,
        filteredTasks,
        fetchTasks,
        fetchTrashedTasks,
        addTask,
        deleteTask,
        restoreTask,
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