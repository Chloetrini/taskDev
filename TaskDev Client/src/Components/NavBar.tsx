import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../Context/AuthContext"
import AuthModal from "./AuthModal"
import logo from "/src/assets/logo.png"

const NavBar = () => {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuth()

  const isActive = (path: string) => location.pathname === path
  const displayName = user?.name?.split(" ")[0] || ""

  const handleNewClick = () => {
    if (isAuthenticated) navigate("/tasks/new")
    else setShowAuthModal(true)
  }

  const handleAllClick = () => {
    if (isAuthenticated) navigate("/tasks")
    else setShowAuthModal(true)
  }

  const handleLogout = async () => {
    await logout()
    navigate("/login")
  }

  return (
    <div className="relative">
      <div className="flex justify-between items-center mx-auto container max-w-[1200px] py-6 px-4">

        {/* LOGO */}
        <div
          className="flex gap-2 cursor-pointer items-center"
          onClick={() => navigate("/")}
        >
          <img className="w-[32px] h-[36px] md:w-[37px] md:h-[41px]" src={logo} alt="logo" />
          <h1 className="text-[22px] md:text-[27px] font-[600]">TaskDev</h1>
        </div>

     {/* DESKTOP NAV */}
       
    <div className="hidden md:flex items-center w-full">
      
      <div className="flex-1 flex justify-center gap-9">
        <button
          onClick={handleNewClick}
          className={`text-[22px] font-[500] transition-colors ${
            isActive("/tasks/new") ? "text-[#974FD0]" : "text-[#292929]"
          }`}
            >
              New Task
            </button>
    <button
      onClick={handleAllClick}
      className={`text-[22px] font-[500] transition-colors ${
        isActive("/tasks") ? "text-[#974FD0]" : "text-[#292929]"
      }`}
    >
      All Task
    </button>
  </div>

  {/* RIGHT SIDE */}
  {isAuthenticated ? (
    <div className="flex items-center gap-4">
      <span
      onClick={() => navigate("/profile")}
      className="text-[18px] font-[500] text-[#974FD0] cursor-pointer hover:opacity-70 transition-opacity"
    >
      Hi, {displayName}
</span>
      <button
        onClick={handleLogout}
        className="text-[16px] font-[600] px-5 py-2 border border-[#974FD0] text-[#974FD0] rounded-[8px] hover:bg-purple-50 transition-colors"
      >
        Logout
      </button>
    </div>
  ) : (
    <div className="flex items-center gap-4">
      <button
        onClick={() => navigate("/login")}
        className={`transition-colors text-[20px] font-[500] ${
          isActive("/login") ? "text-[#974FD0]" : "text-[#292929]"
        }`}
      >
        Login
      </button>
      <button
        onClick={() => navigate("/register")}
        className="text-[18px] font-[600] px-5 py-2 bg-[#974FD0] text-white rounded-[8px] hover:bg-[#7d3db0] transition-colors"
      >
        Sign up
      </button>
    </div>
  )}
</div>
        {/* MOBILE HAMBURGER */}
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

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 py-5 bg-white border-b border-gray-200 text-[18px] font-[500] absolute top-full left-0 right-0 z-50 shadow-md">
          <button
            onClick={() => { handleNewClick(); setMenuOpen(false) }}
            className={`transition-colors text-left ${
              isActive("/tasks/new") ? "text-[#974FD0]" : "text-[#292929]"
            }`}
          >
            New Task
          </button>
          <button
            onClick={() => { handleAllClick(); setMenuOpen(false) }}
            className={`transition-colors text-left ${
              isActive("/tasks") ? "text-[#974FD0]" : "text-[#292929]"
            }`}
          >
            All Task
          </button>

          <div className="border-t border-gray-100 pt-3">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <span className="text-[16px] text-[#974FD0] font-[500]"
                onClick={() => navigate("/profile")}>
                  Hi, {displayName}
                </span>
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false) }}
                  className="text-[15px] font-[600] px-4 py-2 border border-[#974FD0] text-[#974FD0] rounded-[8px] hover:bg-purple-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => { navigate("/login"); setMenuOpen(false) }}
                  className="text-left text-[18px] text-[#292929] hover:text-[#974FD0] transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => { navigate("/register"); setMenuOpen(false) }}
                  className="w-full py-3 bg-[#974FD0] text-white rounded-[8px] text-[16px] font-[600] hover:bg-[#7d3db0] transition-colors text-center"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AUTH MODAL */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  )
}

export default NavBar