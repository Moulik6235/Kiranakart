import React from 'react'

const PromiseBanner = () => {
    const promises = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
            ),
            title: "10 Min Delivery",
            description: "Blazing fast arrival from our local hubs.",
            bgColor: "bg-primary/10",
            textColor: "text-primary"
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"></path>
                </svg>
            ),
            title: "Freshness Guarantee",
            description: "Picked at peak ripeness for your table.",
            bgColor: "bg-tertiary/10",
            textColor: "text-tertiary"
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
            ),
            title: "Lowest Prices",
            description: "Match our prices or we refund the gap.",
            bgColor: "bg-secondary/10",
            textColor: "text-secondary"
        }
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-surface-container-low p-6 md:p-8 rounded-3xl border border-outline-variant/15 mt-6">
            {promises.map((promise, index) => (
                <div key={index} className="flex items-center gap-4">
                    <div className={`${promise.bgColor} ${promise.textColor} p-4 rounded-2xl transition-transform hover:scale-105 duration-200`}>
                        {promise.icon}
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-on-surface">{promise.title}</h4>
                        <p className="text-sm text-on-surface-variant mt-1 leading-normal font-medium">{promise.description}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PromiseBanner
