import React from 'react'
import { Link } from 'react-router-dom'

const MainBanner = () => {
    return (
        <div className="relative h-[320px] md:h-[480px] w-full rounded-3xl overflow-hidden shadow-md border border-outline-variant/10">
            {/* Background Lifestyle Image */}
            <img 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDja8BUW7jCNLFun8QbLzAQWwPIElrRKiouDHZtGtDbBMV_J0vkB-I_p0gGW4KOsadhVHAQrdFJ4J89TpbDurSu-PdpaN_GksYVx4Kgn9RYng3KQR9-yMWD-7LT-2W96v35fe0ZsdPLxOmbr8Num431_hHwNJrvLYiuBjcbyvv6NCOZ9leJLOsHUebdVPoNz4LgF27SQwfTRtYZlBXN_Tm5e4xaGragQ33gvQnRJuw0_1FRD7n-j09Vy0Pu6rXgLElru2f09ft-xSs" 
                alt="Farm-fresh organic produce kitchen lifestyle" 
            />

            {/* Gradient Overlay & Typography */}
            <div className="absolute inset-0 bg-gradient-to-r from-on-background/75 via-on-background/40 to-transparent flex flex-col justify-center px-6 md:px-12">
                <span className="bg-secondary-container text-on-secondary-container text-xs md:text-sm font-extrabold px-3.5 py-1.5 rounded-full w-fit mb-4 uppercase tracking-widest">
                    Premium Quality
                </span>
                
                <h2 className="text-3xl md:text-5xl font-extrabold text-white max-w-sm md:max-w-xl mb-6 leading-tight tracking-tight">
                    Farm-Fresh Joy, Delivered to Your Door in <span className="text-secondary-container font-black">10 Minutes</span>.
                </h2>
                
                <div className="flex gap-4">
                    <Link 
                        to="/products" 
                        className="bg-primary hover:bg-primary-container text-white font-bold px-6 py-3 md:px-8 md:py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all duration-200 cursor-pointer text-sm"
                    >
                        Shop Fresh Now
                    </Link>
                    <Link 
                        to="/products" 
                        className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/40 font-bold px-6 py-3 md:px-8 md:py-4 rounded-xl active:scale-[0.98] transition-all duration-200 cursor-pointer text-sm"
                    >
                        View All Deals
                    </Link>
                </div>
            </div>

            {/* Slider Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                <div className="w-8 md:w-12 h-1.5 bg-white rounded-full transition-all"></div>
                <div className="w-1.5 md:w-2 h-1.5 bg-white/40 rounded-full transition-all"></div>
                <div className="w-1.5 md:w-2 h-1.5 bg-white/40 rounded-full transition-all"></div>
            </div>
        </div>
    )
}

export default MainBanner

