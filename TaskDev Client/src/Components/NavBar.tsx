import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import logo from "/src/assets/logo.png"
import user from "/src/assets/user.png"

const NavBar = () => {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  const handleNewClick = () => navigate("/tasks/new")
  const handleAllClick = () => navigate("/tasks")

  return (
    <div className="relative">
      <div className="flex justify-between items-center mx-auto container max-w-[1200px] py-6 px-4">
        <div
          className="flex gap-2 cursor-pointer items-center"
          onClick={() => navigate("/")}
        >
          <img className="w-[32px] h-[36px] md:w-[37px] md:h-[41px]" src={logo} alt="logo" />
          <h1 className="text-[22px] md:text-[27px] font-[600]">TaskDev</h1>
        </div>
        <div className="hidden md:flex text-[22px] font-[500] gap-9 items-center">
          <button
            onClick={handleNewClick}
            className={`transition-colors ${
              isActive("/tasks/new") ? "text-[#974FD0]" : "text-[#292929]"
            }`}
          >
            New Task
          </button>
          <button
            onClick={handleAllClick}
            className={`transition-colors ${
              isActive("/tasks") ? "text-[#974FD0]" : "text-[#292929]"
            }`}
          >
            All Task
          </button>
          <img src={user} alt="user" className="w-[40px] h-[40px] rounded-full" />
        </div>

        <button
            className="md:hidden p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#292929" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#292929" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
      </button>
      </div>

      <hr className="border-[#B8B6B6] border-[0.5px]" />

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 py-5 bg-white border-b border-gray-200 text-[18px] font-[500] absolute top-full left-0 right-0 z-50 shadow-md">
          <button
            onClick={() => { navigate("/tasks/new"); setMenuOpen(false) }}
            className={`transition-colors text-left ${
              isActive("/tasks/new") ? "text-[#974FD0]" : "text-[#292929]"
            }`}
          >
            New Task
          </button>
          <button
            onClick={() => { navigate("/tasks"); setMenuOpen(false) }}
            className={`transition-colors text-left ${
              isActive("/tasks") ? "text-[#974FD0]" : "text-[#292929]"
            }`}
          >
            All Task
          </button>
          <div className="flex items-center gap-3">
            <img src={user} alt="user" className="w-[36px] h-[36px] rounded-full" />
            <span className="text-[16px] text-gray-500">My Account</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default NavBar