import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {
    const { setShowUserLogin, setUser, axios, navigate, cartItems, setCartItems } = useAppContext()

    const [state, setState] = useState("login"); // "login", "register", "otp"
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);

    // OTP Specific states
    const [phone, setPhone] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpInputs, setOtpInputs] = useState(["", "", "", ""]);
    const [countdown, setCountdown] = useState(0);

    useEffect(() => {
        setAnimateIn(true);
    }, []);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleOtpChange = (value, index) => {
        if (isNaN(value)) return;
        const newOtp = [...otpInputs];
        newOtp[index] = value.substring(value.length - 1);
        setOtpInputs(newOtp);

        // Auto-focus next input field
        if (value && index < 3) {
            const nextInput = document.getElementById(`otp-input-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otpInputs[index] && index > 0) {
            const prevInput = document.getElementById(`otp-input-${index - 1}`);
            if (prevInput) {
                prevInput.focus();
                const newOtp = [...otpInputs];
                newOtp[index - 1] = "";
                setOtpInputs(newOtp);
            }
        }
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!phone || phone.length < 10) {
            toast.error("Please enter a valid 10-digit mobile number");
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.post('/api/user/send-otp', { phone });
            if (data.success) {
                setOtpSent(true);
                setCountdown(60);
                toast.success(data.message);
                if (data.otp) {
                    // Help user check the OTP immediately during development
                    toast(`ℹ️ Dev Mode OTP: ${data.otp}`, { icon: '🔑', duration: 8000 });
                }
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtpAndLogin = async (e) => {
        e.preventDefault();
        const otpCode = otpInputs.join("");
        if (otpCode.length < 4) {
            toast.error("Please enter the complete 4-digit code");
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.post('/api/user/verify-otp', { phone, otp: otpCode });
            if (data.success) {
                if (data.token) {
                    localStorage.setItem('kiranakart_token', data.token);
                }
                handleLoginSuccess(data.user);
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLoginSuccess = (userData) => {
        navigate('/');
        setUser(userData);
        if (userData.cartItems) {
            const mergedCart = { ...userData.cartItems };
            for (const key in cartItems) {
                if (mergedCart[key]) {
                    mergedCart[key] += cartItems[key];
                } else {
                    mergedCart[key] = cartItems[key];
                }
            }
            setCartItems(mergedCart);
        }
        toast.success("Logged in successfully!");
        setShowUserLogin(false);
    };

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();
            setLoading(true);

            const { data } = await axios.post(`/api/user/${state}`, {
                name, email, password
            })
            if (data.success) {
                if (data.token) {
                    localStorage.setItem('kiranakart_token', data.token);
                }
                handleLoginSuccess(data.user);
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
                        {state === "login" && "Welcome back!"}
                        {state === "register" && "Create your account"}
                        {state === "otp" && "Mobile OTP Login"}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {state === "login" && "Please sign in to access your cart & orders"}
                        {state === "register" && "Get started with KiranaKart today"}
                        {state === "otp" && (otpSent ? "Enter the 4-digit code sent to you" : "Enter your phone number to receive OTP")}
                    </p>
                </div>

                {/* 1. Mobile OTP verification form */}
                {state === "otp" ? (
                    <form onSubmit={otpSent ? handleVerifyOtpAndLogin : handleSendOtp} className="flex flex-col gap-4 relative z-10">
                        {!otpSent ? (
                            // Phase 1: Enter Phone Number
                            <div className="w-full">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Mobile Number</label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-4 flex items-center text-slate-700 font-extrabold text-sm border-r border-slate-200 pr-3">
                                        🇮🇳 +91
                                    </span>
                                    <input 
                                        onChange={(e) => setPhone(e.target.value)} 
                                        value={phone} 
                                        placeholder="Enter 10-digit number" 
                                        className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl pl-20 pr-4 py-3.5 outline-none text-slate-800 font-extrabold tracking-wide transition duration-200" 
                                        type="tel"
                                        maxLength="10"
                                        required 
                                    />
                                </div>
                            </div>
                        ) : (
                            // Phase 2: Enter 4-digit OTP Inputs
                            <div className="w-full text-center space-y-3">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider text-left ml-1">Enter Verification Code</label>
                                <div className="flex justify-center gap-3">
                                    {otpInputs.map((digit, idx) => (
                                        <input
                                            key={idx}
                                            id={`otp-input-${idx}`}
                                            type="text"
                                            maxLength="1"
                                            value={digit}
                                            onChange={e => handleOtpChange(e.target.value, idx)}
                                            onKeyDown={e => handleOtpKeyDown(e, idx)}
                                            className="w-12 h-14 text-center text-xl font-black text-slate-800 bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-2xl outline-none transition-all"
                                        />
                                    ))}
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1 pt-1">
                                    <span>Sent to +91 {phone}</span>
                                    {countdown > 0 ? (
                                        <span className="text-slate-400">Resend OTP in {countdown}s</span>
                                    ) : (
                                        <button 
                                            type="button"
                                            onClick={handleSendOtp} 
                                            className="text-indigo-600 hover:text-indigo-800 transition underline cursor-pointer"
                                        >
                                            Resend OTP
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

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
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <span>{otpSent ? "Verify & Login" : "Get OTP Verification Code"}</span>
                            )}
                        </button>

                        <div className="text-center mt-3 flex flex-col gap-2">
                            {otpSent && (
                                <button 
                                    type="button" 
                                    onClick={() => { setOtpSent(false); setOtpInputs(["", "", "", ""]); }}
                                    className="text-xs text-slate-500 hover:text-slate-700 font-bold transition underline"
                                >
                                    ✏️ Change mobile number
                                </button>
                            )}
                            <p className="text-sm text-slate-500 font-medium">
                                Prefer email login?{' '}
                                <span 
                                    onClick={() => setState("login")} 
                                    className="text-indigo-600 hover:text-indigo-800 font-bold cursor-pointer transition underline decoration-2 decoration-indigo-200 hover:decoration-indigo-600"
                                >
                                    Use Email/Password
                                </span>
                            </p>
                        </div>
                    </form>
                ) : (
                    // 2. Standard Email/Password forms (Login or Register)
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

                        {/* Switch to OTP Login option */}
                        <div className="flex items-center justify-center py-1.5 border-t border-slate-100">
                            <button 
                                type="button"
                                onClick={() => { setState("otp"); setOtpSent(false); }}
                                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/50 rounded-xl transition cursor-pointer select-none"
                            >
                                📲 Sign in using Mobile OTP
                            </button>
                        </div>

                        {/* Footer Toggle Links */}
                        <div className="text-center mt-1">
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
                )}
            </div>
        </div>
    )
}

export default Login
