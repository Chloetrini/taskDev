import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useTaskContext } from "../Context/AddTaskContext"
import { getTaskById } from "../Services/api"
import NavBar from "../Components/NavBar"
import back from "../assets/back.png"
import down from "../assets/down.png"

const EditTaskPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { updateTask } = useTaskContext()

  const [form, setForm] = useState({
    taskTitle: "",
    taskDescription: "",
    tags: "" as "" | "Urgent" | "Important",
    dueDate: "",
    isCompleted: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [serverError, setServerError] = useState("")

  const today = new Date().toISOString().split("T")[0]

  useEffect(() => {
    const fetchTask = async () => {
      const data = await getTaskById(id!)
      if (data.success) {
        const t = data.task
        setForm({
          taskTitle: t.taskTitle,
          taskDescription: t.taskDescription,
          tags: t.tags ?? "",
          dueDate: t.dueDate?.split("T")[0] ?? "",
          isCompleted: t.isCompleted,
        })
      }
      setLoading(false)
    }
    fetchTask()
  }, [id])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.taskTitle.trim()) e.taskTitle = "Title is required"
    if (!form.taskDescription.trim()) e.taskDescription = "Description is required"
    if (!form.dueDate) e.dueDate = "Due date is required"
    else if (form.dueDate < today) e.dueDate = "Due date cannot be in the past"
    return e
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const val = e.target.type === "checkbox"
      ? (e.target as HTMLInputElement).checked
      : e.target.value
    setForm((prev) => ({ ...prev, [e.target.name]: val }))
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }))
    setServerError("")
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setSubmitting(true)
    const res = await updateTask(id!, {
      taskTitle: form.taskTitle,
      taskDescription: form.taskDescription,
      dueDate: form.dueDate,
      isCompleted: form.isCompleted,
      ...(form.tags && { tags: form.tags }),
    })
    setSubmitting(false)
    if (res.success) {
      navigate("/tasks")
    } else {
      setServerError(res.message || "Something went wrong")
    }
  }

  if (loading) {
    return (
      <div>
        <NavBar />
        <div className="flex justify-center items-center h-[60vh]">
          <div className="w-10 h-10 border-4 border-[#974FD0] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <div className="font-[Signika-Negative]">
      <NavBar />
      <div className="mx-auto container max-w-[1200px] px-4 py-9 pb-16">
        <button
          onClick={() => navigate("/tasks")}
          className="flex items-center gap-4 text-[28px] md:text-[37px] font-[500] text-gray-900 mb-7 hover:text-[#974FD0] transition-colors"
        >
         <img className="w-[15px] h-[30px]" src={back} alt="" /> Edit Task
        </button>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-[8px] px-4 py-3 text-[14px] mb-5">
            {serverError}
          </div>
        )}

        {/* FORM */}
        <div className="bg-white  rounded-[12px] flex flex-col gap-6 ">

          {/* TITLE */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[18px] font-[400] text-gray-400  tracking-wide">Task Title</label>
            <input
              name="taskTitle"
              value={form.taskTitle}
              onChange={handleChange}
              placeholder="E.g Project Defense, Assignment ..."
              className={`w-full px-4 py-3 border rounded-[8px] text-[15px] text-gray-900 outline-none transition-colors placeholder:text-gray-300 ${
                errors.taskTitle ? "border-red-400" : "border-gray-200 focus:border-[#974FD0]"
              }`}
            />
            {errors.taskTitle && <span className="text-[12px] text-red-500">{errors.taskTitle}</span>}
          </div>

          {/* DESCRIPTION */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[18px] font-[400] text-gray-400  tracking-wide">Description</label>
            <textarea
              name="taskDescription"
              value={form.taskDescription}
              onChange={handleChange}
              placeholder="Briefly describe your task..."
              rows={5}
              className={`w-full px-4 py-3 border rounded-[8px] text-[15px] text-gray-900 outline-none resize-y transition-colors placeholder:text-gray-300 ${
                errors.taskDescription ? "border-red-400" : "border-gray-200 focus:border-[#974FD0]"
              }`}
            />
            {errors.taskDescription && <span className="text-[12px] text-red-500">{errors.taskDescription}</span>}
          </div>

          {/* DUE DATE */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[18px] font-[400] text-gray-400 tracking-wide">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              min={today}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-[8px] text-[15px] text-gray-900 outline-none transition-colors ${
                errors.dueDate ? "border-red-400" : "border-gray-200 focus:border-[#974FD0]"
              }`}
            />
            {errors.dueDate && <span className="text-[12px] text-red-500">{errors.dueDate}</span>}
          </div>

          {/* TAGS */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[18px] font-[400] text-gray-400  tracking-wide">Tags</label>
            <div className="relative">
              <select
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-[8px] text-[15px] text-gray-900 outline-none focus:border-[#974FD0] appearance-none transition-colors"
              >
                <option value="">No tag</option>
                <option value="Urgent">Urgent</option>
                <option value="Important">Important</option>
              </select>
             <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-[11px]"><img src={down} className="w-[18px] h-[12px]" alt="down" /></span>
            </div>
          </div>

         
          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-4 bg-[#974FD0] text-white rounded-[8px] text-[16px] font-[700] hover:bg-[#7d3db0] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Saving..." : "Done"}
          </button>
        </div>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="block mx-auto mt-9 text-[14px] font-[600] text-[#974FD0] hover:opacity-70 transition-opacity"
        >
          Back To Top
        </button>
      </div>
    </div>
  )
}

export default EditTaskPage