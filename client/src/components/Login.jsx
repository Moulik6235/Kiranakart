import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Login = () => {
    const { setShowUserLogin, setUser, axios, navigate, cartItems, setCartItems } = useAppContext()

    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmitHandler = async (event) => {
        try {
            event.preventDefault();

            const { data } = await axios.post(`/api/user/${state}`, {
                name, email, password
            })
            if(data.success){
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
                setShowUserLogin(false)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    return (
        <div onClick={() => setShowUserLogin(false)} className='fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center bg-black/60 backdrop-blur-sm transition-all'>
            <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-5 m-auto items-start p-8 w-80 sm:w-[380px] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-outline-variant bg-surface-container-lowest">
                <p className="text-3xl font-extrabold m-auto text-on-surface">
                    <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
                </p>
                {state === "register" && (
                    <div className="w-full">
                        <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Name</p>
                        <input onChange={(e) => setName(e.target.value)} value={name} placeholder="Your name" className="w-full bg-surface-container-high border border-transparent focus:border-primary rounded-lg p-3 outline-none text-on-surface font-medium transition" type="text" required />
                    </div>
                )}
                <div className="w-full">
                    <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Email</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="you@example.com" className="w-full bg-surface-container-high border border-transparent focus:border-primary rounded-lg p-3 outline-none text-on-surface font-medium transition" type="email" required />
                </div>
                <div className="w-full">
                    <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} placeholder="••••••••" className="w-full bg-surface-container-high border border-transparent focus:border-primary rounded-lg p-3 outline-none text-on-surface font-medium transition" type="password" required />
                </div>
                {state === "register" ? (
                    <p className="text-sm font-medium text-on-surface-variant">
                        Already have an account? <span onClick={() => setState("login")} className="text-primary hover:text-primary-container font-bold cursor-pointer transition">Log in</span>
                    </p>
                ) : (
                    <p className="text-sm font-medium text-on-surface-variant">
                        Don't have an account? <span onClick={() => setState("register")} className="text-primary hover:text-primary-container font-bold cursor-pointer transition">Sign up</span>
                    </p>
                )}
                <button className="bg-primary hover:bg-primary-container active:scale-95 transition-all text-white font-bold w-full py-3 mt-2 rounded-lg cursor-pointer shadow-sm">
                    {state === "register" ? "Create Account" : "Login"}
                </button>
            </form>
        </div>
    )
}

export default Login
