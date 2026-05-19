import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Navbar = () => {
    const [open, setOpen] = useState(false)
    const { 
        user, 
        setUser, 
        setShowUserLogin, 
        navigate, 
        setSearchQuery, 
        searchQuery, 
        getCartCount, 
        getCartAmount, 
        currency, 
        axios,
        addresses,
        setAddresses,
        selectedAddress,
        setSelectedAddress,
        deliveryTime,
        setDeliveryTime,
        getUserAddress,
        isSeller,
        setIsSeller,
        showHelpModal,
        setShowHelpModal,
        darkMode,
        setDarkMode
    } = useAppContext();

    const [showLocationModal, setShowLocationModal] = useState(false);
    const [searchLocationQuery, setSearchLocationQuery] = useState("");

    // Animated Placeholder for Search Input
    const placeholders = [
        'Search "chips"',
        'Search "milk"',
        'Search "bread"',
        'Search "eggs"',
        'Search "apples"',
        'Search "butter"',
        'Search "veggies"',
        'Search "ice cream"',
        'Search "paneer"'
    ];
    const [placeholderIdx, setPlaceholderIdx] = useState(0);

    const [searchQueryValue, setSearchQueryValue] = useState(
        typeof searchQuery === 'string' ? searchQuery : ''
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholderIdx((prev) => (prev + 1) % placeholders.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setSearchQuery(searchQueryValue);
    }, [searchQueryValue]);

    useEffect(() => {
        if (searchQuery && typeof searchQuery === 'string' && searchQuery.length > 0) {
            navigate("/products");
        }
    }, [searchQuery]);



    // Navigate to the seller portal (dashboard or login page)
    const goToSeller = () => {
        navigate("/seller");
    };

    const logout = async () => {
        try {
            const { data } = await axios.get('/api/user/logout')
            if (data.success) {
                toast.success(data.message)
                setUser(null);
                setSelectedAddress(null)
                navigate("/")
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <div className="w-full sticky top-0 z-50 bg-white border-b border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all">
            {/* Top Main Navbar Row */}
            <div className="flex items-center justify-between px-4 md:px-12 lg:px-24 py-3 gap-4">
                
                {/* Brand Logo & Address */}
                <div className="flex items-center">
                    <NavLink to='/' className="flex items-center shrink-0 select-none">
                        <span className="font-extrabold text-2xl md:text-3xl tracking-tight">
                            <span className="text-[#4F46E5]">kirana</span>
                            <span className="text-[#1E1B4B]">kart</span>
                        </span>
                    </NavLink>
                    
                    {/* Vertical Divider */}
                    <div className="hidden md:block h-9 w-[1px] bg-gray-200 mx-5"></div>
                    
                    {/* Delivery address widget */}
                    <div 
                        onClick={() => user ? setShowLocationModal(true) : setShowUserLogin(true)}
                        className="hidden md:flex flex-col text-left cursor-pointer shrink-0 select-none group relative"
                    >
                        <span className="text-[13px] font-extrabold text-gray-900 tracking-tight leading-tight">
                            Delivery in {deliveryTime} minutes
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-gray-700 transition duration-150 leading-tight mt-0.5">
                            <span className="max-w-[150px] md:max-w-[200px] truncate">
                                {selectedAddress 
                                    ? `${selectedAddress.street}, ${selectedAddress.city}` 
                                    : "LIG Housing Board Colony, Ch..."}
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-gray-800 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Desktop Search Bar (Centered, visible on large screens) */}
                <div className="flex-1 max-w-xl hidden lg:flex items-center gap-3 bg-[#F8F8F8] border border-gray-100 px-4 py-2.5 rounded-xl focus-within:border-gray-300 focus-within:bg-white focus-within:shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        value={searchQueryValue}
                        onChange={(e) => setSearchQueryValue(e.target.value)} 
                        className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 font-medium" 
                        type="text" 
                        placeholder={placeholders[placeholderIdx]} 
                    />
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4 md:gap-6">
                    
                    {/* Home & Products Links (Visible on medium up) */}
                    <div className="hidden sm:flex items-center gap-5 text-sm font-bold text-gray-600">
                        <NavLink className="hover:text-[#4F46E5] transition" to='/'>Home</NavLink>
                        <NavLink className="hover:text-[#4F46E5] transition" to='/products'>Products</NavLink>
                        <NavLink className="hover:text-[#4F46E5] transition" to='/contact'>Contact</NavLink>
                    </div>

                    {/* Account Dropdown */}
                    <div className="relative group flex items-center select-none cursor-pointer py-2">
                        <div className="flex items-center gap-1 font-bold text-gray-700 hover:text-gray-900 transition duration-150 text-sm md:text-base">
                            <span>{user ? `Hey, ${user.name.split(' ')[0]}` : "Account"}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-600 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {/* Account Dropdown Menu */}
                        <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl py-2 w-48 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all duration-200 z-50 origin-top-right before:content-[''] before:absolute before:-top-3 before:left-0 before:right-0 before:h-3">
                            {user ? (
                                <>
                                    <div className="px-4 py-2 border-b border-gray-50">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Signed in as</p>
                                        <p className="text-sm font-bold text-gray-800 truncate mt-0.5">{user.name}</p>
                                    </div>
                                    <button 
                                        onClick={() => navigate("my-orders")} 
                                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#4F46E5] transition duration-150 cursor-pointer"
                                    >
                                        My Orders
                                    </button>
                                    <button 
                                        onClick={() => navigate("rewards")} 
                                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#4F46E5] transition duration-150 cursor-pointer flex items-center gap-2"
                                    >
                                        <span className="text-xs">🎁</span>
                                        <span>Rewards & Offers</span>
                                    </button>
                                    <button 
                                        onClick={goToSeller} 
                                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#4F46E5] transition duration-150 cursor-pointer"
                                    >
                                        Seller Account
                                    </button>
                                    <button 
                                        onClick={() => setShowHelpModal(true)} 
                                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#4F46E5] transition duration-150 cursor-pointer flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Help & Support
                                    </button>
                                    <button 
                                        onClick={logout} 
                                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 transition duration-150 cursor-pointer border-t border-gray-50 mt-1"
                                    >
                                        Logout
                                    </button>
                                </> 
                            ) : (
                                <>
                                    <button 
                                        onClick={() => setShowUserLogin(true)} 
                                        className="w-full text-left px-4 py-3 text-sm font-bold text-white bg-[#4F46E5] hover:bg-[#4338CA] transition duration-150 text-center rounded-lg m-2 w-[calc(100%-16px)] cursor-pointer shadow-sm"
                                    >
                                        Login / Sign up
                                    </button>
                                    <button 
                                        onClick={goToSeller} 
                                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#4F46E5] transition duration-150 cursor-pointer border-t border-gray-50"
                                    >
                                        Seller Account
                                    </button>
                                    <button 
                                        onClick={() => setShowHelpModal(true)} 
                                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#4F46E5] transition duration-150 cursor-pointer flex items-center gap-2 border-t border-gray-50 mt-1 pt-1.5"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Help & Support
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Seamless Neon Dark Mode Toggle */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2.5 bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-150 dark:border-slate-700 rounded-xl transition duration-200 cursor-pointer shadow-3xs flex items-center justify-center shrink-0"
                        title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {darkMode ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                            </svg>
                        )}
                    </button>

                    <button 
                        onClick={() => {
                            if (!user) {
                                setShowUserLogin(true);
                            } else {
                                navigate("/cart");
                            }
                        }} 
                        className="flex items-center gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-extrabold px-4 py-2.5 md:px-5 md:py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 select-none cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        
                        <span className="text-xs md:text-sm tracking-wide shrink-0">
                            {getCartCount() > 0 
                                ? `${getCartCount()} Item${getCartCount() > 1 ? 's' : ''} · ${currency}${getCartAmount()}` 
                                : "My Cart"
                            }
                        </span>
                    </button>

                    {/* Hamburger menu button for small screens */}
                    <button 
                        onClick={() => setOpen(!open)} 
                        aria-label="Menu" 
                        className="p-2 hover:bg-gray-100 rounded-lg sm:hidden transition"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile/Tablet Search Bar row (visible below navbar on small screens) */}
            <div className="px-4 pb-3 lg:hidden">
                <div className="w-full flex items-center gap-3 bg-[#F8F8F8] border border-gray-100 px-4 py-2.5 rounded-xl focus-within:border-gray-300 focus-within:bg-white transition duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                        value={searchQueryValue}
                        onChange={(e) => setSearchQueryValue(e.target.value)} 
                        className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 font-medium" 
                        type="text" 
                        placeholder={placeholders[placeholderIdx]} 
                    />
                </div>
            </div>

            {/* Responsive Side Drawer / Menu Mobile */}
            {open && (
                <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 py-6 flex flex-col gap-4 px-6 text-base sm:hidden z-50 animate-fadeIn">
                    {/* Delivery Address widget in mobile drawer */}
                    <div 
                        onClick={() => { setOpen(false); user ? setShowLocationModal(true) : setShowUserLogin(true); }}
                        className="flex flex-col text-left py-2 border-b border-gray-50 cursor-pointer"
                    >
                        <span className="text-[12px] font-extrabold text-gray-900 leading-tight">
                            Delivery in {deliveryTime} minutes
                        </span>
                        <div className="flex items-center gap-1 text-[11px] font-medium text-gray-500 mt-1">
                            <span className="truncate">
                                {selectedAddress 
                                    ? `${selectedAddress.street}, ${selectedAddress.city}` 
                                    : "LIG Housing Board Colony, Ch..."}
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>

                    <NavLink className="text-gray-700 font-bold w-full border-b border-gray-50 pb-2 hover:text-[#4F46E5] transition" to='/' onClick={() => setOpen(false)} >Home</NavLink>
                    <NavLink className="text-gray-700 font-bold w-full border-b border-gray-50 pb-2 hover:text-[#4F46E5] transition" to='/products' onClick={() => setOpen(false)} >All Products</NavLink>
                    <NavLink className="text-gray-700 font-bold w-full border-b border-gray-50 pb-2 hover:text-[#4F46E5] transition" to='/contact' onClick={() => setOpen(false)} >Contact Us</NavLink>
                    
                    {user ? (
                        <>
                            <NavLink className="text-gray-700 font-bold w-full border-b border-gray-50 pb-2 hover:text-[#4F46E5] transition" to='/my-orders' onClick={() => setOpen(false)} >My Orders</NavLink>
                            <button className="text-gray-700 font-bold w-full border-b border-gray-50 pb-2 hover:text-[#4F46E5] transition text-left cursor-pointer flex items-center gap-2" onClick={() => { setOpen(false); setShowHelpModal(true); }} >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Help & Support
                            </button>
                            <button className="text-gray-700 font-bold w-full border-b border-gray-50 pb-2 hover:text-[#4F46E5] transition text-left cursor-pointer" onClick={() => { setOpen(false); goToSeller(); }} >Seller Account</button>
                        </>
                    ) : (
                        <>
                            <button className="text-gray-700 font-bold w-full border-b border-gray-50 pb-2 hover:text-[#4F46E5] transition text-left cursor-pointer flex items-center gap-2" onClick={() => { setOpen(false); setShowHelpModal(true); }} >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Help & Support
                            </button>
                            <button className="text-gray-700 font-bold w-full border-b border-gray-50 pb-2 hover:text-[#4F46E5] transition text-left cursor-pointer" onClick={() => { setOpen(false); goToSeller(); }} >Seller Account</button>
                        </>
                    )}

                    {!user ? (
                        <button 
                            onClick={() => { setOpen(false); setShowUserLogin(true); }} 
                            className="w-full py-3 bg-[#4F46E5] text-white font-extrabold rounded-xl shadow-sm hover:bg-[#4338CA] transition cursor-pointer"
                        >
                            Login / Sign up
                        </button>
                    ) : (
                        <button 
                            onClick={() => { setOpen(false); logout(); }} 
                            className="w-full py-3 bg-red-50 text-red-600 font-extrabold rounded-xl hover:bg-red-100 transition cursor-pointer"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
            {/* Sleek Change Location Right Drawer */}
            {showLocationModal && (
                <div className="fixed inset-0 z-[100] flex justify-end">
                    {/* Backdrop Overlay */}
                    <div 
                        onClick={() => setShowLocationModal(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
                    ></div>
                    
                    {/* Drawer Container */}
                    <div className="relative w-full max-w-md h-full bg-[#F4F6F8] shadow-2xl flex flex-col z-10 animate-slideInRight overflow-y-auto">
                        
                        {/* Drawer Header */}
                        <div className="bg-white px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
                            <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Change Location</h2>
                            <button 
                                onClick={() => setShowLocationModal(false)}
                                className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition cursor-pointer"
                                aria-label="Close panel"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        {/* Drawer Body */}
                        <div className="p-6 space-y-6">
                            
                            {/* Location detection / Search area */}
                            <div className="bg-white p-5 rounded-3xl border border-gray-100/80 shadow-xs space-y-4">
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={async () => {
                                            toast.loading("Detecting your location...", { id: "gps" });
                                            setTimeout(() => {
                                                toast.success("Location detected successfully!", { id: "gps" });
                                                const mockDetected = {
                                                    _id: "gps-detected",
                                                    firstName: user?.firstName || "Guest",
                                                    lastName: user?.lastName || "",
                                                    email: user?.email || "",
                                                    street: "Sector 52 LIG Housing Board Complex",
                                                    city: "Chandigarh",
                                                    state: "Chandigarh",
                                                    zipcode: 160052,
                                                    country: "India",
                                                    phone: user?.phone || "0000000000",
                                                    category: "home"
                                                };
                                                setSelectedAddress(mockDetected);
                                                setDeliveryTime(15); // Fast detected delivery
                                                setShowLocationModal(false);
                                            }, 1200);
                                        }}
                                        className="bg-[#0F766E] hover:bg-[#0D625B] active:scale-95 text-white font-extrabold px-5 py-3 rounded-xl transition text-sm flex items-center gap-2 cursor-pointer shadow-xs"
                                    >
                                        Detect my location
                                    </button>
                                    
                                    <div className="flex items-center gap-2 flex-1">
                                        <div className="h-[1px] bg-gray-200 flex-1"></div>
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 border border-gray-100 px-2 py-1 rounded-full">OR</span>
                                        <div className="h-[1px] bg-gray-200 flex-1"></div>
                                    </div>
                                </div>

                                {/* Search box */}
                                <div className="relative">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input 
                                        type="text" 
                                        value={searchLocationQuery}
                                        onChange={(e) => setSearchLocationQuery(e.target.value)}
                                        placeholder="search delivery location" 
                                        className="w-full bg-gray-50/50 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl pl-11 pr-4 py-3 outline-none text-gray-800 font-semibold transition"
                                    />
                                </div>
                            </div>

                            {/* Saved Addresses Section */}
                            <div className="space-y-4">
                                <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block ml-1">Your saved addresses</span>
                                
                                {addresses.filter(addr => {
                                    const q = searchLocationQuery.toLowerCase();
                                    return (
                                        (addr.category || 'home').toLowerCase().includes(q) ||
                                        (addr.street || '').toLowerCase().includes(q) ||
                                        (addr.city || '').toLowerCase().includes(q) ||
                                        (addr.state || '').toLowerCase().includes(q)
                                    );
                                }).length > 0 ? (
                                    <div className="space-y-3.5">
                                        {addresses.filter(addr => {
                                            const q = searchLocationQuery.toLowerCase();
                                            return (
                                                (addr.category || 'home').toLowerCase().includes(q) ||
                                                (addr.street || '').toLowerCase().includes(q) ||
                                                (addr.city || '').toLowerCase().includes(q) ||
                                                (addr.state || '').toLowerCase().includes(q)
                                            );
                                        }).map((addr) => {
                                            const isHome = (addr.category || 'home').toLowerCase() === 'home';
                                            const isWork = (addr.category || '').toLowerCase() === 'work';
                                            
                                            return (
                                                <div 
                                                    key={addr._id}
                                                    onClick={() => {
                                                        setSelectedAddress(addr);
                                                        const times = [12, 18, 23, 27, 32];
                                                        const randomTime = times[Math.floor(Math.random() * times.length)];
                                                        setDeliveryTime(randomTime);
                                                        toast.success(`Delivery address switched to ${(addr.category || 'home').toUpperCase()}!`);
                                                        setShowLocationModal(false);
                                                    }}
                                                    className="bg-white p-5 rounded-3xl border border-gray-100 hover:border-indigo-200 shadow-xs hover:shadow-md cursor-pointer transition-all duration-200 group flex items-start gap-4 select-none relative"
                                                >
                                                    {/* Left Category Icon */}
                                                    <div className={`p-3.5 rounded-2xl flex items-center justify-center shrink-0 ${isHome ? 'bg-amber-50 text-amber-500' : isWork ? 'bg-blue-50 text-blue-500' : 'bg-indigo-50 text-indigo-500'}`}>
                                                        {isHome ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                            </svg>
                                                        ) : isWork ? (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                            </svg>
                                                        ) : (
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                        )}
                                                    </div>

                                                    {/* Right Detailed Address text */}
                                                    <div className="flex-1 min-w-0 pr-8">
                                                        <h4 className={`text-base font-extrabold tracking-tight capitalize ${isHome ? 'text-amber-800' : isWork ? 'text-blue-800' : 'text-indigo-800'}`}>
                                                            {addr.category || 'home'}
                                                        </h4>
                                                        <p className="text-xs font-bold text-gray-500 mt-1 leading-relaxed line-clamp-2">
                                                            {addr.street}, {addr.city}, {addr.state}, {addr.country}
                                                        </p>
                                                        
                                                        {/* Edit & Delete Action Buttons under address text */}
                                                        <div className="flex items-center gap-3 mt-3.5">
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setShowLocationModal(false);
                                                                    navigate(`/add-address`);
                                                                }}
                                                                className="w-8 h-8 rounded-full bg-green-50 hover:bg-green-100 flex items-center justify-center text-green-600 transition shadow-xs cursor-pointer border border-green-100"
                                                                aria-label="Edit address"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                                </svg>
                                                            </button>
                                                            <button 
                                                                onClick={async (e) => {
                                                                    e.stopPropagation();
                                                                    try {
                                                                        const { data } = await axios.post('/api/address/delete', { addressId: addr._id });
                                                                        if (data.success) {
                                                                            toast.success("Address deleted successfully!");
                                                                            getUserAddress(); // Refresh addresses list
                                                                        } else {
                                                                            toast.error(data.message);
                                                                        }
                                                                    } catch (error) {
                                                                        toast.error(error.message);
                                                                    }
                                                                }}
                                                                className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-600 transition shadow-xs cursor-pointer border border-red-100"
                                                                aria-label="Delete address"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="bg-white p-8 rounded-3xl border border-gray-100/80 shadow-xs text-center">
                                        <p className="text-xs font-extrabold text-gray-400">No matching addresses found</p>
                                    </div>
                                )}

                                {/* Add Address shortcut */}
                                <button 
                                    onClick={() => {
                                        setShowLocationModal(false);
                                        navigate("/add-address");
                                    }}
                                    className="w-full bg-white border border-dashed border-indigo-200 text-indigo-600 hover:bg-indigo-50/30 py-3.5 rounded-2xl font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-xs mt-4"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add a new address
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar
