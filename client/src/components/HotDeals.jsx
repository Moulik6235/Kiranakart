import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'

const HotDeals = () => {
    const { products, currency, addToCart, removeFromCart, cartItems } = useAppContext()
    
    // Timer countdown logic: simulate ending in 02:45:12
    const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 12 })

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 }
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
                }
                clearInterval(timer)
                return prev
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const formatNumber = (num) => String(num).padStart(2, '0')

    const dealProducts = products.filter(p => p.isDeal)

    if (dealProducts.length === 0) return null

    return (
        <div className="mt-12">
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <h3 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">Hot Deals</h3>
                <div className="bg-error-container text-error px-4 py-1.5 rounded-full flex items-center gap-1.5 font-bold text-xs uppercase tracking-wide">
                    <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    ENDS IN {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dealProducts.map((product) => {
                    const inCartCount = cartItems[product._id] || 0
                    return (
                        <div key={product._id} className="bg-surface-container-lowest p-5 rounded-3xl border border-outline-variant/15 flex gap-5 relative group hover:shadow-lg transition-all duration-300">
                            {/* Product Image Panel */}
                            <div className="w-1/3 aspect-square bg-surface-container rounded-2xl overflow-hidden flex items-center justify-center">
                                <img 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    src={product.image[0]} 
                                    alt={product.name} 
                                />
                            </div>

                            {/* Details Panel */}
                            <div className="flex flex-col justify-between py-1 flex-1">
                                <div>
                                    <span className="text-secondary text-[10px] font-black bg-secondary/10 px-2.5 py-1 rounded uppercase tracking-widest">
                                        {product.dealBadge}
                                    </span>
                                    <h4 className="font-extrabold text-base md:text-xl mt-2 text-on-surface leading-tight">
                                        {product.name}
                                    </h4>
                                    <p className="text-on-surface-variant font-semibold text-xs mt-1">
                                        {product.dealDescription}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-primary font-extrabold text-xl md:text-2xl">
                                            {currency}{product.offerPrice}
                                        </span>
                                        <span className="text-on-surface-variant font-bold text-xs line-through">
                                            {currency}{product.price}
                                        </span>
                                    </div>

                                    {/* Action Button */}
                                    <div>
                                        {inCartCount === 0 ? (
                                            <button 
                                                onClick={() => addToCart(product._id)}
                                                className="bg-primary hover:bg-primary-container text-white p-2.5 rounded-xl hover:shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"></path>
                                                </svg>
                                            </button>
                                        ) : (
                                            <div className="flex items-center bg-surface-container border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
                                                <button 
                                                    onClick={() => removeFromCart(product._id)}
                                                    className="px-3 py-1.5 text-on-surface hover:bg-outline-variant/30 font-extrabold text-sm active:scale-95 transition"
                                                >
                                                    -
                                                </button>
                                                <span className="px-2 font-black text-on-surface text-sm">{inCartCount}</span>
                                                <button 
                                                    onClick={() => addToCart(product._id)}
                                                    className="px-3 py-1.5 text-primary hover:bg-outline-variant/30 font-extrabold text-sm active:scale-95 transition"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default HotDeals
