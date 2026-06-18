import { useNavigate } from "react-router-dom"
import NavBar from "../Components/NavBar"
import logo from "/src/assets/logo.png"

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <div className="font-[Signika-Negative] min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex flex-col items-center justify-center px-4 py-24 text-center">
        <img src={logo} alt="logo" className="w-[40px] h-[45px] mb-6" />
        <h1 className="text-[80px] font-[700] text-[#974FD0] leading-none mb-2">404</h1>
        <h2 className="text-[26px] font-[700] text-[#292929] mb-3">Page not found</h2>
        <p className="text-[16px] text-gray-400 max-w-[380px] leading-relaxed mb-8">
          Looks like this page doesn't exist or has been moved. Let's get you back on track.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-8 py-4 bg-[#974FD0] text-white rounded-[8px] text-[16px] font-[700] hover:bg-[#7d3db0] transition-colors"
        >
          Back to Home
        </button>
        <button
          onClick={() => navigate("/tasks")}
          className="mt-3 text-[14px] font-[600] text-[#974FD0] hover:opacity-70 transition-opacity"
        >
          Go to My Tasks
        </button>
      </div>
    </div>
  )
}

export default NotFoundPage