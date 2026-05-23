import React from "react";
import { assets } from "../assets/greencart_assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
    const { currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext()

    const isOutOfStock = product && product.stock !== undefined && product.stock <= 0;

    return product && (
        <div onClick={() => { navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0) }} className="relative border border-outline-variant rounded-2xl md:p-4 p-3 bg-surface-container-lowest min-w-45 max-w-64 w-full shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all cursor-pointer">
            
            {/* Out of Stock Pill Overlay */}
            {isOutOfStock ? (
                <div className="absolute top-3 left-3 bg-[#4D4D4D] text-white text-[10px] font-black px-2.5 py-1 rounded shadow-sm z-10 select-none">
                    Out of stock
                </div>
            ) : product.price > product.offerPrice && (
                /* Discount Badge */
                <div className="absolute top-3 left-3 bg-tertiary text-on-tertiary text-[10px] font-bold px-2 py-1 rounded z-10">
                    {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
                </div>
            )}

            {/* Wishlist Heart Icon (Top-Right, matching image) */}
            <div 
                onClick={(e) => {
                    e.stopPropagation();
                    toast.success(`Added "${product.name}" to your wishlist!`);
                }}
                className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white p-1.5 rounded-full shadow-sm text-gray-400 hover:text-rose-500 transition cursor-pointer"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
            </div>

            <div className={`group flex items-center justify-center p-4 h-40 transition-all duration-300 ${isOutOfStock ? 'opacity-40 filter grayscale' : ''}`}>
                <img className="group-hover:scale-110 transition-transform duration-300 max-w-full max-h-full object-contain" src={product.image[0]} alt={product.name} />
            </div>
            
            <div className="flex flex-col gap-1 mt-2">
                <p className="text-outline text-xs font-semibold uppercase tracking-wider">{product.category}</p>
                <p className="text-on-surface font-bold text-base md:text-lg leading-tight line-clamp-2 min-h-[44px]">
                    {product.name}
                    {product.quantityValue && product.unit ? ` (${product.quantityValue} ${product.unit})` : ''}
                </p>
                
                <div className="flex items-center gap-1 mt-1 mb-2">
                    {Array(5).fill('').map((_, i) => (
                        <img key={i} className="md:w-3.5 w-3" src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="rating" />
                    ))}
                    <span className="text-outline text-xs font-medium ml-1">(4)</span>
                </div>
                
                <div className="flex items-end justify-between mt-auto">
                    <div className="flex flex-col">
                        {product.price > product.offerPrice && (
                            <p className="text-outline text-xs line-through">{currency}{product.price}</p>
                        )}
                        <p className="md:text-xl text-on-surface font-extrabold">
                            {currency}{product.offerPrice}
                        </p>
                    </div>
                    
                    <div onClick={(e) => { e.stopPropagation(); }}>
                        {isOutOfStock ? (
                            <button 
                                onClick={() => toast.success(`We will notify you when "${product.name}" is back in stock!`)}
                                className="flex items-center justify-center border-2 border-emerald-600 hover:bg-emerald-50 text-emerald-600 font-extrabold px-4.5 py-2.5 rounded-xl transition active:scale-95 cursor-pointer bg-white shadow-3xs text-xs"
                            >
                                Notify
                            </button>
                        ) : !cartItems[product._id] ? (
                            <button className="flex items-center justify-center bg-primary hover:bg-primary-container text-white font-bold px-4 py-2 rounded-lg shadow-sm transition active:scale-95 cursor-pointer" onClick={() => addToCart(product._id)}>
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-between w-[88px] h-[36px] bg-surface-container border border-outline-variant rounded-lg overflow-hidden select-none">
                                <button onClick={() => removeFromCart(product._id)} className="w-8 h-full flex items-center justify-center text-on-surface hover:bg-outline-variant transition active:bg-outline cursor-pointer">
                                    -
                                </button>
                                <span className="font-bold text-on-surface text-sm">{cartItems[product._id]}</span>
                                <button onClick={() => addToCart(product._id)} className="w-8 h-full flex items-center justify-center text-primary font-bold hover:bg-outline-variant transition active:bg-outline cursor-pointer">
                                    +
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;