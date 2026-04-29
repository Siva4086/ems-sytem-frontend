import { ArrowLeftIcon, EyeOffIcon,EyeIcon, Loader2Icon } from "lucide-react"
import { Link } from "react-router-dom"
import LoginLeftSide from "./LoginLeftSide"
import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const LoginForm = ({role, title, subtitle}) => {

     const [email, setEmail] = useState('')
     const [password, setPassword] = useState('')
     const [showPassword, setShowPassword] = useState(false)
     const [loading, setLoading] = useState(false)
     const [error, setError] = useState('')

     const { login } = useAuth();
     const  navigate = useNavigate();   

     const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try{
            const user = await login(email, password, role);
            if (user?.success === false) {
              toast.error(user.error);
              return;
            }else{
              toast.success("Login successful!");
              navigate("/dashboard");
            }
        }catch(err){
            setError(err.response?.data?.error || err?.message || "Login failed. Please try again.");
        } finally{
            setLoading(false);
        }
     } 

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
        <LoginLeftSide/>
        <div className="flex flex-1 items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md animate-fade-in">

        <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm mb-10 transition-colors">
        <ArrowLeftIcon size={16}/> Back to portals
        </Link>

        <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-medium text-zinc-800">{title}</h1>
            <p className="text-slate-500 text-sm sm:text-base mt-2">{subtitle}</p>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl  flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-rose-700 rounded-full mt-1.5 shrink-0"/>
                {error}
          </div>
       )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email address</label>
                <input 
                type="email"    
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="john@example.com"
                />
            </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                <input 
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="pr-11"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {showPassword ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
                </button>
                </div>

            </div>

             <button type="submit" disabled={loading} className="w-full bg-linear-to-r from-indigo-600 to-indigo-500 py-3 hover: from-indigo-700 to-indigo-600 text-white text-sm font-semibold py-2 rounded-md transition-all duration-200  disabled:opactity-50 shadow-lg shadow-indigo-500/25 active:scale-[0.98] flex items-center justify-center">
                {loading && <Loader2Icon className="animate-spin h-4 w-4 mr-2"/> } 
                Sign In
            </button>
        </form>


        </div> 
        </div>
    </div>
  )
}

export default LoginForm