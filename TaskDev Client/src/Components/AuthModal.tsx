import { useNavigate } from "react-router-dom"
import logo from "/src/assets/logo.png"

interface AuthModalProps {
  onClose: () => void
}

const AuthModal = ({ onClose }: AuthModalProps) => {
  const navigate = useNavigate()

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="font-[Signika-Negative] bg-white rounded-[16px] shadow-2xl w-full max-w-[420px] px-8 py-10 flex flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={logo} alt="logo" className="w-[36px] h-[40px]" />
        <h2 className="text-[22px] font-[700] text-[#292929] text-center">
          Login required
        </h2>
        <p className="text-[14px] text-gray-400 text-center leading-relaxed">
          You need an account to access your tasks. Log in or create an account to start managing your tasks.
        </p>

        <div className="flex flex-col gap-3 w-full mt-2">
        
          <button
            onClick={() => { navigate("/register"); onClose() }}
            className="w-full py-3.5 bg-[#974FD0] text-white rounded-[8px] text-[15px] font-[700] hover:bg-[#7d3db0] transition-colors"
          >
            Create account
          </button>

        
          <button
            onClick={() => { navigate("/login"); onClose() }}
            className="w-full py-3.5 border border-[#974FD0] text-[#974FD0] rounded-[8px] text-[15px] font-[700] hover:bg-purple-50 transition-colors"
          >
            I already have an account
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 text-[14px] font-[600] text-gray-400 hover:text-gray-600 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthModal