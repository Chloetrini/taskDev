import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../Context/AuthContext"
import NavBar from "../../Components/NavBar"
import logo from "/src/assets/logo.png"

const ProfilePage = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()

  const [name, setName] = useState(user?.name || "")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Name is required"); return }
    setSubmitting(true)
    const res = await updateUser(name)
    setSubmitting(false)
    if (res.success) {
      setSuccess("Profile updated successfully!")
      setError("")
    } else {
      setError(res.message || "Something went wrong")
      setSuccess("")
    }
  }

  return (
    <div className="font-[Signika-Negative] min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-[16px] border border-gray-200 w-full max-w-[560px] px-10 py-10 shadow-sm">

          <div className="flex flex-col items-center mb-8">
            <img src={logo} alt="logo" className="w-[40px] h-[45px] mb-3 cursor-pointer" onClick={() => navigate("/")} />
            <h1 className="text-[26px] font-[700] text-[#292929]">My Profile</h1>
            <p className="text-[15px] text-gray-400 mt-1">{user?.email}</p>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 rounded-[8px] px-4 py-3 text-[14px] mb-5">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-[8px] px-4 py-3 text-[14px] mb-5">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[15px] font-[500] text-gray-600">Full Name</label>
              <input
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); setSuccess("") }}
                placeholder="Your name"
                className="w-full px-4 py-3 border border-gray-200 rounded-[8px] text-[15px] text-gray-900 outline-none transition-colors focus:border-[#974FD0] placeholder:text-gray-300"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[15px] font-[500] text-gray-600">Email</label>
              <input
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-3 border border-gray-100 rounded-[8px] text-[15px] text-gray-400 outline-none bg-gray-50 cursor-not-allowed"
              />
              <span className="text-[12px] text-gray-400">Email cannot be changed</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-4 bg-[#974FD0] text-white rounded-[8px] text-[16px] font-[700] hover:bg-[#7d3db0] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              ) : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage