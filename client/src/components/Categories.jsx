import React from 'react'
import { categories } from '../assets/greencart_assets/assets'
import { useAppContext } from '../context/AppContext'

const Categories = () => {
    const { navigate } = useAppContext()
    return (
        <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">Shop by Category</h3>
                <button 
                    onClick={() => navigate('/products')} 
                    className="text-primary font-bold hover:text-primary-container transition flex items-center gap-1 cursor-pointer text-sm"
                >
                    View All
                    <svg className="w-4 h-4 transition group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>
            </div>
            
            {/* Scrollable Horizontal Layout */}
            <div className="flex gap-6 overflow-x-auto hide-scrollbar py-2">
                {categories.map((category, index) => (
                    <div 
                        key={index} 
                        className="flex flex-col items-center gap-2.5 group cursor-pointer min-w-[100px]"
                        onClick={() => {
                            navigate(`/products/${category.path.toLowerCase()}`);
                            window.scrollTo(0, 0);
                        }}
                    >
                        <div className="w-20 h-20 rounded-full bg-surface-container-lowest shadow-sm flex items-center justify-center border border-outline-variant/15 group-hover:border-primary group-hover:shadow-md transition-all duration-300">
                            <img 
                                src={category.image} 
                                alt={category.text} 
                                className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300" 
                            />
                        </div>
                        <span className="text-xs font-bold text-on-surface-variant group-hover:text-primary transition-colors duration-200 text-center max-w-[90px]">
                            {category.path}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Categories

