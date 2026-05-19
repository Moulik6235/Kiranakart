import React from "react";
import { assets } from "../assets/greencart_assets/assets";
import { useAppContext } from "../context/AppContext";

const ProductCard = ({ product }) => {
    const { currency, addToCart, removeFromCart, cartItems, navigate } = useAppContext()



    return product && (
        <div onClick={() => { navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0) }} className="relative border border-outline-variant rounded-2xl md:p-4 p-3 bg-surface-container-lowest min-w-45 max-w-64 w-full shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all cursor-pointer">
            
            {/* Discount Badge */}
            {product.price > product.offerPrice && (
                <div className="absolute top-3 right-3 bg-tertiary text-on-tertiary text-[10px] font-bold px-2 py-1 rounded">
                    {Math.round(((product.price - product.offerPrice) / product.price) * 100)}% OFF
                </div>
            )}

            <div className="group flex items-center justify-center p-4 h-40">
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
                        {!cartItems[product._id] ? (
                            <button className="flex items-center justify-center bg-primary hover:bg-primary-container text-white font-bold px-4 py-2 rounded-lg shadow-sm transition active:scale-95" onClick={() => addToCart(product._id)}>
                                Add
                            </button>
                        ) : (
                            <div className="flex items-center justify-between w-[88px] h-[36px] bg-surface-container border border-outline-variant rounded-lg overflow-hidden select-none">
                                <button onClick={() => removeFromCart(product._id)} className="w-8 h-full flex items-center justify-center text-on-surface hover:bg-outline-variant transition active:bg-outline">
                                    -
                                </button>
                                <span className="font-bold text-on-surface text-sm">{cartItems[product._id]}</span>
                                <button onClick={() => addToCart(product._id)} className="w-8 h-full flex items-center justify-center text-primary font-bold hover:bg-outline-variant transition active:bg-outline">
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