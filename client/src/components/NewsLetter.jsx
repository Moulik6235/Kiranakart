import React, { useState } from 'react'
import { toast } from 'react-hot-toast'

const NewsLetter = () => {
    const [email, setEmail] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (email.trim()) {
            toast.success(`Welcome to KiranaKart! Check ${email} for your ₹100 discount coupon code.`, {
                duration: 4000,
                position: 'top-center',
            })
            setEmail('')
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-12 w-full">
            {/* Left Panel: Promo Newsletter */}
            <div className="md:col-span-3 bg-primary-container text-white p-8 md:p-12 rounded-3xl relative overflow-hidden flex flex-col justify-center min-h-[300px]">
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">
                        Get ₹100 Off Your First Order
                    </h2>
                    <p className="text-primary-fixed text-sm md:text-base font-semibold mb-8 max-w-md leading-relaxed">
                        Join 50,000+ happy customers who get their fresh groceries delivered in under 10 minutes.
                    </p>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                        <input 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white/10 border border-white/20 px-5 py-4 rounded-xl flex-1 focus:ring-2 focus:ring-white outline-none placeholder:text-white/60 text-white font-bold text-sm" 
                            placeholder="Enter your email" 
                            type="email"
                            required
                        />
                        <button 
                            type="submit"
                            className="bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-white font-black px-8 py-4 rounded-xl shadow-lg hover:scale-[1.03] transition-all cursor-pointer text-sm"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
                
                {/* Abstract Ambient Circles */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-24 -mt-24 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-12 -mb-12 pointer-events-none"></div>
            </div>

            {/* Right Panel: Download App */}
            <div className="md:col-span-2 bg-surface-container-high rounded-3xl p-8 flex flex-col items-center justify-center text-center border border-outline-variant/15 hover:shadow-lg transition-shadow duration-300">
                {/* Smartphone Icon */}
                <div className="bg-primary/10 p-4 rounded-full text-primary mb-4 animate-bounce duration-1000">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v6m0 0l-3-3m3 3l3-3"></path>
                    </svg>
                </div>

                <h3 className="text-xl md:text-2xl font-extrabold mb-1.5 text-on-surface">Download the App</h3>
                <p className="text-sm text-on-surface-variant font-medium mb-6">Scan to get the best experience on the go.</p>
                
                {/* QR Code Container */}
                <div className="bg-white p-3.5 rounded-2xl border border-outline-variant/20 shadow-sm transition-transform hover:scale-105 duration-300">
                    <img 
                        className="w-24 h-24" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC2P21zUD67MCl2i1oxzn0N9z-pHSA6vCwHdOxyZ_D2DMS6LLeMmgGFOYxxJhwZXdmB5IS5BukeQQgE6Uitryj9f6k-L7gufupoLTA-ItzkUL5JwKUBdlWyP8Wlpyu9pfOR1MbyQ_TnGc4cQ3i4SueBxc8NTeHXkgMgCtOQ-zm8K_AE0Bl9WGAm054twLGwCrVo7ksS5Xv8l8rDB6hpEmuX0IqSwwKaHAMSCZO4GIZ1-Ycbb4dORsqxI-VCGf_aOoHMrjcMHuch8U" 
                        alt="Download KiranaKart QR Code" 
                    />
                </div>
            </div>
        </div>
    )
}

export default NewsLetter

