import { useNavigate } from "react-router-dom"
import { useTaskContext } from "../Context/AddTaskContext"
import { type TagFilter, type StatusFilter } from "../Context/AddTaskContext"
import NavBar from "../Components/NavBar"
import TaskCard from "../Components/TaskCard"
import add from "../assets/add.png"
import { useState } from "react"
import Modal from "../Components/Modal"
const TasksPage = () => {
  const navigate = useNavigate()
  const {
    isLoading,
    error,
    tagFilter,
    statusFilter,
    modal,
    closeModal, 
    openModal,
    deleteTask,
    setTagFilter,
    setStatusFilter,
    filteredTasks,
  } = useTaskContext()
const [selectedId, setSelectedId] = useState<string | null>(null)
  return (
    <div className="font-[Signika-Negative]">
      <NavBar />
      <div className="mx-auto container max-w-[1200px] px-4 py-10">

        <div className="flex items-center justify-between mb-6">
          <h1 className=" text-[25px] md:text-[40px] md:text-[34px] font-[500] text-[#292929]">
            My Tasks
          </h1>
          <button
            onClick={() => navigate("/tasks/new")}
            className="text-[18px] md:text-[24px] md:text-[16px] font-[500] text-[#974FD0] hover:opacity-70 transition-opacity flex gap-1 items-center"
          >
            <img src={add} className="md:w-[18px] md:h-[18px] w-[13px] h-[13px]" alt="" />
             Add New Task
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-[10px] px-5 py-4 mb-7 flex flex-col justify-between sm:flex-row flex-wrap gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[18px] font-[600] text-gray-400">Tag:</span>
            {(["All", "Urgent", "Important"] as TagFilter[]).map((t) => (
              <button
                key={t}
                onClick={() => setTagFilter(t)}
                className={`px-4 py-1 rounded-full text-[16px] font-[500] border transition-all ${
                  tagFilter === t
                    ? "bg-[#974FD0] border-[#974FD0] text-white"
                    : "border-gray-200 text-gray-400 hover:border-[#974FD0] hover:text-[#974FD0]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[18px] font-[600] text-gray-400">Status:</span>
            {(["All", "Completed", "Pending"] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-4 py-1 rounded-full text-[16px] font-[500] border transition-all ${
                  statusFilter === s
                    ? "bg-[#974FD0] border-[#974FD0] text-white"
                    : "border-gray-200 text-gray-400 hover:border-[#974FD0] hover:text-[#974FD0]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-[#974FD0] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-500 text-[15px]">
            {error}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-4 text-gray-400">
            <p className="text-[15px]">No tasks found.</p>
            <button
              onClick={() => navigate("/tasks/new")}
              className="px-6 py-2.5 bg-[#974FD0] text-white rounded-[8px] text-[14px] font-[600] hover:bg-[#7d3db0] transition-colors"
            >
              Create your first task
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredTasks.map((task) => (
              <TaskCard key={task._id} task={task} onDeleteClick={(id) => {
      setSelectedId(id)
      openModal("confirmDelete")
    }} />
            ))}
          </div>
        )}

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="block mx-auto mt-10 text-[14px] font-[600] text-[#974FD0] hover:opacity-70 transition-opacity"
        >
          Back To Top
        </button>
      </div>

      {modal && (
        <Modal
            type={modal}
            onClose={() => {
            closeModal()
            setSelectedId(null)
            }}
            onConfirm={
            modal === "confirmDelete"
                ? async () => {
                    closeModal()
                    await deleteTask(selectedId!)
                    openModal("deleteSuccess")
                }
                : undefined
            }
        />
)}
    </div>
  )
}

export default TasksPage