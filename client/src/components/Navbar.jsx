import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/greencart_assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Navbar = () => {
    const [open, setOpen] = React.useState(false)
    const { user, setUser, setShowUserLogin, navigate, setSearchQuery, searchQuery, getCartCount, axios } = useAppContext();

    const logout = async () => {
        try {
            const { data } = await axios.get('/api/user/logout')
            if (data.success) {
                toast.success(data.message)
                setUser(null);
                navigate("/")
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }


    }

    useEffect(() => {
        if (searchQuery.length > 0) {
            navigate("/products")
        }
    }, [searchQuery])
    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-outline-variant bg-surface-container-lowest sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all">

            <NavLink to='/' onClick={() => setOpen(false)}>
                <img className="h-9" src={assets.logo} alt="logo" />
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <NavLink className="text-on-surface font-semibold hover:text-primary transition" to='/'>Home</NavLink>
                <NavLink className="text-on-surface font-semibold hover:text-primary transition" to='/products'>All Products</NavLink>
                <NavLink className="text-on-surface font-semibold hover:text-primary transition" to='/contact'>Contact</NavLink>

                <div className="hidden lg:flex items-center text-sm gap-2 border border-outline-variant bg-surface-container px-4 py-1.5 rounded-lg focus-within:border-primary transition shadow-inner">
                    <input onChange={(e) => setSearchQuery(e.target.value)} className="py-1 w-64 bg-transparent outline-none placeholder-outline text-on-surface font-medium" type="text" placeholder="Search fresh products..." />
                    <img src={assets.search_icon} alt='search-icon' className='w-4 h-4 opacity-70' />
                </div>

                <div onClick={() => navigate("/cart")} className="relative cursor-pointer bg-surface-container p-2 rounded-full hover:bg-surface-container-high transition">
                    <img src={assets.nav_cart_icon} alt='nav-cart-icon' className='w-6 opacity-80' />
                    <button className="absolute -top-1 -right-2 text-[10px] font-bold text-white bg-tertiary w-5 h-5 flex items-center justify-center rounded-full shadow-md">{getCartCount()}</button>
                </div>

                {!user ? (<button onClick={() => setShowUserLogin(true)} className="cursor-pointer px-6 py-2.5 bg-primary hover:bg-primary-container text-white font-bold rounded-lg shadow-sm transition">
                    Login / Sign up
                </button>)
                    :
                    (
                        <div className='relative group'>
                            <img src={assets.profile_icon} alt="profile-icon" className='w-10 h-10 rounded-full border border-outline-variant cursor-pointer object-cover' />
                            <ul className='hidden group-hover:block absolute top-12 right-0 bg-surface-container-lowest shadow-lg border border-outline-variant py-2 w-40 rounded-xl text-sm z-40 overflow-hidden' >
                                <li onClick={() => navigate("my-orders")} className='px-4 py-2 text-on-surface font-medium hover:bg-surface-container hover:text-primary cursor-pointer transition'>My Orders</li>
                                <li onClick={logout} className='px-4 py-2 text-error font-medium hover:bg-error-container cursor-pointer transition'>Logout</li>
                            </ul>
                        </div>
                    )}
            </div>
            <div className='flex items-center gap-6 sm:hidden'>
                <div onClick={() => navigate("/cart")} className="relative cursor-pointer bg-surface-container p-2 rounded-full">
                    <img src={assets.nav_cart_icon} alt='nav-cart-icon' className='w-6 opacity-80' />
                    <button className="absolute -top-1 -right-2 text-[10px] font-bold text-white bg-tertiary w-5 h-5 flex items-center justify-center rounded-full shadow-md">{getCartCount()}</button>
                </div>
                <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="p-1 bg-surface-container rounded-md">
                    {/* Menu Icon SVG */}
                    <img src={assets.menu_icon} alt='menu-icon' className="w-6" />
                </button>
            </div>


            {open && (
                <div className={`absolute top-[72px] left-0 w-full bg-surface-container-lowest shadow-lg border-b border-outline-variant py-6 flex flex-col items-start gap-4 px-6 text-base md:hidden z-50`}>
                    <NavLink className="text-on-surface font-bold w-full border-b border-outline-variant pb-2" to='/' onClick={() => setOpen(false)} >Home</NavLink>
                    <NavLink className="text-on-surface font-bold w-full border-b border-outline-variant pb-2" to='/products' onClick={() => setOpen(false)} >All Products</NavLink>
                    {user &&
                        <NavLink className="text-on-surface font-bold w-full border-b border-outline-variant pb-2" to='/' onClick={() => setOpen(false)} >My Orders</NavLink>
                    }
                    <NavLink className="text-on-surface font-bold w-full pb-2" to='/contact' onClick={() => setOpen(false)} >Contact</NavLink>

                    {!user ? (
                        <button onClick={() => {
                            setOpen(false);
                            setShowUserLogin(true)
                        }} className="cursor-pointer w-full py-3 mt-2 bg-primary text-white font-bold rounded-lg shadow-sm">
                            Login / Sign up
                        </button>
                    ) : (
                        <button onClick={logout} className="cursor-pointer w-full py-3 mt-2 bg-surface-container border border-outline-variant text-error font-bold rounded-lg shadow-sm">
                            Logout
                        </button>
                    )}

                </div>
            )}

        </nav>
    )
}

export default Navbar
