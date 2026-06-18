import { useNavigate, useSearchParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { verifyEmail } from "../../Services/api"

const EmailVerifiedPage = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token") || ""
  const navigate = useNavigate()

  const { isLoading, isSuccess, isError } = useQuery({
    queryKey: ["verify-email", token],
    queryFn: () => verifyEmail(token),
    enabled: !!token,
    retry: false, 
    staleTime: Infinity,
  })

  return (
    <div className="font-[Signika-Negative] min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-[16px] border border-gray-200 w-full max-w-[560px] px-10 py-10 shadow-sm text-center">

        {isLoading && (
          <>
            <div className="flex justify-center mb-4">
              <div className="w-10 h-10 border-4 border-[#974FD0] border-t-transparent rounded-full animate-spin" />
            </div>
            <h1 className="text-[22px] font-[700] text-[#292929]">Verifying your email...</h1>
            <p className="text-[15px] text-gray-400 mt-2">Please wait a moment</p>
          </>
        )}

        {isSuccess && (
          <>
            <div className="text-[56px] mb-4">✅</div>
            <h1 className="text-[26px] font-[700] text-[#292929] mb-2">Email verified!</h1>
            <p className="text-[15px] text-gray-400 leading-relaxed mb-8">
              Your email has been successfully verified. You can now log in to your TaskDev account.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-4 bg-[#974FD0] text-white rounded-[8px] text-[16px] font-[700] hover:bg-[#7d3db0] transition-colors"
            >
              Go to Login
            </button>
          </>
        )}

        {isError && (
          <>
            <div className="text-[56px] mb-4">❌</div>
            <h1 className="text-[26px] font-[700] text-[#292929] mb-2">Verification failed</h1>
            <p className="text-[15px] text-gray-400 leading-relaxed mb-8">
              This link is invalid or has expired. Please register again to get a new verification link.
            </p>
            <button
              onClick={() => navigate("/register")}
              className="w-full py-4 bg-[#974FD0] text-white rounded-[8px] text-[16px] font-[700] hover:bg-[#7d3db0] transition-colors"
            >
              Back to Register
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 mt-3 text-[14px] font-[600] text-gray-400 hover:text-[#974FD0] transition-colors"
            >
              Try logging in
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default EmailVerifiedPage