import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { categories } from '../assets/greencart_assets/assets'
import toast from 'react-hot-toast'
import { useLocation } from 'react-router-dom'

const BottomNavigation = () => {
    const { 
        navigate, 
        user, 
        setShowUserLogin, 
        axios, 
        cartItems, 
        addToCart, 
        updateCartItem, 
        currency 
    } = useAppContext()

    const [activeTab, setActiveTab] = useState('home')
    const [showCategories, setShowCategories] = useState(false)
    const [showBuyAgain, setShowBuyAgain] = useState(false)
    const [myOrders, setMyOrders] = useState([])

    // Fetch order history to compute previously ordered products
    const fetchOrderHistory = async () => {
        if (!user) return
        try {
            const { data } = await axios.get('/api/order/user')
            if (data.success) {
                setMyOrders(data.orders || [])
            }
        } catch (error) {
            console.error("Error fetching order history in bottom nav:", error.message)
        }
    }

    useEffect(() => {
        if (user) {
            fetchOrderHistory()
        } else {
            setMyOrders([])
        }
    }, [user])

    // Compute unique previously ordered products from order history
    const previouslyOrderedProducts = []
    const seenIds = new Set()
    myOrders.forEach(order => {
        if (order.items) {
            order.items.forEach(item => {
                if (item.product && !seenIds.has(item.product._id)) {
                    seenIds.add(item.product._id)
                    previouslyOrderedProducts.push(item.product)
                }
            })
        }
    })

    const handleTabClick = (tab) => {
        setActiveTab(tab)
        if (tab === 'home') {
            setShowCategories(false)
            setShowBuyAgain(false)
            navigate('/')
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } else if (tab === 'categories') {
            setShowCategories(true)
            setShowBuyAgain(false)
        } else if (tab === 'buy-again') {
            setShowCategories(false)
            setShowBuyAgain(true)
            if (user) {
                fetchOrderHistory()
            }
        }
    }

    const closeOverlays = () => {
        setShowCategories(false)
        setShowBuyAgain(false)
        setActiveTab('home')
    }

    return (
        <>
            {/* Backdrop Blur Overlay when Category or Buy Again sheet is open */}
            {(showCategories || showBuyAgain) && (
                <div 
                    onClick={closeOverlays}
                    className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity duration-300 animate-fadeIn sm:hidden"
                />
            )}

            {/* 1. Category Slide-up Drawer Sheet */}
            {showCategories && (
                <div className="fixed bottom-[64px] left-0 right-0 bg-white rounded-t-3xl border-t border-gray-100 z-50 p-5 flex flex-col shadow-[0_-8px_30px_rgba(0,0,0,0.12)] max-h-[75vh] overflow-y-auto sm:hidden animate-slideUp select-none">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Shop by Category</span>
                        <button 
                            onClick={closeOverlays}
                            className="p-1 text-gray-400 hover:text-gray-600 transition active:scale-90"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-y-6 gap-x-4 pt-5 pb-2">
                        {categories.map((cat, idx) => (
                            <div 
                                key={idx}
                                onClick={() => {
                                    navigate(`/products/${cat.path.toLowerCase()}`)
                                    closeOverlays()
                                }}
                                className="flex flex-col items-center gap-2 group cursor-pointer text-center active:scale-95 transition duration-150"
                            >
                                <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shadow-xs">
                                    <img src={cat.image} alt={cat.text} className="w-10 h-10 object-contain" />
                                </div>
                                <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight truncate max-w-[85px]">
                                    {cat.path}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 2. Buy Again (Re-order) Slide-up Drawer Sheet */}
            {showBuyAgain && (
                <div className="fixed bottom-[64px] left-0 right-0 bg-white rounded-t-3xl border-t border-gray-100 z-50 p-5 flex flex-col shadow-[0_-8px_30px_rgba(0,0,0,0.12)] max-h-[75vh] overflow-y-auto sm:hidden animate-slideUp select-none">
                    <div className="flex items-center justify-between pb-3 border-b border-gray-50">
                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Buy It Again</span>
                        <button 
                            onClick={closeOverlays}
                            className="p-1 text-gray-400 hover:text-gray-600 transition active:scale-90"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="pt-4 pb-2">
                        {!user ? (
                            <div className="py-8 text-center flex flex-col items-center">
                                <span className="text-3xl">🔒</span>
                                <h4 className="font-extrabold text-slate-800 text-sm mt-3">Authentication Required</h4>
                                <p className="text-xs text-gray-400 mt-1 max-w-[240px] leading-relaxed">
                                    Sign in to view the groceries you previously purchased and instantly add them back to your cart.
                                </p>
                                <button
                                    onClick={() => {
                                        closeOverlays()
                                        setShowUserLogin(true)
                                    }}
                                    className="mt-4 px-6 py-2 bg-[#4F46E5] text-white text-xs font-bold rounded-xl active:scale-95 transition shadow-sm cursor-pointer"
                                >
                                    Log In / Sign Up
                                </button>
                            </div>
                        ) : previouslyOrderedProducts.length === 0 ? (
                            <div className="py-8 text-center flex flex-col items-center">
                                <span className="text-3xl">🛒</span>
                                <h4 className="font-extrabold text-slate-800 text-sm mt-3">No Past Orders Found</h4>
                                <p className="text-xs text-gray-400 mt-1 max-w-[240px] leading-relaxed">
                                    Your order history is currently empty. Shop our premium categories to start building your personalized Buy Again shelf!
                                </p>
                                <button
                                    onClick={() => {
                                        navigate('/products')
                                        closeOverlays()
                                    }}
                                    className="mt-4 px-6 py-2 bg-[#4F46E5] text-white text-xs font-bold rounded-xl active:scale-95 transition shadow-sm cursor-pointer"
                                >
                                    Browse All Products
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
                                {previouslyOrderedProducts.map((product) => {
                                    const qty = cartItems[product._id] || 0
                                    const originalPrice = product.price && product.price > product.offerPrice ? product.price : product.offerPrice + 15
                                    return (
                                        <div key={product._id} className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                                            <div 
                                                onClick={() => {
                                                    navigate(`/products/${product.category.toLowerCase()}/${product._id}`)
                                                    closeOverlays()
                                                }}
                                                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                                            >
                                                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center p-1 shrink-0">
                                                    <img className="max-w-full max-h-full object-contain" src={product.image[0]} alt={product.name} />
                                                </div>
                                                <div className="min-w-0 flex-1 text-left">
                                                    <h4 className="font-extrabold text-slate-800 text-xs leading-tight truncate">
                                                        {product.name}
                                                    </h4>
                                                    <p className="text-[10px] font-bold text-gray-400 mt-0.5">
                                                        {product.quantityValue && product.unit ? `${product.quantityValue} ${product.unit}` : (product.weight || "1 unit")}
                                                    </p>
                                                    <div className="flex items-center gap-1.5 mt-0.5">
                                                        <span className="font-extrabold text-xs text-slate-900">{currency}{product.offerPrice}</span>
                                                        <span className="text-[9px] font-bold text-gray-400 line-through">{currency}{originalPrice}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Quantity Pill Add / Action */}
                                            <div className="shrink-0">
                                                {qty === 0 ? (
                                                    <button
                                                        onClick={() => addToCart(product._id)}
                                                        className="px-3.5 py-1 bg-white border border-[#4F46E5] text-[#4F46E5] hover:bg-indigo-50 font-extrabold text-[10px] rounded-lg transition active:scale-95 cursor-pointer shadow-3xs"
                                                    >
                                                        + ADD
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center bg-[#4F46E5] text-white px-2 py-1 rounded-lg gap-2 shadow-xs">
                                                        <button 
                                                            onClick={() => updateCartItem(product._id, qty - 1)}
                                                            className="hover:opacity-80 font-black text-[10px] w-3 text-center cursor-pointer select-none"
                                                        >
                                                            -
                                                        </button>
                                                        <span className="font-extrabold text-[10px] w-3 text-center select-none">{qty}</span>
                                                        <button 
                                                            onClick={() => updateCartItem(product._id, qty + 1)}
                                                            className="hover:opacity-80 font-black text-[10px] w-3 text-center cursor-pointer select-none"
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 3. Fixed Bottom Tab Navigation Bar on Mobile */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-150 py-2 flex justify-around items-center sm:hidden z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] select-none">
                
                {/* Home Tab */}
                <button 
                    onClick={() => handleTabClick('home')}
                    className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors duration-150 ${activeTab === 'home' ? 'text-[#e11d48]' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill={activeTab === 'home' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <span className="text-[10px] font-black tracking-tight leading-none">Home</span>
                </button>

                {/* Categories Tab */}
                <button 
                    onClick={() => handleTabClick('categories')}
                    className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors duration-150 ${activeTab === 'categories' ? 'text-[#e11d48]' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" />
                        <rect x="14" y="14" width="7" height="7" />
                        <rect x="3" y="14" width="7" height="7" />
                    </svg>
                    <span className="text-[10px] font-black tracking-tight leading-none">Categories</span>
                </button>

                {/* Buy Again / Re-order Tab */}
                <button 
                    onClick={() => handleTabClick('buy-again')}
                    className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors duration-150 ${activeTab === 'buy-again' ? 'text-[#e11d48]' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        <path d="M12 13a2 2 0 11-2 2" />
                    </svg>
                    <span className="text-[10px] font-black tracking-tight leading-none">Buy Again</span>
                </button>

            </div>
        </>
    )
}

export default BottomNavigation
