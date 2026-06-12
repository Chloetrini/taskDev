import type { ModalType } from "../Context/AddTaskContext"

interface ModalProps {
  type: ModalType
  onConfirm?: () => void
  onClose: () => void
}

const modalContent = {
  confirmDelete: {
    icon: "🗑️",
    title: "Delete Task?",
    message: "This action cannot be undone. Are you sure you want to delete this task?",
    confirmText: "Yes, Delete",
    cancelText: "Cancel",
    confirmStyle: "bg-[#974FD0] hover:bg-[#7d3db0] text-white",
  },
  deleteSuccess: {
    icon: "✅",
    title: "Task Deleted",
    message: "Your task has been successfully deleted.",
    confirmText: "OK",
    cancelText: null,
    confirmStyle: "bg-[#974FD0] hover:bg-[#7d3db0] text-white",
  },
  createSuccess: {
    icon: "🎉",
    title: "Task Created!",
    message: "Your new task has been successfully created.",
    confirmText: "OK",
    cancelText: null,
    confirmStyle: "bg-[#974FD0] hover:bg-[#7d3db0] text-white",
  },
  updateSuccess: {
    icon: "✏️",
    title: "Task Updated!",
    message: "Your task has been successfully updated.",
    confirmText: "OK",
    cancelText: null,
    confirmStyle: "bg-[#974FD0] hover:bg-[#7d3db0] text-white",
  },
}

const Modal = ({ type, onConfirm, onClose }: ModalProps) => {
  const content = modalContent[type]

  return (

    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="font-[Signika-Negative] bg-white rounded-[16px] shadow-2xl w-full max-w-[400px] px-6 py-8 flex flex-col items-center gap-4 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-[48px] leading-none">{content.icon}</div>

        <h2 className="text-[20px] font-[700] text-gray-900 text-center">
          {content.title}
        </h2>

        <p className="text-[14px] text-gray-400 text-center leading-relaxed">
          {content.message}
        </p>

        <div className="flex flex-col gap-3 w-full mt-2">
          <button
            onClick={onConfirm ?? onClose}
            className={`w-full py-3 rounded-[8px] text-[15px] font-[700] transition-colors ${content.confirmStyle}`}
          >
            {content.confirmText}
          </button>

          {content.cancelText && (
            <button
              onClick={onClose}
              className="w-full py-3 rounded-[8px] text-[15px] font-[600] text-gray-400 border border-gray-200 hover:border-gray-300 hover:text-gray-600 transition-colors"
            >
              {content.cancelText}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Modal