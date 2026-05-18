import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {
    const { setShowUserLogin, setUser, axios, navigate, cartItems, setCartItems } = useAppContext()

    const [state, setState] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        setAnimateIn(true);
    }, []);

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();
            setLoading(true);

            const { data } = await axios.post(`/api/user/${state}`, {
                name, email, password
            })
            if (data.success) {
                navigate('/')
                setUser(data.user)
                if (data.user.cartItems) {
                    const mergedCart = { ...data.user.cartItems };
                    for (const key in cartItems) {
                        if (mergedCart[key]) {
                            mergedCart[key] += cartItems[key];
                        } else {
                            mergedCart[key] = cartItems[key];
                        }
                    }
                    setCartItems(mergedCart);
                }
                toast.success(state === "login" ? "Successfully Logged In!" : "Account Created Successfully!");
                setShowUserLogin(false)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setLoading(false);
        }
    }

    return (
        <div 
            onClick={() => setShowUserLogin(false)} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300"
        >
            <div 
                onSubmit={onSubmitHandler} 
                onClick={(e) => e.stopPropagation()} 
                className={`relative w-full max-w-md overflow-hidden rounded-3xl bg-white border border-slate-100 shadow-[0_20px_50px_rgba(79,70,229,0.15)] p-8 transition-all duration-500 transform ${
                    animateIn ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
                }`}
            >
                {/* Background soft glowing orb */}
                <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl"></div>
                <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-purple-500/10 blur-3xl"></div>

                {/* Close Button */}
                <button 
                    onClick={() => setShowUserLogin(false)} 
                    className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 p-2 rounded-full transition-colors cursor-pointer"
                    aria-label="Close modal"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Header Logo Visual */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3 shadow-inner">
                        <svg className="w-7 h-7 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        {state === "login" ? "Welcome back!" : "Create your account"}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {state === "login" ? "Please sign in to access your cart & orders" : "Get started with KiranaKart today"}
                    </p>
                </div>

                <form onSubmit={onSubmitHandler} className="flex flex-col gap-4 relative z-10">
                    {/* Name Input (Register Only) */}
                    {state === "register" && (
                        <div className="w-full">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Name</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                                <input 
                                    onChange={(e) => setName(e.target.value)} 
                                    value={name} 
                                    placeholder="Enter your name" 
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl pl-11 pr-4 py-3.5 outline-none text-slate-800 font-medium transition duration-200" 
                                    type="text" 
                                    required 
                                />
                            </div>
                        </div>
                    )}

                    {/* Email Input */}
                    <div className="w-full">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </span>
                            <input 
                                onChange={(e) => setEmail(e.target.value)} 
                                value={email} 
                                placeholder="you@example.com" 
                                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl pl-11 pr-4 py-3.5 outline-none text-slate-800 font-medium transition duration-200" 
                                type="email" 
                                required 
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="w-full">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </span>
                            <input 
                                onChange={(e) => setPassword(e.target.value)} 
                                value={password} 
                                placeholder="••••••••" 
                                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl pl-11 pr-12 py-3.5 outline-none text-slate-800 font-medium transition duration-200" 
                                type={showPassword ? "text" : "password"} 
                                required 
                            />
                            <button 
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button 
                        disabled={loading}
                        className={`w-full py-4 mt-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-2xl font-bold tracking-wide active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 ${
                            loading ? 'opacity-85 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Processing...</span>
                            </>
                        ) : (
                            <span>{state === "register" ? "Create Account" : "Sign In"}</span>
                        )}
                    </button>

                    {/* Footer Toggle Links */}
                    <div className="text-center mt-3">
                        {state === "register" ? (
                            <p className="text-sm text-slate-500 font-medium">
                                Already have an account?{' '}
                                <span 
                                    onClick={() => setState("login")} 
                                    className="text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer transition underline decoration-2 decoration-indigo-200 hover:decoration-indigo-600"
                                >
                                    Log in
                                </span>
                            </p>
                        ) : (
                            <p className="text-sm text-slate-500 font-medium">
                                Don't have an account?{' '}
                                <span 
                                    onClick={() => setState("register")} 
                                    className="text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer transition underline decoration-2 decoration-indigo-200 hover:decoration-indigo-600"
                                >
                                    Sign up
                                </span>
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login
