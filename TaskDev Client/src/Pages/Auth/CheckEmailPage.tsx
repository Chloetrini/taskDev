import { useLocation, useNavigate } from "react-router-dom"
import logo from "/src/assets/logo.png"

const CheckEmailPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || "your email"

  return (
    <div className="font-[Signika-Negative] min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-[16px] border border-gray-200 w-full max-w-[560px] px-10 py-10 shadow-sm text-center">
          <img src={logo} alt="logo" className="w-[40px] h-[45px] mx-auto mb-4" onClick={() => navigate("/")} />
          <h1 className="text-[24px] font-[700] text-[#292929] mb-2">Check your inbox</h1>
          <p className="text-[15px] text-gray-400 leading-relaxed mb-6">
            We sent a verification link to <strong className="text-[#292929]">{email}</strong>. 
            Click the link in the email to activate your account.
          </p>
          <div className="bg-purple-50 border border-purple-100 rounded-[10px] px-5 py-4 mb-6">
            <p className="text-[13px] text-[#974FD0]">
              Didn't receive it? Check your spam folder or try registering again.
            </p>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="w-full py-4 bg-[#974FD0] text-white rounded-[8px] text-[16px] font-[700] hover:bg-[#7d3db0] transition-colors"
          >
            Go to Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-full py-3 mt-3 text-[14px] font-[600] text-gray-400 hover:text-[#974FD0] transition-colors"
          >
            Back to Register
          </button>
        </div>
      </div>
  
  )
}

export default CheckEmailPage