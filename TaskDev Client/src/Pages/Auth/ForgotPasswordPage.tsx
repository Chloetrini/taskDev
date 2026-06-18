import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { forgotPassword } from "../../Services/api"
import logo from "/src/assets/logo.png"

const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!email.trim()) { setError("Email is required"); return }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError("Enter a valid email"); return }
    setSubmitting(true)
    await forgotPassword({ email })
    setSubmitting(false)
    setSubmitted(true)
  }

  return (
    <div className="font-[Signika-Negative] min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-[16px] border border-gray-200 w-full max-w-[520px] px-10 py-10 shadow-sm">

        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="logo" className="w-[40px] h-[45px] mb-3 cursor-pointer" onClick={() => navigate("/")} />
          {!submitted ? (
            <>
              <h1 className="text-[26px] font-[700] text-[#292929]">Forgot password?</h1>
              <p className="text-[15px] text-gray-400 mt-1 text-center">
                Enter your email and we'll send you a reset link
              </p>
            </>
          ) : (
            <>
              <h1 className="text-[24px] font-[700] text-[#292929]">Reset link sent!</h1>
              <p className="text-[15px] text-gray-400 mt-1 text-center">
                Check your inbox for the password reset link
              </p>
            </>
          )}
        </div>

        {!submitted ? (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[15px] font-[500] text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError("") }}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 border rounded-[8px] text-[15px] text-gray-900 outline-none transition-colors placeholder:text-gray-300 ${
                  error ? "border-red-400" : "border-gray-200 focus:border-[#974FD0]"
                }`}
              />
              {error && <span className="text-[12px] text-red-500">{error}</span>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full py-4 bg-[#974FD0] text-white rounded-[8px] text-[16px] font-[700] hover:bg-[#7d3db0] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </span>
              ) : "Send reset link"}
            </button>

            <p className="text-center text-[14px] text-gray-400">
              Remember your password?{" "}
              <Link to="/login" className="text-[#974FD0] font-[600] hover:opacity-70 transition-opacity">
                Log in
              </Link>
            </p>
          </div>
        ) : (
          <Link
            to="/login"
            className="block w-full py-4 bg-[#974FD0] text-white rounded-[8px] text-[16px] font-[700] hover:bg-[#7d3db0] transition-colors text-center"
          >
            Back to Login
          </Link>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordPage