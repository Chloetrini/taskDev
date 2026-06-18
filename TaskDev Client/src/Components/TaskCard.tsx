

import { useNavigate } from "react-router-dom"
import { useTaskContext } from "../Context/AddTaskContext"
import { type TaskType } from "../Context/AddTaskContext"
import edit from "../assets/edit.png"
import deletee from "../assets/delete.png"


interface PropsTask {
  task: TaskType
  onDeleteClick: (id: string) => void
}

const TaskCard = ({ task, onDeleteClick }: PropsTask) => {
  const navigate = useNavigate()
  const { toggleComplete } = useTaskContext()

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC"
    })

  const tagColor =
    task.tags === "Urgent"
      ? "text-[#F38383]"
      : task.tags === "Important"
      ? "text-[#73C3A6]"
      : "text-gray-400"

  return (
    <div className={` border-[#B8B6B6] border-[0.5px] min-h-[287px] font-[Signika-Negative]  rounded-[10px] p-5 transition-shadow hover:shadow-md ${task.isCompleted ? "opacity-70" : ""}`}>

      <div className="flex  sm:flex-row sm:items-center justify-between gap-3 mb-3 py-2  items-center  ">
        <span className={`md:text-[18px] font-[600] ${tagColor}`}>
          {task.tags ?? "No Tag"}
        </span>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/tasks/${task._id}/edit`)}
            className="flex items-center gap-1.5 px-2  py-1 md:px-[18px] md:py-[7px] bg-[#974FD0] text-white rounded-[8px] md:text-[18px]  font-[500] hover:bg-[#7d3db0] transition-colors"
          >
            <img src={edit} alt="" /> Edit
          </button>
          <button
            onClick={() => onDeleteClick(task._id)}
            className="flex items-center gap-1.5 px-2  py-1 md:px-[18px] md:py-[7px] bg-white border border-[#974FD0] text-[#974FD0] rounded-[10px] md:text-[18px] font-[500] hover:border-[#7d3db0] hover:text-[#7d3db0] transition-colors"
          >
            <img src={deletee} alt="" />
            Delete
          </button>
        </div>
      </div>

      <hr className="border-[#B8B6B6] border-[0.5px]"/>
      

      <h3 className={`text-[26px] font-[400] text-[#292929] mb-1 mt-3 ${task.isCompleted ? "text-[#974FD0]" : ""}`}>
        {task.taskTitle}
      </h3>

      <p className="text-[18px] text-[#737171] leading-relaxed font-[400] mb-4">
        {task.taskDescription}
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 ">
        <span className="text-[16px] text-[#737171] font-[400]">
          Due: {formatDate(task.dueDate)}
        </span>
        <button
          onClick={() => toggleComplete(task)}
          className={`text-[16px] font-[500] px-4 py-2 rounded-[10px] transition-colors ${
            task.isCompleted
              ? "bg-green-700 border-green-700 text-white"
              : "bg-[#974FD0] text-white hover:bg-[#7d3db0]"
          }`}
        >
          {task.isCompleted ? "✓ Completed" : "Mark Complete"}
        </button>
      </div>

    </div>
  )
}

export default TaskCard