import React, { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard'

const AllProducts = () => {

    const { products, searchQuery } = useAppContext()
    const [filteredProducts, setFilterProducts] = useState([])

    useEffect(() => {
        if (searchQuery.length > 0) {
            setFilterProducts(products.filter(
                product => product.name.toLowerCase().includes(searchQuery.toLowerCase())
            ))
        } else {
            setFilterProducts(products)
        }
    }, [products, searchQuery])
    return (
        <div className='mt-16 flex flex-col px-6 md:px-16 lg:px-24 xl:px-32' >
            <div className='flex flex-col items-end w-max' >
                <p className='text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight uppercase'>All Products</p>
                <div className='w-16 h-1 bg-primary rounded-full mt-1'></div>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 lg:grid-cols-5 mt-8' >
                {filteredProducts.filter((product)=> product.inStock).map((product, index)=>(
                    <ProductCard key={index} product={product}/>
                ))}
            </div>
        </div>
    )
}

export default AllProducts
