import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTaskContext } from "../Context/AddTaskContext"
import NavBar from "../Components/NavBar"
import back from "../assets/back.png"

// TRASH PAGE — shows soft-deleted tasks and lets the user restore them
const TrashPage = () => {
  const navigate = useNavigate()
  const { trashedTasks, fetchTrashedTasks, restoreTask, trashLoading, error } =
    useTaskContext()

 
  useEffect(() => {
    fetchTrashedTasks()
  }, [])

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    })

  return (
    <div className="font-[Signika-Negative] min-h-screen bg-[#FAFAFB]">
      <NavBar />
      <div className="mx-auto container max-w-[1200px] px-4 py-12">

        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <button
          onClick={() => navigate("/tasks")}
          className="flex items-center gap-4 text-[28px] md:text-[35px] font-[700] text-gray-900 mb-3 hover:text-[#974FD0] transition-colors"
        >
          <img className="w-[15px] h-[30px]" src={back} alt="" /> Trash
        </button>
         <p className="text-[14px] md:text-[15px] text-gray-400 ">Deleted tasks stay here until you restore them.</p>
         </div>
          
        </div>

       
        {!trashLoading && !error && trashedTasks.length > 0 && (
          <div className="flex items-center gap-2 mt-6 mb-5">
            <span className="text-[13px] font-[600] uppercase tracking-[0.12em] text-gray-400">
              {trashedTasks.length} {trashedTasks.length === 1 ? "item" : "items"} in trash
            </span>
            <span className="flex-1 h-px bg-gray-200" />
          </div>
        )}

    
        {trashLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-9 h-9 border-[3px] border-[#974FD0] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-500 text-[15px]">
            {error}
          </div>
        ) : trashedTasks.length === 0 ? (
          <div className="flex flex-col items-center text-center py-24 gap-3">
            <p className="text-[17px] font-[600] text-[#292929]">Trash is empty</p>
            <p className="text-[14px] text-gray-400 max-w-[280px]">
              Tasks you delete will appear here, ready to restore if you change your mind.
            </p>
            <button
              onClick={() => navigate("/tasks")}
              className="mt-3 px-6 py-2.5 bg-[#974FD0] text-white rounded-[8px] text-[14px] font-[600] hover:bg-[#7d3db0] transition-colors"
            >
              Go to tasks
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {trashedTasks.map((task) => (
              <div
                key={task._id}
                className="group relative bg-white border border-gray-200/80 rounded-[14px] p-5 pl-6 transition-all hover:border-[#974FD0]/40 hover:shadow-[0_4px_20px_-8px_rgba(151,79,208,0.25)]"
              >
               
                <span className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-gray-200 group-hover:bg-[#974FD0] transition-colors" />

                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <span className="text-[11px] font-[700] uppercase tracking-[0.14em] text-gray-400">
                      {task.tags ?? "No tag"}
                    </span>
                    <h3 className="text-[20px] md:text-[22px] font-[500] text-[#292929] mt-1 mb-1.5 truncate">
                      {task.taskTitle}
                    </h3>
                    <p className="text-[15px] text-[#737171] leading-relaxed line-clamp-2">
                      {task.taskDescription}
                    </p>
                  </div>

                  <button
                    onClick={() => restoreTask(task._id)}
                    className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-[#974FD0] text-white rounded-[9px] text-[14px] md:text-[15px] font-[600] hover:bg-[#7d3db0] active:scale-95 transition-all"
                  >
                    ↺ Restore
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-4 pt-3 border-t border-gray-100 text-[13px] text-gray-400">
                  <span>Due {formatDate(task.dueDate)}</span>
                  {task.deletedAt && (
                    <span className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      Deleted {formatDate(task.deletedAt)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TrashPage