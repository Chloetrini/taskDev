import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../../Context/AuthContext"
import { Eye, EyeOff } from "lucide-react"
import logo from "/src/assets/logo.png"

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: "", password: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.email.trim()) e.email = "Email is required"
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email"
    if (!form.password) e.password = "Password is required"
    return e
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }))
    setServerError("")
  }

  const handleSubmit = async () => {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    setSubmitting(true)
    const res = await login(form.email, form.password)
    setSubmitting(false)
    if (res.success) {
      navigate("/")
    } else {
      setServerError(res.message || "Something went wrong")
    }
  }

 return (
  <div className="font-[Signika-Negative] min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div className="bg-white rounded-[16px] border border-gray-200 w-full max-w-[480px] px-8 py-10 shadow-sm">

      <div className="flex flex-col items-center mb-8">
        <img src={logo} alt="logo" className="w-[40px] h-[45px] mb-3 cursor-pointer" onClick={() => navigate("/")} />
        <h1 className="text-[26px] font-[700] text-[#292929]">Welcome back</h1>
        <p className="text-[15px] text-gray-400 mt-1">Log in to your TaskDev account</p>
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-[8px] px-4 py-3 text-[14px] mb-5">
          {serverError}
        </div>
      )}

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[15px] font-[500] text-gray-600">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={`w-full px-4 py-3 border rounded-[8px] text-[15px] text-gray-900 outline-none transition-colors placeholder:text-gray-300 ${
              errors.email ? "border-red-400" : "border-gray-200 focus:border-[#974FD0]"
            }`}
          />
          {errors.email && <span className="text-[12px] text-red-500">{errors.email}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[15px] font-[500] text-gray-600">Password</label>
            <Link to="/forgot-password" className="text-[13px] text-[#974FD0] hover:opacity-70 transition-opacity">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-3 pr-12 border rounded-[8px] text-[15px] text-gray-900 outline-none transition-colors placeholder:text-gray-300 ${
                errors.password ? "border-red-400" : "border-gray-200 focus:border-[#974FD0]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#974FD0] transition-colors"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>
          {errors.password && <span className="text-[12px] text-red-500">{errors.password}</span>}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-4 bg-[#974FD0] text-white rounded-[8px] text-[16px] font-[700] hover:bg-[#7d3db0] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Logging in...
            </span>
          ) : "Log in"}
        </button>

        <div className="flex items-center gap-3 my-1">
          <hr className="flex-1 border-gray-200" />
          <span className="text-[13px] text-gray-400">or</span>
          <hr className="flex-1 border-gray-200" />
        </div>

        <p className="text-center text-[14px] text-gray-400">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#974FD0] font-[600] hover:opacity-70 transition-opacity">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  </div>
)
}

export default LoginPage