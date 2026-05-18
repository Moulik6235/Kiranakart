import { useEffect, useState } from "react"
import { useAppContext } from "../context/AppContext"
import { assets, dummyAddress } from "../assets/greencart_assets/assets"

import toast from "react-hot-toast"


const Cart = () => {
    const { products, currency, cartItems, deleteFromCart, getCartCount, updateCartItem, navigate, getCartAmount, axios, user, setCartItems } = useAppContext()
    const [cartArray, setCartArray] = useState([])
    const [addresses, setAddresses] = useState([])
    const [showAddress, setShowAddress] = useState(false)
    const [selectedAddress, setSelectAddress] = useState(null)
    const [paymentOption, setPaymentOption] = useState("COD")
    const [showMockUPI, setShowMockUPI] = useState(false)
    const [mockOrderDetails, setMockOrderDetails] = useState(null)

    const getCart = () => {
        let tempArray = []
        for (const key in cartItems) {
            const product = products.find((item) => item._id === key)
            product.quantity = cartItems[key]
            tempArray.push(product)
        }
        setCartArray(tempArray)
    }

    const getUserAddress = async () => {
        try {
            const { data } = await axios.get('/api/address/get');
            if (data.success) {
                setAddresses(data.addresses)
                if (data.addresses.length > 0) {
                    setSelectAddress(data.addresses[0])
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.message(error.message)
        }
    }


    const placeOrder = async () => {
        try {
            if (!selectedAddress) {
                return toast.error("Please select an address")
            }

            // Place Order with COD
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
                // Place Order with Mock UPI
                const { data } = await axios.post('/api/order/mock-upi', {
                    userId: user._id,
                    items: cartArray.map(item => ({ product: item._id, quantity: item.quantity })),
                    address: selectedAddress._id
                })

                if (data.success) {
                    setMockOrderDetails(data)
                    setShowMockUPI(true)
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const handleMockUPIPayment = async (status) => {
        try {
            const { data } = await axios.post('/api/order/verify-mock-upi', {
                order_id: mockOrderDetails.order_id,
                status: status
            });
            if (data.success) {
                toast.success("Mock Payment Successful!");
                setCartItems([]);
                navigate('/my-orders');
            } else {
                toast.error("Mock Payment Failed!");
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

    useEffect(() => {
        if (user) {
            getUserAddress()
        }
    }, [user])

    return products.length > 0 && cartItems ? (
        <div className="flex flex-col md:flex-row mt-16 gap-8 px-6 md:px-16 lg:px-24 xl:px-32">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-bold text-on-surface mb-6 tracking-tight">
                    Shopping Cart <span className="text-sm text-outline ml-2 bg-surface-container px-3 py-1 rounded-full">{getCartCount()} Items</span>
                </h1>

                <div className="grid grid-cols-[2fr_1fr_1fr] text-outline text-xs font-bold uppercase tracking-wider pb-3 border-b border-outline-variant">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartArray.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-on-surface items-center text-sm md:text-base font-medium py-4 border-b border-outline-variant">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div onClick={() => {
                                navigate(`/products/${product.category.toLowerCase()}/${product._id}`); scrollTo(0, 0)
                            }} className="cursor-pointer w-24 h-24 flex items-center justify-center bg-surface-container-low rounded-xl hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition p-2">
                                <img className="max-w-full h-full object-contain mix-blend-multiply" src={product.image[0]} alt={product.name} />
                            </div>
                            <div>
                                <p className="hidden md:block font-bold text-lg">{product.name}</p>
                                <div className="font-medium text-outline mt-1 text-sm">
                                    <p>Weight: <span className="text-on-surface-variant">{product.weight || "N/A"}</span></p>
                                    <div className='flex items-center mt-2'>
                                        <p>Qty:</p>
                                        <select value={product.quantity} onChange={(e) => updateCartItem(product._id, Number(e.target.value))} className='outline-none bg-surface-container-high rounded border border-outline-variant px-2 py-1 ml-2 text-on-surface cursor-pointer'>
                                            {Array(Math.max(product.quantity, 9)).fill('').map((_, idx) => (
                                                <option key={idx} value={idx + 1}>{idx + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center font-bold text-lg">{currency}{product.offerPrice * product.quantity}</p>
                        <button onClick={() => deleteFromCart(product._id)} className="cursor-pointer mx-auto p-2 hover:bg-error-container rounded-full transition group">
                            <img src={assets.remove_icon} alt="remove" className="inline-block w-6 h-6 opacity-60 group-hover:opacity-100" />
                        </button>
                    </div>)
                )}

                <button onClick={() => {
                    navigate("/products"); scrollTo(0, 0)
                }} className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-bold hover:text-primary-container transition">
                    <img src={assets.arrow_right_icon_colored} alt="arrow" className="group-hover:-translate-x-1 transition" />
                    Continue Shopping
                </button>

            </div>

            <div className="max-w-[360px] w-full bg-surface-container-lowest p-6 max-md:mt-16 border border-outline-variant rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] h-fit">
                <h2 className="text-2xl font-bold text-on-surface">Order Summary</h2>
                <hr className="border-outline-variant my-5" />

                <div className="mb-6">
                    <p className="text-xs font-bold uppercase tracking-wide text-outline">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-3">
                        <p className="text-on-surface-variant text-sm pr-4 font-medium">{selectedAddress ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country}` : "No address found"}</p>
                        <button onClick={() => setShowAddress(!showAddress)} className="text-primary font-bold hover:text-primary-container transition cursor-pointer text-sm">
                            Change
                        </button>
                        {showAddress && (
                            <div className="absolute top-full mt-2 py-2 bg-surface-container-lowest shadow-lg border border-outline-variant rounded-xl text-sm w-full z-10 overflow-hidden">
                                {addresses.map((address, index) => (
                                    <p onClick={() => { setSelectAddress(address); setShowAddress(false) }} className="text-on-surface p-3 hover:bg-surface-container transition cursor-pointer font-medium border-b border-outline-variant last:border-0">
                                        {address.street}, {address.city}, {address.state}, {address.country}
                                    </p>
                                ))}
                                <p onClick={() => navigate("/add-address")} className="text-primary font-bold text-center cursor-pointer p-3 hover:bg-surface-container transition bg-surface">
                                    + Add new address
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-xs font-bold uppercase tracking-wide text-outline mt-8">Payment Method</p>

                    <select onChange={e => setPaymentOption(e.target.value)} className="w-full border border-outline-variant rounded-lg bg-surface-container px-4 py-3 mt-3 outline-none text-on-surface font-medium cursor-pointer focus:border-primary transition">
                        <option value="COD">Cash On Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>
                </div>

                <hr className="border-outline-variant my-5" />

                <div className="text-on-surface-variant mt-4 space-y-3 text-sm font-medium">
                    <p className="flex justify-between">
                        <span>Items Total</span><span className="text-on-surface font-bold">{currency}{getCartAmount()}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Shipping Fee</span><span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">Free</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (2%)</span><span className="text-on-surface font-bold">{currency}{getCartAmount() * 2 / 100}</span>
                    </p>
                    <p className="flex justify-between text-xl font-extrabold mt-4 pt-4 border-t border-outline-variant text-on-surface">
                        <span>Total Amount:</span><span>{currency}{getCartAmount() + getCartAmount() * 2 / 100}</span>
                    </p>
                </div>

                <button onClick={placeOrder} className="w-full py-3.5 mt-8 rounded-lg cursor-pointer bg-primary text-white font-bold hover:bg-primary-container shadow-sm active:scale-95 transition text-lg">
                    {paymentOption === "COD" ? "Place Order" : "Proceed to Checkout"}
                </button>
            </div>

            {/* Mock UPI Modal */}
            {showMockUPI && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Mock UPI Payment</h2>
                        <p className="text-gray-500 mb-6">Scan QR or select an app to pay</p>
                        
                        <div className="bg-gray-100 w-48 h-48 mx-auto mb-6 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                            <span className="text-gray-400 font-medium">Fake QR Code</span>
                        </div>
                        
                        <div className="text-3xl font-bold text-primary mb-6">
                            {currency}{mockOrderDetails?.amount}
                        </div>
                        
                        <div className="space-y-3">
                            <button onClick={() => handleMockUPIPayment("SUCCESS")} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition cursor-pointer">
                                Simulate Success (Pay with GPay)
                            </button>
                            <button onClick={() => handleMockUPIPayment("FAILED")} className="w-full bg-red-100 hover:bg-red-200 text-red-600 py-3 rounded-lg font-medium transition cursor-pointer">
                                Simulate Failure
                            </button>
                            <button onClick={() => {setShowMockUPI(false); setMockOrderDetails(null)}} className="w-full text-gray-500 hover:bg-gray-100 py-3 rounded-lg font-medium transition cursor-pointer">
                                Cancel Payment
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    ) : null
}

export default Cart 