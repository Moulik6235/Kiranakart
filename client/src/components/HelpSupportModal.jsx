import React, { useState, useEffect, useRef } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const HelpSupportModal = () => {
    const { showHelpModal, setShowHelpModal, user, axios } = useAppContext()
    
    // Core states
    const [activeOrders, setActiveOrders] = useState([])
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [skipOrderSelection, setSkipOrderSelection] = useState(false)
    const [selectedTopic, setSelectedTopic] = useState(null)
    const [messages, setMessages] = useState([])
    const [inputText, setInputText] = useState('')
    const [isTyping, setIsTyping] = useState(false)

    // Interactive states for widgets
    const [checklistSelected, setChecklistSelected] = useState({})
    const [checklistSubmitted, setChecklistSubmitted] = useState(false)
    const [scanState, setScanState] = useState('idle') // idle, scanning, verified
    const [escalatedTicket, setEscalatedTicket] = useState(null)
    const [timerValue, setTimerValue] = useState(900) // 15 mins countdown

    const chatEndRef = useRef(null)

    // Help categories tailored for a specific order
    const orderHelpTopics = [
        {
            id: 'track_order',
            title: 'Track this Order',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            description: 'Check real-time delivery progress & rider details.',
            color: 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:border-indigo-200'
        },
        {
            id: 'refunds',
            title: 'Cancel / Refund Order',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
            ),
            description: 'Cancel your transaction or trigger mock refund actions.',
            color: 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:border-emerald-200'
        },
        {
            id: 'missing_items',
            title: 'Items Missing or Damaged',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
            description: 'Report items that are broken, bad quality, or missing.',
            color: 'bg-amber-50 text-amber-600 border-amber-100 hover:border-amber-200'
        },
        {
            id: 'wrong_charge',
            title: 'Payment or Billing Issue',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
            description: 'Issues with discount codes, double payments, or invoices.',
            color: 'bg-purple-50 text-purple-600 border-purple-100 hover:border-purple-200'
        }
    ]

    // General support categories (non-order related)
    const generalHelpTopics = [
        {
            id: 'seller_partner',
            title: 'Seller Registration Help',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
            description: 'Queries on joining as a seller, listing products, or dashboard controls.',
            color: 'bg-blue-50 text-blue-600 border-blue-100 hover:border-blue-200'
        },
        {
            id: 'general',
            title: 'General Inquiries',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            description: 'Ask about discount coupons, payment methods, or active locations.',
            color: 'bg-purple-50 text-purple-600 border-purple-100 hover:border-purple-200'
        }
    ]

    // Reset support state whenever help modal is closed or opened
    useEffect(() => {
        if (!showHelpModal) {
            setSelectedOrder(null)
            setSkipOrderSelection(false)
            setSelectedTopic(null)
            setMessages([])
            setInputText('')
            setIsTyping(false)
            setChecklistSelected({})
            setChecklistSubmitted(false)
            setScanState('idle')
            setEscalatedTicket(null)
        }
    }, [showHelpModal])

    // Ticket countdown timer tick
    useEffect(() => {
        let interval = null
        if (escalatedTicket) {
            interval = setInterval(() => {
                setTimerValue((prev) => (prev > 0 ? prev - 1 : 0))
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [escalatedTicket])

    // Fetch user orders to make the chatbot answer feel extremely real!
    useEffect(() => {
        const fetchOrders = async () => {
            if (user) {
                try {
                    const { data } = await axios.get('/api/order/user')
                    if (data.success) {
                        setActiveOrders(data.orders)
                    }
                } catch (error) {
                    console.log("Error loading orders in chatbot context:", error)
                }
            }
        }
        if (showHelpModal) {
            fetchOrders()
        }
    }, [showHelpModal, user])

    // Scroll to the bottom of the chat list
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    // Format timer value (MM:SS)
    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0')
        const s = (secs % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    }

    // Greeting matching each category selected
    const handleSelectTopic = (topic) => {
        setSelectedTopic(topic)
        setIsTyping(true)

        setTimeout(() => {
            let initialMsgs = []

            if (selectedOrder) {
                const orderIdStr = `OD${selectedOrder._id.substring(0, 10).toUpperCase()}`;
                
                if (topic.id === 'track_order') {
                    // Feature 3: Live Map Widget
                    initialMsgs = [
                        {
                            sender: 'bot',
                            text: `Hello ${user?.name || 'there'}! 📦 I have located Order **${orderIdStr}** on our live delivery map. Tracking details are loaded below:`,
                            timestamp: new Date()
                        },
                        {
                            sender: 'bot',
                            type: 'delivery_map',
                            timestamp: new Date(),
                            quickReplies: ["Ping Delivery Rider", "Double check address", "Other General Issue"]
                        }
                    ]
                } else if (topic.id === 'refunds') {
                    // Feature 1: Order Cancellation Interactive flow
                    initialMsgs = [
                        {
                            sender: 'bot',
                            text: `Hi! 💸 I can help you process self-serve actions on Order **${orderIdStr}** (Total: **₹${selectedOrder.amount.toFixed(2)}**). Status: **${selectedOrder.status.toUpperCase()}**.`,
                            timestamp: new Date(),
                            quickReplies: [
                                selectedOrder.status === 'Cancelled' ? "Check Refund Status" : "Cancel This Order Now",
                                "Payment double debited",
                                "Need invoice copy"
                            ]
                        }
                    ]
                } else if (topic.id === 'missing_items') {
                    // Feature 2: Item Selection Checklist & Feature 4: Photo Scanner
                    initialMsgs = [
                        {
                            sender: 'bot',
                            text: `Oh no! ⚠️ We are deeply sorry about that! Let's file a quality report for Order **${orderIdStr}** instantly.`,
                            timestamp: new Date()
                        },
                        {
                            sender: 'bot',
                            type: 'items_checklist',
                            text: "Please select the items from this order that were missing or damaged:",
                            timestamp: new Date()
                        }
                    ]
                } else {
                    initialMsgs = [
                        {
                            sender: 'bot',
                            text: `Hi there! 💳 Let's sort out any payment, billing, or discount mismatch issues on Order **${orderIdStr}** (Total: **₹${selectedOrder.amount.toFixed(2)}**). Did you experience a failed transaction or did your checkout coupon fail to apply?`,
                            timestamp: new Date(),
                            quickReplies: ["Coupon failed to apply", "Double payment deduction", "Connect to Human Support"]
                        }
                    ]
                }
            } else {
                if (topic.id === 'seller_partner') {
                    initialMsgs = [
                        {
                            sender: 'bot',
                            text: `Awesome! 🏢 Join KiranaKart's partner program! Our registered sellers average 40% growth in local orders within the first month. You just need a GSTIN and a warehouse address to begin listing. How can I help you set up?`,
                            timestamp: new Date(),
                            quickReplies: ["How to upload products?", "Is GST compulsory?", "Connect to Human Support"]
                        }
                    ]
                } else {
                    initialMsgs = [
                        {
                            sender: 'bot',
                            text: `Hello there! 👋 I am your KiranaKart automated assistant. Ask me anything about discount coupons, delivery timeframes, payment modes, or stores in your locality!`,
                            timestamp: new Date(),
                            quickReplies: ["Active discount coupons?", "Is home delivery free?", "Connect to Human Support"]
                        }
                    ]
                }
            }

            setMessages(initialMsgs)
            setIsTyping(false)
        }, 1200)
    }

    // Live backend cancellation endpoint integration
    const triggerBackendCancellation = async () => {
        if (!selectedOrder) return
        setIsTyping(true)
        
        try {
            const { data } = await axios.post('/api/order/cancel', { orderId: selectedOrder._id })
            
            setTimeout(() => {
                if (data.success) {
                    // Update state variables locally
                    const updatedOrder = { ...selectedOrder, status: 'Cancelled' }
                    setSelectedOrder(updatedOrder)
                    setActiveOrders((prev) =>
                        prev.map((ord) => (ord._id === selectedOrder._id ? updatedOrder : ord))
                    )
                    
                    setMessages((prev) => [
                        ...prev,
                        {
                            sender: 'bot',
                            text: `🚫 **Cancellation Approved!** Order **OD${selectedOrder._id.substring(0, 10).toUpperCase()}** has been successfully cancelled in our database.`,
                            timestamp: new Date()
                        },
                        {
                            sender: 'bot',
                            text: `💳 **Refund Initiated:** An instant refund of **₹${selectedOrder.amount.toFixed(2)}** has been cleared back to your payment source! Ref transaction: **TXN-${Math.floor(Math.random() * 90000000 + 10000000)}**. Is there anything else you need help with?`,
                            timestamp: new Date(),
                            quickReplies: ["Track refund timeline", "Check wallet statement", "Back to main menu"]
                        }
                    ])
                } else {
                    toast.error(data.message || "Failed to cancel order")
                }
                setIsTyping(false)
            }, 1500)
        } catch (error) {
            console.log(error)
            toast.error("Network error while cancelling order")
            setIsTyping(false)
        }
    }

    // Handle claim submit for missing/damaged items checklist
    const handleChecklistSubmit = () => {
        const checkedList = Object.keys(checklistSelected).filter(k => checklistSelected[k])
        if (checkedList.length === 0) {
            toast.error("Please select at least one item first")
            return
        }

        setChecklistSubmitted(true)
        setIsTyping(true)

        setTimeout(() => {
            // Push mock scan uploader feature immediately to make it look extremely premium!
            setMessages((prev) => [
                ...prev,
                {
                    sender: 'bot',
                    text: `🛠️ **Selection registered!** To verify the claim and prevent fraud, please submit a picture of the damaged items using our **AI Freshness Scanner** below:`,
                    timestamp: new Date()
                },
                {
                    sender: 'bot',
                    type: 'photo_uploader',
                    timestamp: new Date()
                }
            ])
            setIsTyping(false)
        }, 1500)
    }

    // Handle mock Scanner Action
    const handleScannerTrigger = () => {
        setScanState('scanning')
        
        setTimeout(() => {
            setScanState('verified')
            setIsTyping(true)

            setTimeout(() => {
                const refundAmount = (selectedOrder.amount * 0.4).toFixed(2)
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: 'bot',
                        text: `🔬 **AI Scanner Report:** Freshness level detected at **24% [CRITICAL EXPIRATION/STALENESS ALIGNMENT DETECTED]**. Quality claim is fully verified and approved!`,
                        timestamp: new Date()
                    },
                    {
                        sender: 'bot',
                        text: `✅ **Refund Successful:** We have credited a partial refund of **₹${refundAmount}** back to your source account for the reported items. We deeply apologize for this lapse in quality control!`,
                        timestamp: new Date(),
                        quickReplies: ["View Refund Details", "Rate Support Experience", "Back to main menu"]
                    }
                ])
                setIsTyping(false)
            }, 1200)
        }, 3000)
    }

    // Handle Escalation Ticket Form Submit
    const handleEscalationSubmit = (e) => {
        e.preventDefault()
        const email = e.target.email.value
        const phone = e.target.phone.value
        const desc = e.target.description.value

        if (!email || !phone || !desc) {
            toast.error("Please fill in all inputs")
            return
        }

        const ticketId = `KK-${Math.floor(Math.random() * 90000 + 10000)}`
        setEscalatedTicket({ id: ticketId, email, phone })
        setIsTyping(true)

        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    sender: 'bot',
                    text: `🎫 **Ticket Escalated Successfully!** A human support manager has been assigned to your concern. Details are locked in below:`,
                    timestamp: new Date()
                },
                {
                    sender: 'bot',
                    type: 'escalation_receipt',
                    timestamp: new Date()
                }
            ])
            setIsTyping(false)
        }, 1500)
    }

    // Auto chatbot answer engine (keyword-driven smart reactions!)
    const getBotResponse = (userText, topicId) => {
        const text = userText.toLowerCase()
        
        // Custom replies based on keywords
        if (text.includes("hello") || text.includes("hi ") || text.includes("hey")) {
            return "Hey there! How can I help you today? Feel free to ask any query about your orders or seller onboarding!"
        }
        if (text.includes("cancel this order now") || (text.includes("cancel") && selectedOrder)) {
            if (selectedOrder && selectedOrder.status === 'Cancelled') {
                return "This order has already been cancelled and fully refunded! You can verify this in your My Orders section."
            }
            // Trigger confirmation message
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: 'bot',
                        text: `⚠️ **Warning:** Cancellation is final and cannot be reversed. Are you absolutely sure you want to cancel Order #OD${selectedOrder._id.substring(0,8).toUpperCase()}?`,
                        timestamp: new Date(),
                        quickReplies: ["Confirm Cancel Order", "No, keep active"]
                    }
                ])
            }, 500)
            return "Awaiting your confirmation..."
        }
        if (text.includes("confirm cancel order")) {
            triggerBackendCancellation()
            return "Contacting database systems..."
        }
        if (text.includes("ping delivery rider") || text.includes("ping rider")) {
            return "📞 secure connection opened! We have pinged Rajesh Kumar's terminal. He has been instructed to call your registered mobile number upon gate arrival."
        }
        if (text.includes("escalate") || text.includes("human") || text.includes("manual") || text.includes("manager")) {
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: 'bot',
                        text: "Please submit your contact info below to trigger a priority call-manager route:",
                        timestamp: new Date()
                    },
                    {
                        sender: 'bot',
                        type: 'escalation_form',
                        timestamp: new Date()
                    }
                ])
            }, 500)
            return "Preparing escalation bridge..."
        }
        if (text.includes("back to main menu") || text.includes("main menu")) {
            setTimeout(() => {
                setSelectedTopic(null)
                setSelectedOrder(null)
                setSkipOrderSelection(false)
                setChecklistSubmitted(false)
                setScanState('idle')
                setEscalatedTicket(null)
            }, 500)
            return "Taking you back to topic selection menu..."
        }
        if (text.includes("coupon") || text.includes("discount") || text.includes("offer")) {
            return "🎉 Active coupon found! Use code **FRESH20** to get 20% off on your first order of organic fruits and vegetables! Minimum cart value is just 200 Rs."
        }
        if (text.includes("delivery") || text.includes("free") || text.includes("charge")) {
            return "🚚 Delivery is **100% Free** for all orders above 300 Rs! For orders below that, we apply a tiny fee of just 15 Rs to support our delivery heroes."
        }
        if (text.includes("seller") || text.includes("onboard") || text.includes("gst")) {
            return "🏢 To register as a seller, click on the **Seller Account** tab in the main menu, create a seller profile, and upload products with customizable units (like kilo, ml, L) and Original/Offer prices instantly!"
        }
        if (text.includes("damaged") || text.includes("stale") || text.includes("bad")) {
            return "🍎 I'm deeply sorry about that! I have registered your quality feedback for our vendor and processed a refund of the product value to your account. Your satisfaction is our absolute priority!"
        }

        // Default fallback response
        return "🤖 That's a great query! I've shared this log with our customer hub to contact you. Feel free to type 'escalate' to request a callback immediately!"
    }

    const handleSendMessage = (textToSend) => {
        if (!textToSend.trim()) return

        const userMsg = {
            sender: 'user',
            text: textToSend,
            timestamp: new Date()
        }

        setMessages((prev) => [...prev, userMsg])
        setInputText('')
        setIsTyping(true)

        // Bot response simulation
        setTimeout(() => {
            const botAnswerText = getBotResponse(textToSend, selectedTopic?.id)
            if (botAnswerText) {
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: 'bot',
                        text: botAnswerText,
                        timestamp: new Date()
                    }
                ])
            }
            setIsTyping(false)
        }, 1200)
    }

    if (!showHelpModal) return null

    // Determine current flow section
    const showOrderSelection = user && activeOrders.length > 0 && !selectedOrder && !skipOrderSelection;
    const showTopicSelection = !showOrderSelection && !selectedTopic;
    const showChatScreen = selectedTopic;

    return (
        <div className="fixed inset-0 z-[110] flex justify-end">
            {/* Backdrop blur overlay */}
            <div 
                onClick={() => setShowHelpModal(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fadeIn"
            ></div>

            {/* Chat Drawer container */}
            <div className="relative w-full max-w-md h-full bg-[#F4F6F8] shadow-2xl flex flex-col z-10 animate-slideInRight overflow-hidden">
                
                {/* Header block with Live support status */}
                <div className="bg-[#4F46E5] text-white px-6 py-5 flex items-center justify-between sticky top-0 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white border border-white/20 font-black">
                                KK
                            </div>
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#4F46E5] rounded-full animate-pulse"></span>
                        </div>
                        <div>
                            <h3 className="font-extrabold text-base tracking-tight leading-none">KiranaKart Help Bot</h3>
                            <span className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider block mt-1">Live Chat Support</span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setShowHelpModal(false)}
                        className="p-1.5 hover:bg-white/10 rounded-full text-indigo-100 hover:text-white transition cursor-pointer"
                        aria-label="Close chat"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Main Content Area */}
                
                {/* STAGE 1: ORDER SELECTION FLOW */}
                {showOrderSelection && (
                    <div className="flex-1 p-6 overflow-y-auto space-y-5">
                        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-center space-y-2">
                            <span className="text-2xl">🛍️</span>
                            <h4 className="font-extrabold text-gray-800 text-base">Select Order</h4>
                            <p className="text-xs font-semibold text-gray-400 leading-relaxed">
                                On which order are you facing a problem? Please select it below to proceed:
                            </p>
                        </div>

                        <div className="space-y-3">
                            <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block ml-1">Your recent orders</span>
                            
                            <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 no-scrollbar">
                                {activeOrders.map((order) => {
                                    const dateStr = new Date(order.createdAt).toLocaleDateString();
                                    const itemsStr = order.items.map(item => `${item.product?.name || 'Product'} (x${item.quantity || 1})`).join(', ');
                                    return (
                                        <button
                                            key={order._id}
                                            onClick={() => setSelectedOrder(order)}
                                            className="w-full text-left bg-white p-4 rounded-2xl border border-gray-150 hover:border-indigo-200 hover:shadow-md cursor-pointer transition duration-200 relative overflow-hidden group select-none flex flex-col gap-1.5"
                                        >
                                            <div className="flex justify-between items-center w-full">
                                                <span className="text-xs font-black text-gray-800 group-hover:text-indigo-600 transition">
                                                    Order #OD{order._id.substring(0, 10).toUpperCase()}
                                                </span>
                                                <span className="px-2 py-0.5 bg-indigo-50 text-[#4F46E5] rounded-md font-bold text-[9px] uppercase tracking-wide shrink-0">
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-gray-500 font-semibold">
                                                Date: {dateStr} · Total: <span className="text-gray-900 font-extrabold">₹{order.amount.toFixed(2)}</span>
                                            </div>
                                            <div className="text-[11px] font-semibold text-gray-400 truncate w-full group-hover:text-gray-500 transition">
                                                {itemsStr}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <button
                            onClick={() => setSkipOrderSelection(true)}
                            className="w-full bg-white border border-dashed border-gray-300 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 py-3.5 rounded-2xl font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
                        >
                            My issue is not related to a recent order
                        </button>
                    </div>
                )}

                {/* STAGE 2: TOPIC SELECTION FLOW */}
                {showTopicSelection && (
                    <div className="flex-1 p-6 overflow-y-auto space-y-5">
                        {/* Navigation back helper */}
                        {activeOrders.length > 0 && (
                            <button
                                onClick={() => {
                                    setSelectedOrder(null);
                                    setSkipOrderSelection(false);
                                }}
                                className="px-3 py-1.5 bg-white border border-gray-200 hover:border-gray-300 rounded-xl text-xs font-bold text-gray-600 active:scale-95 transition cursor-pointer flex items-center gap-1.5 w-max shadow-3xs"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Orders list
                            </button>
                        )}

                        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-center space-y-2">
                            <span className="text-2xl">📋</span>
                            <h4 className="font-extrabold text-gray-800 text-base">
                                {selectedOrder ? `Issues with Order #OD${selectedOrder._id.substring(0, 10).toUpperCase()}` : 'General Inquiry'}
                            </h4>
                            <p className="text-xs font-semibold text-gray-400 leading-relaxed">
                                {selectedOrder 
                                    ? `Please specify what went wrong with this order so we can resolve it.`
                                    : 'Please choose an option below to begin your chat session.'}
                            </p>
                        </div>

                        <div className="space-y-3">
                            <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block ml-1">Select your concern</span>
                            
                            {selectedOrder ? (
                                /* Order-tailored concerns list */
                                <div className="space-y-3">
                                    {orderHelpTopics.map((topic) => (
                                        <button
                                            key={topic.id}
                                            onClick={() => handleSelectTopic(topic)}
                                            className="w-full text-left bg-white p-4 rounded-2xl border border-gray-100/80 hover:border-indigo-100 hover:bg-indigo-50/5 hover:shadow-md flex items-start gap-4 transition duration-200 cursor-pointer select-none group"
                                        >
                                            <div className={`p-3 rounded-xl shrink-0 transition group-hover:scale-105 ${topic.color}`}>
                                                {topic.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-extrabold text-gray-800 text-sm tracking-tight">{topic.title}</h5>
                                                <p className="text-xs font-medium text-gray-400 mt-1 leading-snug">{topic.description}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                /* General non-order concerns list */
                                <div className="space-y-3">
                                    {generalHelpTopics.map((topic) => (
                                        <button
                                            key={topic.id}
                                            onClick={() => handleSelectTopic(topic)}
                                            className="w-full text-left bg-white p-4 rounded-2xl border border-gray-100/80 hover:border-indigo-100 hover:bg-indigo-50/5 hover:shadow-md flex items-start gap-4 transition duration-200 cursor-pointer select-none group"
                                        >
                                            <div className={`p-3 rounded-xl shrink-0 transition group-hover:scale-105 ${topic.color}`}>
                                                {topic.icon}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-extrabold text-gray-800 text-sm tracking-tight">{topic.title}</h5>
                                                <p className="text-xs font-medium text-gray-400 mt-1 leading-snug">{topic.description}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* STAGE 3: CHAT WINDOW INTERACTION */}
                {showChatScreen && (
                    <div className="flex-1 flex flex-col min-h-0">
                        {/* Selected Topic info bar with Back option */}
                        <div className="bg-white px-5 py-3 border-b border-gray-150 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="text-indigo-600 shrink-0">{selectedTopic.icon}</span>
                                <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-extrabold text-gray-800 truncate max-w-[150px] leading-tight">
                                        {selectedTopic.title}
                                    </span>
                                    {selectedOrder && (
                                        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-tight mt-0.5">
                                            #OD{selectedOrder._id.substring(0, 8).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedTopic(null)
                                    setChecklistSubmitted(false)
                                    setScanState('idle')
                                }}
                                className="px-3 py-1 bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-lg text-xs font-bold text-gray-600 active:scale-95 transition cursor-pointer flex items-center gap-1"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back
                            </button>
                        </div>

                        {/* Message Feed list */}
                        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gray-50/50">
                            {messages.map((msg, index) => {
                                const isBot = msg.sender === 'bot'
                                
                                return (
                                    <div key={index} className="space-y-2">
                                        
                                        {/* Standard Text Bubbles */}
                                        {!msg.type && (
                                            <div className={`flex items-start gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}>
                                                {/* Avatar logo */}
                                                <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-extrabold text-xs shadow-xs ${isBot ? 'bg-[#4F46E5] text-white' : 'bg-gray-200 text-gray-700 border border-gray-300'}`}>
                                                    {isBot ? 'KK' : (user?.name ? user.name[0].toUpperCase() : 'U')}
                                                </div>
                                                
                                                {/* Text box bubble */}
                                                <div className={`max-w-[75%] p-3.5 rounded-2xl shadow-xs leading-relaxed text-xs font-semibold ${isBot ? 'bg-white border border-gray-100 text-gray-800 rounded-tl-none' : 'bg-[#4F46E5] text-white rounded-tr-none'}`}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        )}

                                        {/* FEATURE 2: Custom Items Selection Checklist Card */}
                                        {msg.type === 'items_checklist' && selectedOrder && (
                                            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3.5 max-w-[85%] ml-10">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide block">Select items to report</span>
                                                
                                                <div className="space-y-2.5 max-h-[180px] overflow-y-auto pr-1 no-scrollbar">
                                                    {selectedOrder.items.map((item, idx) => (
                                                        <label 
                                                            key={idx} 
                                                            className={`flex items-center gap-3 p-2.5 rounded-xl border transition cursor-pointer select-none ${checklistSelected[item._id] ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900' : 'bg-gray-50/50 border-gray-100 text-gray-700 hover:border-gray-200'}`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                disabled={checklistSubmitted}
                                                                checked={!!checklistSelected[item._id]}
                                                                onChange={(e) => {
                                                                    setChecklistSelected(prev => ({
                                                                        ...prev,
                                                                        [item._id]: e.target.checked
                                                                    }))
                                                                }}
                                                                className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-bold truncate leading-none mb-1">{item.product?.name || 'Fresh Grocery'}</p>
                                                                <span className="text-[10px] font-semibold text-gray-400">Qty: {item.quantity} · Price: ₹{item.product?.offerPrice || 0}</span>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>

                                                {!checklistSubmitted ? (
                                                    <button
                                                        onClick={handleChecklistSubmit}
                                                        className="w-full py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-extrabold text-xs rounded-xl shadow-xs active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
                                                    >
                                                        Confirm & Upload Image
                                                    </button>
                                                ) : (
                                                    <span className="text-xs font-extrabold text-green-600 flex items-center justify-center gap-1">
                                                        ✓ Items selection locked in
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* FEATURE 4: Mock Freshness Scanner & Upload Preview */}
                                        {msg.type === 'photo_uploader' && (
                                            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3.5 max-w-[85%] ml-10 text-center">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide block">AI fresh produce scanner</span>
                                                
                                                {scanState === 'idle' ? (
                                                    <button
                                                        onClick={handleScannerTrigger}
                                                        className="w-full h-36 border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/5 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition select-none"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-gray-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span className="text-[11px] font-extrabold text-gray-500">Tap to upload mock snap</span>
                                                    </button>
                                                ) : scanState === 'scanning' ? (
                                                    <div className="relative w-full h-36 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
                                                        {/* Laser scanning bar */}
                                                        <div className="absolute inset-x-0 h-1 bg-green-400 shadow-[0_0_12px_#4ade80] animate-bounce z-10"></div>
                                                        <img
                                                            src="https://images.unsplash.com/photo-1610397613090-a9c6c863cc81?w=400&auto=format&fit=crop&q=60"
                                                            alt="Produce"
                                                            className="w-full h-full object-cover opacity-40 blur-xs"
                                                        />
                                                        <span className="absolute text-white font-extrabold text-xs tracking-wider uppercase animate-pulse">Scanning Freshness...</span>
                                                    </div>
                                                ) : (
                                                    <div className="relative w-full h-36 bg-slate-900 rounded-2xl overflow-hidden flex flex-col items-center justify-center p-3 text-white border border-green-500 shadow-sm">
                                                        <img
                                                            src="https://images.unsplash.com/photo-1610397613090-a9c6c863cc81?w=400&auto=format&fit=crop&q=60"
                                                            alt="Verified damaged produce"
                                                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                                                        />
                                                        <div className="absolute inset-0 bg-emerald-950/80 flex flex-col items-center justify-center p-4">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-green-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            <span className="text-[11px] font-black uppercase text-green-400 tracking-wide">Analysis Complete</span>
                                                            <span className="text-[9px] text-gray-200 mt-0.5">Critical Freshness failure verified.</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* FEATURE 3: Animated "Live Rider Map" Tracking Widget */}
                                        {msg.type === 'delivery_map' && (
                                            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-4 max-w-[85%] ml-10">
                                                {/* Route stepper */}
                                                <div className="flex items-center justify-between px-2">
                                                    {['Placed', 'Packed', 'On Way', 'Near You'].map((step, idx) => (
                                                        <div key={idx} className="flex flex-col items-center gap-1.5 relative">
                                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${idx <= 2 ? 'bg-[#4F46E5] text-white shadow-xs' : 'bg-gray-100 text-gray-400'}`}>
                                                                {idx + 1}
                                                            </div>
                                                            <span className={`text-[8.5px] font-black uppercase tracking-tight ${idx <= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>{step}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Simulated active map */}
                                                <div className="relative w-full h-32 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
                                                    {/* grid lines pattern */}
                                                    <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                                                    
                                                    {/* Delivery route vector lines */}
                                                    <svg className="absolute inset-0 w-full h-full stroke-indigo-500/20" strokeWidth="3" fill="none">
                                                        <path d="M 20 60 Q 120 10, 220 80 T 360 40" strokeDasharray="6 6" />
                                                    </svg>
                                                    
                                                    <svg className="absolute inset-0 w-full h-full stroke-indigo-400" strokeWidth="3" fill="none">
                                                        <path d="M 20 60 Q 120 10, 220 80 T 360 40" strokePercent="0.7" className="animate-[dash_10s_linear_infinite]" />
                                                    </svg>

                                                    {/* Home pin */}
                                                    <div className="absolute right-8 top-8 bg-emerald-500 text-white p-1 rounded-full animate-pulse shadow-md z-10">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                                        </svg>
                                                    </div>

                                                    {/* Store pin */}
                                                    <div className="absolute left-4 bottom-8 bg-indigo-600 text-white p-1.5 rounded-full shadow-md z-10">
                                                        <span className="text-[7.5px] font-black uppercase">Hub</span>
                                                    </div>

                                                    {/* Scooter rider moving animation */}
                                                    <div className="absolute left-1/2 top-8 text-indigo-400 animate-bounce bg-white p-1 rounded-full shadow-lg border border-indigo-100 z-10">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    </div>
                                                </div>

                                                {/* Rider Profile details */}
                                                <div className="bg-gray-50/80 p-3 rounded-xl flex items-center justify-between border border-gray-100 shadow-2xs">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 bg-indigo-50 rounded-full flex items-center justify-center text-xs font-black text-indigo-600 border border-indigo-150">
                                                            RK
                                                        </div>
                                                        <div>
                                                            <h6 className="font-extrabold text-gray-800 text-[11px] leading-tight">Rajesh Kumar (Rider)</h6>
                                                            <span className="text-[9px] text-gray-400 font-semibold block">Vehicle: Hero Splendor (DL 3C AB 1234)</span>
                                                        </div>
                                                    </div>
                                                    
                                                    <button 
                                                        onClick={() => handleSendMessage("Ping Delivery Rider")}
                                                        className="p-2 bg-green-50 hover:bg-green-100 rounded-lg text-green-600 active:scale-95 transition cursor-pointer"
                                                        aria-label="Call Rider"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* FEATURE 5: Support Ticket Escalation Form */}
                                        {msg.type === 'escalation_form' && (
                                            <form 
                                                onSubmit={handleEscalationSubmit}
                                                className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-3.5 max-w-[85%] ml-10"
                                            >
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide block">Priority Call Escalation</span>
                                                
                                                <div className="space-y-2">
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        required
                                                        defaultValue={user?.email || ''}
                                                        placeholder="Enter email address"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 outline-none text-xs font-bold text-gray-800 focus:border-indigo-500 transition"
                                                    />
                                                    <input
                                                        type="tel"
                                                        name="phone"
                                                        required
                                                        placeholder="Enter contact phone number"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 outline-none text-xs font-bold text-gray-800 focus:border-indigo-500 transition"
                                                    />
                                                    <textarea
                                                        name="description"
                                                        required
                                                        placeholder="Briefly describe your issue..."
                                                        rows="2"
                                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 outline-none text-xs font-bold text-gray-800 focus:border-indigo-500 transition resize-none"
                                                    ></textarea>
                                                </div>

                                                <button
                                                    type="submit"
                                                    className="w-full py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-extrabold text-xs rounded-xl shadow-xs active:scale-95 transition cursor-pointer"
                                                >
                                                    File Ticket & Connect Call
                                                </button>
                                            </form>
                                        )}

                                        {/* Escalated Support Ticket Receipt */}
                                        {msg.type === 'escalation_receipt' && escalatedTicket && (
                                            <div className="bg-white rounded-2xl border-2 border-dashed border-indigo-250 p-4.5 shadow-md space-y-3 max-w-[85%] ml-10 relative overflow-hidden">
                                                <div className="absolute right-0 top-0 bg-indigo-50 text-indigo-600 px-3 py-1 font-black text-[9px] uppercase tracking-wide rounded-bl-xl">
                                                    Priority Route
                                                </div>
                                                
                                                <div>
                                                    <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-wide">Ticket ID: {escalatedTicket.id}</h6>
                                                    <p className="text-[13px] font-black text-gray-800 mt-1">Calling Manager Callback</p>
                                                </div>

                                                <div className="bg-slate-950 text-indigo-400 font-mono py-2 rounded-xl flex items-center justify-center gap-1.5 font-bold text-lg">
                                                    <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                                                    <span>{formatTime(timerValue)}</span>
                                                </div>

                                                <p className="text-[10.5px] font-semibold text-gray-400 leading-snug">
                                                    A support executive will contact you at **{escalatedTicket.phone}** before the timer runs down. Thank you!
                                                </p>
                                            </div>
                                        )}

                                        {/* Dynamic Quick Reply suggestions inside Bot feed bubbles */}
                                        {isBot && msg.quickReplies && (
                                            <div className="flex flex-wrap gap-2 pl-10 pt-1.5">
                                                {msg.quickReplies.map((replyText, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleSendMessage(replyText)}
                                                        className="px-3 py-1.5 bg-white border border-indigo-150 hover:bg-indigo-50/30 text-indigo-600 rounded-xl text-[10.5px] font-extrabold shadow-2xs hover:shadow-xs transition duration-150 cursor-pointer active:scale-95 select-none"
                                                    >
                                                        {replyText}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )
                            })}

                            {/* Automated Typing status spinner */}
                            {isTyping && (
                                <div className="flex items-start gap-2.5">
                                    <div className="w-8 h-8 rounded-full bg-[#4F46E5] text-white shrink-0 flex items-center justify-center font-extrabold text-xs shadow-xs">
                                        KK
                                    </div>
                                    <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-xs flex items-center gap-1">
                                        <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                        <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* User Input controls bar */}
                        <form 
                            onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputText); }}
                            className="bg-white border-t border-gray-150 p-4 shrink-0 flex items-center gap-2.5"
                        >
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 bg-gray-50 border border-gray-250 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl px-4 py-3 outline-none text-xs font-bold text-gray-800 transition"
                            />
                            <button
                                type="submit"
                                className="p-3 bg-[#4F46E5] hover:bg-[#4338CA] active:scale-95 text-white rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center"
                                aria-label="Send message"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9-2-9-12-9 12 9 2zm0 0v-8" />
                                </svg>
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default HelpSupportModal
