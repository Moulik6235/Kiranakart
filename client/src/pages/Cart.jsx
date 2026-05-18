import { useEffect, useState } from "react"
import { useAppContext } from "../context/AppContext"
import { assets } from "../assets/greencart_assets/assets"
import toast from "react-hot-toast"

const Cart = () => {
    const { 
        products, 
        currency, 
        cartItems, 
        deleteFromCart, 
        getCartCount, 
        updateCartItem, 
        navigate, 
        getCartAmount, 
        axios, 
        user, 
        setCartItems,
        addresses,
        selectedAddress,
        setSelectedAddress
    } = useAppContext()

    const [cartArray, setCartArray] = useState([])
    const [showAddress, setShowAddress] = useState(false)
    
    // Payment Options: "COD" or "Online"
    const [paymentOption, setPaymentOption] = useState("Online") 
    const [showMockUPI, setShowMockUPI] = useState(false)
    const [paymentMethodTab, setPaymentMethodTab] = useState("upi")
    const [mockOrderDetails, setMockOrderDetails] = useState(null)

    // Dynamic Checkout States
    const [isDonationChecked, setIsDonationChecked] = useState(true)
    const [selectedTip, setSelectedTip] = useState(null) // null, 20, 30, 50, 'custom'
    const [customTip, setCustomTip] = useState("")

    // Store Settings (seller-controlled charges)
    const [storeSettings, setStoreSettings] = useState({
        deliveryEnabled: true, deliveryCharge: 30, deliveryLabel: 'Delivery charge',
        surgeEnabled: true, surgeCharge: 30, surgeLabel: 'Surge charge'
    })

    useEffect(() => {
        axios.get('/api/store/settings').then(({ data }) => {
            if (data.success) setStoreSettings(data.settings)
        }).catch(() => {})
    }, [])

    // Parse items in the cart
    const getCart = () => {
        let tempArray = []
        for (const key in cartItems) {
            const product = products.find((item) => item._id === key)
            if (product) {
                product.quantity = cartItems[key]
                tempArray.push(product)
            }
        }
        setCartArray(tempArray)
    }



    // Math calculations
    const itemsTotal = getCartAmount()
    const deliveryCharge = storeSettings.deliveryEnabled && getCartCount() > 0 ? storeSettings.deliveryCharge : 0
    const handlingCharge = 0
    const surgeCharge = storeSettings.surgeEnabled && getCartCount() > 0 ? storeSettings.surgeCharge : 0
    const donationAmount = 0
    
    const tipAmount = selectedTip === 'custom' 
        ? (Number(customTip) || 0) 
        : (selectedTip || 0)

    const grandTotal = itemsTotal + deliveryCharge + handlingCharge + surgeCharge + donationAmount + tipAmount

    // Dynamic Saved amount based on original product prices vs offer prices
    const itemsOriginalTotal = cartArray.reduce((acc, item) => {
        const originalPrice = item.price && item.price > item.offerPrice ? item.price : item.offerPrice + 15
        return acc + (originalPrice * item.quantity)
    }, 0)
    const savedAmount = Math.max(0, itemsOriginalTotal - itemsTotal)

    // Trigger Order / Proceed to Payment
    const placeOrder = async () => {
        if (!user) {
            return toast.error("Please login to proceed")
        }
        if (!selectedAddress) {
            return toast.error("Please select or add a delivery address first")
        }
        if (cartArray.length === 0) {
            return toast.error("Your cart is empty")
        }

        try {
            if (paymentOption === "COD") {
                const { data } = await axios.post('/api/order/cod', {
                    userId: user._id,
                    items: cartArray.map(item => ({ product: item._id, quantity: item.quantity })),
                    address: selectedAddress._id
                })

                if (data.success) {
                    toast.success(data.message)
                    setCartItems([])
                    navigate('/my-orders')
                } else {
                    toast.error(data.message)
                }
            } else {
                // Online Payment Route
                const { data } = await axios.post('/api/order/mock-upi', {
                    userId: user._id,
                    items: cartArray.map(item => ({ product: item._id, quantity: item.quantity })),
                    address: selectedAddress._id,
                    // Pass dynamic calculations so the backend has realistic bills
                    extraCharges: {
                        delivery: deliveryCharge,
                        handling: handlingCharge,
                        surge: surgeCharge,
                        donation: donationAmount,
                        tip: tipAmount
                    }
                })

                if (data.success) {
                    setMockOrderDetails({
                        ...data,
                        amount: grandTotal // Override with grand total including tips/donations
                    })
                    setShowMockUPI(true)
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Verify Payment Simulation
    const handleMockUPIPayment = async (status) => {
        try {
            const { data } = await axios.post('/api/order/verify-mock-upi', {
                order_id: mockOrderDetails.order_id,
                status: status
            });
            if (data.success) {
                toast.success("Payment Received Successfully!");
                setCartItems([]);
                navigate('/my-orders');
            } else {
                toast.error("Payment Failed or Declined!");
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setShowMockUPI(false);
            setMockOrderDetails(null);
        }
    }

    useEffect(() => {
        if (products.length > 0 && cartItems) {
            getCart()
        }
    }, [products, cartItems])



    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: 'My KiranaKart Cart',
                text: `I am ordering ${getCartCount()} items from KiranaKart!`,
                url: window.location.href,
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href)
            toast.success("Cart link copied to clipboard!")
        }
    }

    if (products.length === 0) return null

    return (
        <div className="min-h-screen bg-[#F4F6F8] py-8 pb-32">
            <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 items-start">
                
                {/* Left Column: Cart items & Dynamic Options */}
                <div className="space-y-4">
                    
                    {/* Header bar */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3.5">
                            <button 
                                onClick={() => navigate("/")} 
                                className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
                                aria-label="Go Back"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-xl font-black text-gray-900 tracking-tight">My Cart</h1>
                                <p className="text-xs font-bold text-gray-400 mt-0.5">{getCartCount()} Item{getCartCount() !== 1 ? 's' : ''}</p>
                            </div>
                        </div>
                        <button 
                            onClick={handleShare}
                            className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-indigo-50 rounded-lg text-sm font-extrabold text-[#4F46E5] transition cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.028-2.014m0 0a3 3 0 10-2.243-4.077L7.34 6.158m7.34 2.57a3 3 0 11-1.48 1.561m-1.48-1.56m-5.199 3.016a3 3 0 114.832 2.512l-4.833-2.416" />
                            </svg>
                            Share
                        </button>
                    </div>

                    {/* Cart Items list */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 divide-y divide-gray-100">
                        {cartArray.length === 0 ? (
                            <div className="py-12 text-center">
                                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                                <h3 className="font-extrabold text-gray-800 text-lg">Your cart is empty</h3>
                                <p className="text-sm text-gray-400 mt-1 font-semibold">Add items to start shopping!</p>
                                <button 
                                    onClick={() => navigate("/products")}
                                    className="mt-5 px-6 py-2.5 bg-[#4F46E5] text-white rounded-xl font-bold text-sm hover:bg-[#4338CA] transition shadow-sm cursor-pointer"
                                >
                                    Browse Products
                                </button>
                            </div>
                        ) : (
                            cartArray.map((product, index) => {
                                const originalPrice = product.price && product.price > product.offerPrice ? product.price : product.offerPrice + 15
                                return (
                                    <div key={index} className="flex gap-4 py-4 first:pt-0 last:pb-0 items-center justify-between">
                                        
                                        {/* Product info left */}
                                        <div className="flex gap-4 items-center">
                                            <div 
                                                onClick={() => navigate(`/products/${product.category.toLowerCase()}/${product._id}`)} 
                                                className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center p-1.5 shrink-0 cursor-pointer hover:shadow-sm transition"
                                            >
                                                <img className="max-w-full max-h-full object-contain" src={product.image[0]} alt={product.name} />
                                            </div>
                                            <div>
                                                <h4 className="font-extrabold text-gray-800 text-sm leading-snug line-clamp-2 max-w-[240px] md:max-w-[340px]">
                                                    {product.name}
                                                </h4>
                                                <p className="text-[11px] font-bold text-gray-400 mt-0.5">{product.weight || "1 unit"}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="font-extrabold text-sm text-gray-900">{currency}{product.offerPrice}</span>
                                                    <span className="text-[11px] font-bold text-gray-400 line-through">{currency}{originalPrice}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quantity Pill Capsule right */}
                                        <div className="flex items-center bg-[#4F46E5] text-white px-2.5 py-1.5 rounded-xl gap-3.5 shadow-sm">
                                            <button 
                                                onClick={() => {
                                                    if (product.quantity <= 1) {
                                                        deleteFromCart(product._id)
                                                    } else {
                                                        updateCartItem(product._id, product.quantity - 1)
                                                    }
                                                }}
                                                className="hover:opacity-80 font-black text-base w-4 text-center cursor-pointer select-none"
                                            >
                                                -
                                            </button>
                                            <span className="font-extrabold text-sm w-4 text-center select-none">{product.quantity}</span>
                                            <button 
                                                onClick={() => updateCartItem(product._id, product.quantity + 1)}
                                                className="hover:opacity-80 font-black text-base w-4 text-center cursor-pointer select-none"
                                            >
                                                +
                                            </button>
                                        </div>

                                    </div>
                                )
                            })
                        )}
                    </div>


                    {/* Tip delivery partner */}
                    {getCartCount() > 0 && (
                        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                            <h3 className="font-black text-gray-900 text-base">Tip your delivery partner</h3>
                            <p className="text-[11px] font-semibold text-gray-400 mt-0.5 leading-relaxed">
                                Your kindness means a lot! 100% of your tip will go directly to your delivery partner.
                            </p>

                            <div className="grid grid-cols-4 gap-3 mt-4">
                                <button 
                                    onClick={() => setSelectedTip(selectedTip === 20 ? null : 20)}
                                    className={`flex items-center justify-center gap-1.5 py-3 rounded-xl border font-extrabold text-xs transition cursor-pointer select-none ${selectedTip === 20 ? 'border-[#4F46E5] bg-indigo-50/50 text-[#4F46E5]' : 'border-gray-100 bg-white text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <span>🫱</span>
                                    <span>₹20</span>
                                </button>
                                <button 
                                    onClick={() => setSelectedTip(selectedTip === 30 ? null : 30)}
                                    className={`flex items-center justify-center gap-1.5 py-3 rounded-xl border font-extrabold text-xs transition cursor-pointer select-none ${selectedTip === 30 ? 'border-[#4F46E5] bg-indigo-50/50 text-[#4F46E5]' : 'border-gray-100 bg-white text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <span>✉️</span>
                                    <span>₹30</span>
                                </button>
                                <button 
                                    onClick={() => setSelectedTip(selectedTip === 50 ? null : 50)}
                                    className={`flex items-center justify-center gap-1.5 py-3 rounded-xl border font-extrabold text-xs transition cursor-pointer select-none ${selectedTip === 50 ? 'border-[#4F46E5] bg-indigo-50/50 text-[#4F46E5]' : 'border-gray-100 bg-white text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <span>❤️</span>
                                    <span>₹50</span>
                                </button>
                                <button 
                                    onClick={() => setSelectedTip(selectedTip === 'custom' ? null : 'custom')}
                                    className={`flex items-center justify-center gap-1.5 py-3 rounded-xl border font-extrabold text-xs transition cursor-pointer select-none ${selectedTip === 'custom' ? 'border-[#4F46E5] bg-indigo-50/50 text-[#4F46E5]' : 'border-gray-100 bg-white text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <span>👏</span>
                                    <span>Custom</span>
                                </button>
                            </div>

                            {selectedTip === 'custom' && (
                                <div className="mt-4 flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 animate-fadeIn">
                                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide shrink-0">Enter Tip Amount:</span>
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₹</span>
                                        <input 
                                            type="number"
                                            value={customTip}
                                            onChange={(e) => setCustomTip(e.target.value)}
                                            placeholder="Example: 40"
                                            className="w-full pl-7 pr-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-[#4F46E5] text-gray-800 font-bold"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>

                {/* Right Column: Address, Payment Methods, Bill Details */}
                <div className="space-y-4">
                    
                    {/* Delivery Address Box */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Delivery Address</span>
                            <button 
                                onClick={() => setShowAddress(!showAddress)} 
                                className="text-xs font-black text-[#4F46E5] hover:underline cursor-pointer"
                            >
                                Change
                            </button>
                        </div>
                        
                        <div className="relative mt-3">
                            <div className="flex gap-2.5 items-start bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <p className="text-xs font-bold text-gray-700 leading-relaxed pr-2">
                                    {selectedAddress 
                                        ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}` 
                                        : "No shipping addresses found. Please add an address to place order."}
                                </p>
                            </div>

                            {/* Dropdown list of addresses */}
                            {showAddress && (
                                <div className="absolute right-0 left-0 mt-2 bg-white shadow-xl border border-gray-100 rounded-xl text-xs z-30 overflow-hidden divide-y divide-gray-50 origin-top">
                                    {addresses.map((address, index) => (
                                        <div 
                                            key={index}
                                            onClick={() => { setSelectedAddress(address); setShowAddress(false) }} 
                                            className="p-3.5 hover:bg-indigo-50/50 cursor-pointer font-bold text-gray-700 transition"
                                        >
                                            {address.street}, {address.city}, {address.state}, {address.country}
                                        </div>
                                    ))}
                                    <div 
                                        onClick={() => { setShowAddress(false); navigate("/add-address"); }} 
                                        className="text-center font-black p-3.5 text-[#4F46E5] hover:bg-indigo-50/50 cursor-pointer bg-white transition"
                                    >
                                        + Add new address
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Method Selector */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block">Select Payment Method</span>
                        
                        <div className="grid grid-cols-2 gap-3 mt-3">
                            <button
                                type="button"
                                onClick={() => setPaymentOption("Online")}
                                className={`py-3 rounded-xl border font-extrabold text-xs transition cursor-pointer select-none text-center ${paymentOption === "Online" ? 'border-[#4F46E5] bg-indigo-50/50 text-[#4F46E5]' : 'border-gray-100 bg-white text-gray-600 hover:bg-gray-50'}`}
                            >
                                Online UPI / Card
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentOption("COD")}
                                className={`py-3 rounded-xl border font-extrabold text-xs transition cursor-pointer select-none text-center ${paymentOption === "COD" ? 'border-[#4F46E5] bg-indigo-50/50 text-[#4F46E5]' : 'border-gray-100 bg-white text-gray-600 hover:bg-gray-50'}`}
                            >
                                Cash on Delivery
                            </button>
                        </div>
                    </div>

                    {/* Bill Details Box */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                        <h3 className="font-black text-gray-900 text-base">Bill details</h3>
                        
                        <div className="mt-4 space-y-3.5 text-xs text-gray-600 font-bold">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5">
                                    <span>📋</span>
                                    <span>Items total</span>
                                    {savedAmount > 0 && (
                                        <span className="text-[10px] bg-indigo-50 text-[#4F46E5] px-2 py-0.5 rounded-full font-black">
                                            Saved {currency}{savedAmount}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {savedAmount > 0 && (
                                        <span className="text-gray-400 line-through font-bold">
                                            {currency}{itemsOriginalTotal}
                                        </span>
                                    )}
                                    <span className="text-gray-800 font-black">{currency}{itemsTotal}</span>
                                </div>
                            </div>

                            {getCartCount() > 0 && (
                                <>
                                    {storeSettings.deliveryEnabled && (
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-1.5 group relative">
                                                <span>🚴</span>
                                                <span>{storeSettings.deliveryLabel || 'Delivery charge'}</span>
                                                <span className="text-[10px] text-gray-400 cursor-pointer select-none">ⓘ</span>
                                            </div>
                                            <span className="text-gray-800 font-black">{currency}{storeSettings.deliveryCharge}</span>
                                        </div>
                                    )}
                                    {storeSettings.surgeEnabled && (
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-1.5 group relative">
                                                <span>📈</span>
                                                <span>{storeSettings.surgeLabel || 'Surge charge'}</span>
                                                <span className="text-[10px] text-gray-400 cursor-pointer select-none">ⓘ</span>
                                            </div>
                                            <span className="text-gray-800 font-black">{currency}{storeSettings.surgeCharge}</span>
                                        </div>
                                    )}
                                </>
                            )}



                            {tipAmount > 0 && (
                                <div className="flex justify-between items-center text-green-600">
                                    <div className="flex items-center gap-1.5">
                                        <span>❤️</span>
                                        <span>Delivery partner tip</span>
                                    </div>
                                    <span className="font-black">{currency}{tipAmount}</span>
                                </div>
                            )}

                            <hr className="border-gray-100 my-4" />

                            <div className="flex justify-between items-center text-sm text-gray-900 font-black pt-1">
                                <div className="flex items-center gap-1">
                                    <span>Grand total</span>
                                    <span className="text-[10px] text-gray-400 cursor-pointer select-none">ⓘ</span>
                                </div>
                                <span className="text-lg font-black text-gray-950">{currency}{getCartCount() > 0 ? grandTotal : 0}</span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

            {/* Bottom Floating Checkout Bar (Styled exactly like mockup screenshot) */}
            {getCartCount() > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] z-40">
                    <div className="max-w-5xl mx-auto flex items-center justify-between">
                        
                        {/* Total indicator left */}
                        <div className="flex flex-col text-left pl-2 select-none">
                            <span className="text-lg font-black text-gray-950 tracking-tight leading-none">
                                {currency}{grandTotal}
                            </span>
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">
                                TOTAL
                            </span>
                        </div>

                        {/* Proceed Action right */}
                        <button 
                            onClick={placeOrder}
                            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white font-extrabold px-8 py-3.5 rounded-2xl flex items-center gap-2 shadow-sm hover:shadow-md transition active:scale-95 duration-150 cursor-pointer select-none text-base"
                        >
                            <span>{paymentOption === "COD" ? "Place Order" : "Proceed"}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                    </div>
                </div>
            )}

            {/* Highly Polished Mobile-styled Mock Payment UPI Drawer Modal */}
            {showMockUPI && (
                <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scaleUp">
                        
                        {/* Drawer Header */}
                        <div className="bg-indigo-900 text-white p-6 relative">
                            <button 
                                onClick={() => {setShowMockUPI(false); setMockOrderDetails(null)}} 
                                className="absolute top-6 right-6 text-indigo-200 hover:text-white transition cursor-pointer"
                                aria-label="Close Payment"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <h2 className="text-xl font-black tracking-tight">Smart Checkout</h2>
                            <p className="text-xs text-indigo-200 mt-1 font-bold">Secure mock sandbox gateway</p>
                            
                            {/* Payment Method Tabs */}
                            <div className="flex bg-indigo-950/50 rounded-xl mt-4 p-1">
                                <button 
                                    onClick={() => setPaymentMethodTab("upi")}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${paymentMethodTab === 'upi' ? 'bg-white text-indigo-900 shadow-sm' : 'text-indigo-200 hover:text-white hover:bg-white/10'}`}
                                >
                                    UPI QR Code
                                </button>
                                <button 
                                    onClick={() => setPaymentMethodTab("card")}
                                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${paymentMethodTab === 'card' ? 'bg-white text-indigo-900 shadow-sm' : 'text-indigo-200 hover:text-white hover:bg-white/10'}`}
                                >
                                    Credit / Debit Card
                                </button>
                            </div>
                        </div>

                        <div className="p-6 text-center">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                                <div className="text-left">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">ORDER ID</span>
                                    <span className="text-xs font-bold text-gray-600 block mt-0.5">{mockOrderDetails?.order_id}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Amount Payable</span>
                                    <span className="text-lg font-black text-gray-900 block mt-0.5">{currency}{mockOrderDetails?.amount}</span>
                                </div>
                            </div>
                            
                            {paymentMethodTab === "upi" ? (
                                <>
                                    {/* Real UPI QR Code */}
                                    <div className="my-6 mx-auto flex flex-col items-center justify-center animate-fadeIn">
                                        <img 
                                            src="/images/upi_qr_code.jpg" 
                                            alt="Scan to Pay - MOULIK MANOCHA (7986312767@yapl)" 
                                            className="w-56 h-auto object-contain rounded-2xl shadow-lg border border-gray-100"
                                        />
                                    </div>
                                    <p className="text-xs font-bold text-gray-400 mb-6">Scan QR using GPay, PhonePe, Paytm, or BHIM · <span className="text-gray-600">7986312767@yapl</span></p>
                                    
                                    {/* Simulation actions */}
                                    <div className="space-y-3">
                                        <button 
                                            onClick={() => handleMockUPIPayment("SUCCESS")} 
                                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3.5 rounded-2xl font-extrabold text-sm transition shadow-sm active:scale-98 cursor-pointer"
                                        >
                                            Simulate Success (Pay with GPay)
                                        </button>
                                        <button 
                                            onClick={() => handleMockUPIPayment("FAILED")} 
                                            className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-3.5 rounded-2xl font-extrabold text-sm transition active:scale-98 cursor-pointer"
                                        >
                                            Simulate Payment Failure
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-left animate-fadeIn">
                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Card Number</label>
                                            <div className="relative">
                                                <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                                <input type="text" placeholder="0000 0000 0000 0000" maxLength="19" className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl pl-11 pr-4 py-3 outline-none text-gray-800 font-semibold transition tracking-widest" />
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Expiry (MM/YY)</label>
                                                <input type="text" placeholder="MM/YY" maxLength="5" className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl px-4 py-3 outline-none text-gray-800 font-semibold transition text-center tracking-widest" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">CVV</label>
                                                <div className="relative">
                                                    <input type="password" placeholder="•••" maxLength="4" className="w-full bg-gray-50 border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl px-4 py-3 outline-none text-gray-800 font-semibold transition text-center tracking-widest" />
                                                    <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 ml-1 cursor-pointer select-none">
                                            <input type="checkbox" id="saveCard" className="w-4 h-4 accent-indigo-600 cursor-pointer rounded" defaultChecked />
                                            <label htmlFor="saveCard" className="text-xs font-bold text-gray-600 cursor-pointer pt-0.5">Save card for future payments</label>
                                        </div>
                                    </div>
                                    
                                    {/* Simulation actions */}
                                    <div className="space-y-3">
                                        <button 
                                            onClick={() => handleMockUPIPayment("SUCCESS")} 
                                            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white py-3.5 rounded-2xl font-extrabold text-sm transition shadow-[0_4px_14px_rgba(79,70,229,0.3)] active:scale-98 cursor-pointer flex justify-center items-center gap-2"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            Pay Securely {currency}{mockOrderDetails?.amount}
                                        </button>
                                        <button 
                                            onClick={() => handleMockUPIPayment("FAILED")} 
                                            className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-3.5 rounded-2xl font-extrabold text-sm transition active:scale-98 cursor-pointer"
                                        >
                                            Simulate Payment Failure
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button 
                                onClick={() => {setShowMockUPI(false); setMockOrderDetails(null)}} 
                                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-500 py-3 rounded-2xl font-extrabold text-xs transition cursor-pointer mt-4"
                            >
                                Decline and Exit
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    )
}

export default Cart