import React, { useRef } from 'react'
import { useAppContext } from '../context/AppContext'

const TrendingNow = () => {
    const { products, currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext()
    const scrollContainerRef = useRef(null)

    // Select the first few in-stock standard products (exclude deals)
    const trendingProducts = products
        .filter((p) => p.inStock && !p.isDeal)
        .slice(0, 8)

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            })
        }
    }

    if (trendingProducts.length === 0) return null

    return (
        <div className="mt-12">
            {/* Header with Navigation Controls */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">Trending Now</h3>
                <div className="flex gap-2.5">
                    <button 
                        onClick={() => scroll('left')}
                        className="w-10 h-10 rounded-full border border-outline-variant/15 flex items-center justify-center hover:bg-surface-container hover:border-primary/30 transition-all active:scale-90 cursor-pointer"
                        aria-label="Scroll left"
                    >
                        <svg className="w-5 h-5 text-on-surface" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
                        </svg>
                    </button>
                    <button 
                        onClick={() => scroll('right')}
                        className="w-10 h-10 rounded-full border border-outline-variant/15 flex items-center justify-center hover:bg-surface-container hover:border-primary/30 transition-all active:scale-90 cursor-pointer"
                        aria-label="Scroll right"
                    >
                        <svg className="w-5 h-5 text-on-surface" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Scrollable Container */}
            <div 
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto hide-scrollbar pb-6 py-2 select-none"
            >
                {trendingProducts.map((product) => {
                    const inCartCount = cartItems[product._id] || 0
                    
                    // Generate a smart unit descriptor if none exists (e.g. 500g, 1L)
                    let unit = "Pack"
                    if (product.name.toLowerCase().includes("1l") || product.name.toLowerCase().includes("1 l")) unit = "1 L • Fresh"
                    else if (product.name.toLowerCase().includes("500g")) unit = "500g • Organic"
                    else if (product.name.toLowerCase().includes("1 kg") || product.name.toLowerCase().includes("1kg")) unit = "1 kg • Farm Picked"
                    else if (product.name.toLowerCase().includes("200g")) unit = "200g • Premium"
                    else if (product.name.toLowerCase().includes("250g")) unit = "250g • Ground"
                    else if (product.name.toLowerCase().includes("150g")) unit = "150g • Roasted"
                    else if (product.name.toLowerCase().includes("100g")) unit = "100g • Natural"

                    return (
                        <div 
                            key={product._id} 
                            className="min-w-[240px] max-w-[240px] bg-white rounded-3xl border border-outline-variant/15 group hover:shadow-xl hover:border-primary/10 transition-all duration-300 p-3.5 flex flex-col justify-between"
                        >
                            {/* Image Panel */}
                            <div 
                                onClick={() => {
                                    navigate(`/products/${product.category.toLowerCase()}/${product._id}`)
                                    window.scrollTo(0, 0)
                                }}
                                className="relative h-44 bg-surface-container-low rounded-2xl mb-4 overflow-hidden cursor-pointer"
                            >
                                <img 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    src={product.image[0]} 
                                    alt={product.name} 
                                />
                                <div className="absolute top-3 left-3 bg-tertiary-fixed text-on-tertiary-fixed font-black text-[10px] px-2.5 py-1 rounded-lg uppercase tracking-wider shadow-sm">
                                    10 MIN
                                </div>
                            </div>

                            {/* Details Panel */}
                            <div className="flex flex-col flex-grow">
                                <h5 
                                    onClick={() => {
                                        navigate(`/products/${product.category.toLowerCase()}/${product._id}`)
                                        window.scrollTo(0, 0)
                                    }}
                                    className="font-bold text-sm text-on-surface leading-tight min-h-[36px] line-clamp-2 cursor-pointer hover:text-primary transition-colors"
                                >
                                    {product.name}
                                </h5>
                                <p className="text-on-surface-variant font-medium text-[11px] mt-1 mb-3">
                                    {unit}
                                </p>

                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-primary font-extrabold text-lg md:text-xl">
                                        {currency}{product.offerPrice}
                                    </span>

                                    {/* Action Controls */}
                                    <div>
                                        {inCartCount === 0 ? (
                                            <button 
                                                onClick={() => addToCart(product._id)}
                                                className="bg-primary hover:bg-primary-container text-white px-4.5 py-2.5 rounded-xl font-bold text-xs hover:shadow-md transition active:scale-95 cursor-pointer"
                                            >
                                                Add
                                            </button>
                                        ) : (
                                            <div className="flex items-center bg-surface-container border border-outline-variant/30 rounded-xl overflow-hidden shadow-sm">
                                                <button 
                                                    onClick={() => removeFromCart(product._id)}
                                                    className="px-2.5 py-1 text-on-surface hover:bg-outline-variant/30 font-extrabold text-sm active:scale-95 transition"
                                                >
                                                    -
                                                </button>
                                                <span className="px-1.5 font-black text-on-surface text-sm">{inCartCount}</span>
                                                <button 
                                                    onClick={() => addToCart(product._id)}
                                                    className="px-2.5 py-1 text-primary hover:bg-outline-variant/30 font-extrabold text-sm active:scale-95 transition"
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

export default TrendingNow
