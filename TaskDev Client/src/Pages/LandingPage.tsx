import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"
import NavBar from "../Components/NavBar"
import AuthModal from "../Components/AuthModal"
import hero from "/src/assets/heroTask.png"

const LandingPage = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleGoToTasks = () => {
    if (isAuthenticated) {
      navigate("/tasks")
    } else {
      setShowAuthModal(true)
    }
  }

  return (
    <div className="font-[Signika-Negative]">
      <NavBar />

      <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-10 my-10 md:my-13 mx-auto container max-w-[1200px] px-4">
        <div className="text-center md:text-left">
          <h1 className="text-[36px] sm:text-[44px] md:text-[50px] max-w-full md:max-w-[470px] font-[500] leading-tight">
            Manage your Tasks on{" "}
            <span className="text-[#974FD0]">TaskDev</span>
          </h1>
          <p className="text-[#737171] text-[16px] sm:text-[20px] md:text-[24px] font-[400] max-w-full md:max-w-[535px] py-5 leading-relaxed">
            Task management built for how developers actually work. Track progress across your entire stack without switching tools or losing context.
          </p>
          <button
            onClick={handleGoToTasks}
            className="py-[10px] px-[25px] text-[18px] sm:text-[22px] md:text-[24px] font-[500] bg-[#974FD0] text-white rounded-[8px] hover:bg-[#7d3db0] transition-colors w-full sm:w-auto"
          >
            Go to My Tasks
          </button>
        </div>
        <img
          src={hero}
          alt="hero"
          className="w-full max-w-[300px] sm:max-w-[380px] md:max-w-[480px] mx-auto md:mx-0"
        />
      </div>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  )
}

export default LandingPage