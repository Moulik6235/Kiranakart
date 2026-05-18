import React from 'react'
import { assets } from "../assets/greencart_assets/assets"

const Footer = () => {
    return (
        <footer className="w-full mt-16 bg-surface-container-high border-t border-outline-variant/15">
            {/* Top Footer: 4-Column Grid */}
            <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-on-surface-variant">
                {/* Brand Column */}
                <div className="col-span-2 md:col-span-1">
                    {/* Logo/Name */}
                    <div className="flex items-center gap-2 text-primary font-black text-xl tracking-tight">
                        <img className="w-7 h-7" src={assets.logo} alt="KiranaKart Logo" />
                        KiranaKart
                    </div>
                    <p className="text-xs font-semibold mt-4 leading-relaxed max-w-xs text-on-surface-variant">
                        Connecting you to the freshest local produce delivered with neo-modern speed.
                    </p>
                    
                    {/* Social Media Vectors */}
                    <div className="flex gap-4 mt-6">
                        <a href="#" className="text-on-surface-variant hover:text-primary transition active:scale-95">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </a>
                        <a href="#" className="text-on-surface-variant hover:text-primary transition active:scale-95">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                            </svg>
                        </a>
                        <a href="#" className="text-on-surface-variant hover:text-primary transition active:scale-95">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l1.684-1.684m0 0l-1.684-1.684m1.684 1.684h6.722m3 5.742a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Column 2: Company */}
                <div>
                    <h4 className="font-bold text-sm text-on-surface mb-4 uppercase tracking-wider">Company</h4>
                    <ul className="space-y-2.5 text-xs font-semibold">
                        <li><a className="hover:text-secondary transition" href="#">About Us</a></li>
                        <li><a className="hover:text-secondary transition" href="#">Terms of Service</a></li>
                        <li><a className="hover:text-secondary transition" href="#">Privacy Policy</a></li>
                        <li><a className="hover:text-secondary transition" href="#">Store Locator</a></li>
                    </ul>
                </div>

                {/* Column 3: Support */}
                <div>
                    <h4 className="font-bold text-sm text-on-surface mb-4 uppercase tracking-wider">Support</h4>
                    <ul className="space-y-2.5 text-xs font-semibold">
                        <li><a className="hover:text-secondary transition" href="#">Contact Support</a></li>
                        <li><a className="hover:text-secondary transition" href="#">Help Center</a></li>
                        <li><a className="hover:text-secondary transition" href="#">Return Policy</a></li>
                        <li><a className="hover:text-secondary transition" href="#">FAQs</a></li>
                    </ul>
                </div>

                {/* Column 4: App */}
                <div>
                    <h4 className="font-bold text-sm text-on-surface mb-4 uppercase tracking-wider">App</h4>
                    <ul className="space-y-2.5 text-xs font-semibold">
                        <li><a className="hover:text-secondary transition" href="#">Download App</a></li>
                        <li><a className="hover:text-secondary transition" href="#">Merchant Portal</a></li>
                        <li><a className="hover:text-secondary transition" href="#">Delivery Partner</a></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Footer: Legal & Payments */}
            <div className="border-t border-outline-variant/15">
                <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-on-surface-variant">
                    <p>© {new Date().getFullYear()} KiranaKart. All rights reserved.</p>
                    
                    <div className="flex items-center gap-4 select-none">
                        <span className="text-[10px] uppercase tracking-wider font-extrabold text-outline">Secure Payments</span>
                        <div className="flex gap-2">
                            {/* Card 1 */}
                            <svg className="w-8 h-5 text-on-surface-variant border border-outline-variant/20 rounded p-0.5 bg-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 4h20a2 2 0 012 2v12a2 2 0 01-2 2H2a2 2 0 01-2-2V6a2 2 0 012-2zm0 4h20V6H2v2zm0 3v7h20v-7H2zm3 2h3v2H5v-2z"></path>
                            </svg>
                            {/* Card 2 */}
                            <svg className="w-8 h-5 text-on-surface-variant border border-outline-variant/20 rounded p-0.5 bg-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 4v10h16V8H4zm4 4h8v2H8v-2z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer