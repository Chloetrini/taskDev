import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTaskContext } from "../Context/AddTaskContext"
import NavBar from "../Components/NavBar"
import Modal from "../Components/Modal"
import back from "../assets/back.png"
import down from "../assets/down.png"

const NewTaskPage = () => {
  const navigate = useNavigate()
  const { addTask, openModal, closeModal, modal } = useTaskContext()

  const [form, setForm] = useState({
    taskTitle: "",
    taskDescription: "",
    tags: "" as "" | "Urgent" | "Important",
    dueDate: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState("")

  const today = new Date().toISOString().split("T")[0]

 
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
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }))
    setServerError("")
  }

  
  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setSubmitting(true)
    const res = await addTask({
      taskTitle: form.taskTitle,
      taskDescription: form.taskDescription,
      dueDate: form.dueDate,
      ...(form.tags && { tags: form.tags }),
    })
    setSubmitting(false)
    if (res.success) {
      openModal("createSuccess") 
    } else {
      setServerError(res.message || "Something went wrong")
    }
  }

  return (
    <div className="font-[Signika-Negative]">
      <NavBar />
      <div className="mx-auto container max-w-[1200px] px-4 py-9 pb-16">
        <button
          onClick={() => navigate("/tasks")}
          className="flex items-center gap-4 text-[28px] md:text-[35px] font-[700] text-gray-900 mb-7 hover:text-[#974FD0] transition-colors"
        >
          <img className="w-[15px] h-[30px]" src={back} alt="" /> New Task
        </button>
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-[8px] px-4 py-3 text-[14px] mb-5">
            {serverError}
          </div>
        )}

        <div className="bg-white rounded-[12px] flex flex-col gap-6 w-full">

          {/* TITLE */}
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-[18px] font-[400] text-gray-400 tracking-wide">
              Task Title
            </label>
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
            <label className="text-[18px] font-[400] text-gray-400  tracking-wide">
              Description
            </label>
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
            <label className="text-[18px] font-[400] text-gray-400 tracking-wide">
              Due Date
            </label>
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
            <label className="text-[18px] font-[400] text-gray-400 tracking-wide">
              Tags
            </label>
            <div className="relative">
              <select
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-[8px] text-[15px] text-gray-900 outline-none focus:border-[#974FD0] appearance-none transition-colors"
              >
                <option value="">Select a tag (optional)</option>
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
            {submitting ? "Creating..." : "Done"}
          </button>
        </div>

        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="block mx-auto mt-9 text-[14px] font-[600] text-[#974FD0] hover:opacity-70 transition-opacity"
        >
          Back To Top
        </button>
      </div>

      
      {modal && (
        <Modal
          type={modal}
          onClose={() => {
            closeModal()
            navigate("/tasks")
          }}
        />
      )}
    </div>
  )
}

export default NewTaskPage