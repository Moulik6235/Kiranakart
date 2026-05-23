import React from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/AppContext'

const BestSeller = () => {
    const { products } = useAppContext()
    return (
        <div className='mt-16 px-6 md:px-16 lg:px-24 xl:px-32'>
            <p className='text-2xl md:text-3xl font-bold text-on-surface tracking-tight'>Best Sellers</p>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 lg:grid-cols-5 mt-8'>
                {products.slice(0, 5).map((product, index) => (<ProductCard key={index} product={product} />))}

            </div>
        </div>
    )
}

export default BestSeller
