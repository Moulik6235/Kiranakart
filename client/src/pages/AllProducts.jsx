import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'
import { categories } from '../assets/greencart_assets/assets'

const AllProducts = () => {

    const { products, searchQuery } = useAppContext()
    const [filteredProducts, setFilterProducts] = useState([])
    const [selectedCategory, setSelectedCategory] = useState("All")

    useEffect(() => {
        let tempProducts = [...products];

        if (selectedCategory !== "All") {
            tempProducts = tempProducts.filter(
                product => product.category.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        if (searchQuery.length > 0) {
            tempProducts = tempProducts.filter(
                product => product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilterProducts(tempProducts);
    }, [products, searchQuery, selectedCategory])

    return (
        <div className='mt-10 flex flex-col w-full' >
            <div className='flex flex-col items-start w-max' >
                <p className='text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight uppercase'>All Products</p>
                <div className='w-16 h-1 bg-primary rounded-full mt-1'></div>
            </div>

            {/* Horizontal Categories Filter */}
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-4 mt-6 w-full">
                <button
                    onClick={() => setSelectedCategory("All")}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                        selectedCategory === "All"
                            ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-102"
                    }`}
                >
                    All Products
                </button>
                {categories.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedCategory(item.path)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                            selectedCategory.toLowerCase() === item.path.toLowerCase()
                                ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:scale-102"
                        }`}
                    >
                        {item.text}
                    </button>
                ))}
            </div>

            {filteredProducts.filter((product)=> product.inStock).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <p className="text-gray-400 text-lg">No products found in this category.</p>
                </div>
            ) : (
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 lg:grid-cols-5 mt-4 mb-16' >
                    {filteredProducts.filter((product)=> product.inStock).map((product, index)=>(
                        <ProductCard key={index} product={product}/>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AllProducts
