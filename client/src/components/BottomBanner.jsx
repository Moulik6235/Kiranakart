import React from 'react'
import { assets, features } from '../assets/greencart_assets/assets'

const BottomBanner = () => {
    return (
        <div className='relative mt-32'>
            <img src={assets.bottom_banner_image} alt="banner" className='w-full hidden md:block' />
            <img src={assets.bottom_banner_image_sm} alt="banner" className='w-full md:hidden' />

            <div className='absolute inset-0 flex flex-col items-center md:items-end md:justify-center pt-16 md:pt-0 md:pr-16 lg:pr-24 xl:pr-32'>
                <div>
                    <h1 className='text-2xl md:text-3xl font-extrabold text-primary mb-8 tracking-tight'>Why We Are the Best?</h1>
                    {features.map((feature, index) => (
                        <div key={index} className='flex items-center gap-4 mt-6'>
                            <div className="bg-surface-container-lowest p-2 rounded-xl shadow-sm border border-outline-variant/30">
                                <img src={feature.icon} alt={feature.title} className='md:w-10 w-8 opacity-90' />
                            </div>
                            <div>
                                <h3 className='text-lg md:text-xl font-bold text-on-surface'>{feature.title}</h3>
                                <p className='text-on-surface-variant font-medium text-xs md:text-sm mt-1'>{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BottomBanner
