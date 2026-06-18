import { useNavigate } from "react-router-dom"
import logo from "/src/assets/logo.png"

const PasswordSuccessPage = () => {
  const navigate = useNavigate()

  return (
    <div className="font-[Signika-Negative] min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-[16px] border border-gray-200 w-full max-w-[560px] px-10 py-10 shadow-sm text-center">
        <img src={logo} alt="logo" className="w-[40px] h-[45px] mx-auto mb-4 cursor-pointer" onClick={() => navigate("/")} />
        <h1 className="text-[26px] font-[700] text-[#292929] mb-2">
          Password updated!
        </h1>
        <p className="text-[15px] text-gray-400 leading-relaxed mb-8">
          Your password has been successfully reset. You can now log in with your new password.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="w-full py-4 bg-[#974FD0] text-white rounded-[8px] text-[16px] font-[700] hover:bg-[#7d3db0] transition-colors"
        >
          Go to Login
        </button>
      </div>
    </div>
  )
}

export default PasswordSuccessPage