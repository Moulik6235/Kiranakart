import React from 'react';

const Contact = () => {
    return (
        <div className="flex flex-col items-center justify-center my-16 px-6 md:px-16 lg:px-24 xl:px-32">
            <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight mb-4">Contact Us</h1>
            <p className="text-on-surface-variant font-medium max-w-lg text-center mb-10 leading-relaxed">
                Have a question or need help with your order? We're here for you! 
                Reach out to us through the information below or use the contact form.
            </p>
            
            <div className="flex flex-col md:flex-row gap-10 w-full max-w-4xl">
                <div className="flex-1 bg-surface-container-lowest p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant rounded-2xl">
                    <h2 className="text-2xl font-bold mb-6 text-on-surface">Our Details</h2>
                    <div className="space-y-6 text-on-surface-variant font-medium">
                        <p><span className="text-xs font-bold text-outline uppercase tracking-wider block mb-1">Email</span> support@kiranakart.com</p>
                        <p><span className="text-xs font-bold text-outline uppercase tracking-wider block mb-1">Phone</span> +1 (555) 123-4567</p>
                        <p><span className="text-xs font-bold text-outline uppercase tracking-wider block mb-1">Address</span> 123 Fresh Lane, Grocery City, KK 12345</p>
                    </div>
                </div>
                
                <form className="flex-1 flex flex-col gap-5 bg-surface-container-lowest p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant rounded-2xl">
                    <h2 className="text-2xl font-bold text-on-surface mb-2">Send us a Message</h2>
                    <input 
                        type="text" 
                        placeholder="Your Name" 
                        className="bg-surface-container-high border border-transparent focus:border-primary rounded-lg p-3 outline-none text-on-surface font-medium transition"
                        required 
                    />
                    <input 
                        type="email" 
                        placeholder="Your Email" 
                        className="bg-surface-container-high border border-transparent focus:border-primary rounded-lg p-3 outline-none text-on-surface font-medium transition"
                        required 
                    />
                    <textarea 
                        rows="4" 
                        placeholder="Your Message" 
                        className="bg-surface-container-high border border-transparent focus:border-primary rounded-lg p-3 outline-none text-on-surface font-medium transition resize-none"
                        required 
                    ></textarea>
                    <button 
                        type="button" 
                        onClick={(e) => {
                            e.preventDefault();
                            alert("Message sent successfully!");
                        }}
                        className="bg-primary hover:bg-primary-container text-white py-3.5 mt-2 rounded-lg font-bold shadow-sm active:scale-95 transition"
                    >
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
