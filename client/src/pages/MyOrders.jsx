import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const getTrackingStepIndex = (status) => {
    const s = status ? status.toLowerCase() : '';
    if (s.includes('delivered')) return 4;
    if (s.includes('out') || s.includes('delivery')) return 3;
    if (s.includes('pack') || s.includes('prepare')) return 2;
    return 1; // placed
}

const playChimeSound = (type) => {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        const now = audioCtx.currentTime;
        
        if (type === 'Placed') {
            osc.frequency.setValueAtTime(523.25, now); // C5
            gainNode.gain.setValueAtTime(0.15, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.45);
        } else if (type === 'Packing') {
            osc.frequency.setValueAtTime(440, now); // A4
            osc.frequency.setValueAtTime(554.37, now + 0.1); // C#5
            gainNode.gain.setValueAtTime(0.1, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            osc.start(now);
            osc.stop(now + 0.35);
        } else if (type === 'Out for Delivery') {
            osc.frequency.setValueAtTime(392, now); // G4
            osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2); // G5
            gainNode.gain.setValueAtTime(0.08, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.35);
        } else if (type === 'Delivered') {
            const osc2 = audioCtx.createOscillator();
            const osc3 = audioCtx.createOscillator();
            osc2.connect(gainNode);
            osc3.connect(gainNode);
            
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc2.frequency.setValueAtTime(659.25, now); // E5
            osc3.frequency.setValueAtTime(783.99, now); // G5
            
            gainNode.gain.setValueAtTime(0.2, now);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
            
            osc.start(now);
            osc2.start(now);
            osc3.start(now);
            
            osc.stop(now + 0.85);
            osc2.stop(now + 0.85);
            osc3.stop(now + 0.85);
        }
    } catch (e) {
        console.error("Audio Context not supported or blocked", e);
    }
};

const isTrackingVisible = (order, simulatedStatus) => {
    if (!order) return false;
    const status = simulatedStatus || order.status;
    if (status === 'Delivered' || status === 'Cancelled') {
        return false; // Remove tracking completely once delivered or cancelled!
    }
    return true; // Keep visible while in-progress
}

const ScratchCard = ({ onComplete }) => {
    const canvasRef = React.useRef(null);
    const [scratched, setScratched] = React.useState(false);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        // Draw metallic silver gradient overlay
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#A1A1AA');
        grad.addColorStop(0.5, '#E4E4E7');
        grad.addColorStop(1, '#71717A');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add elegant patterns and text
        ctx.font = 'bold 13px sans-serif';
        ctx.fillStyle = '#18181B';
        ctx.textAlign = 'center';
        ctx.fillText('🎁 REWARD SCRATCH CARD 🎁', canvas.width / 2, canvas.height / 2 - 10);
        ctx.font = 'bold 9px sans-serif';
        ctx.fillText('Scratch with mouse or touch to reveal!', canvas.width / 2, canvas.height / 2 + 15);

        // Track scratching events
        let isDrawing = false;

        const getMousePos = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };

        const scratch = (e) => {
            if (!isDrawing) return;
            e.preventDefault();
            const { x, y } = getMousePos(e);
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, 16, 0, Math.PI * 2);
            ctx.fill();
            checkPercentage();
        };

        const checkPercentage = () => {
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let transparent = 0;
            for (let i = 3; i < imgData.data.length; i += 4) {
                if (imgData.data[i] === 0) transparent++;
            }
            const percent = (transparent / (canvas.width * canvas.height)) * 100;
            if (percent >= 45 && !scratched) {
                setScratched(true);
                onComplete();
            }
        };

        const handleStart = (e) => { isDrawing = true; scratch(e); };
        const handleEnd = () => { isDrawing = false; };

        canvas.addEventListener('mousedown', handleStart);
        canvas.addEventListener('mousemove', scratch);
        canvas.addEventListener('mouseup', handleEnd);
        canvas.addEventListener('mouseleave', handleEnd);

        canvas.addEventListener('touchstart', handleStart);
        canvas.addEventListener('touchmove', scratch, { passive: false });
        canvas.addEventListener('touchend', handleEnd);

        return () => {
            canvas.removeEventListener('mousedown', handleStart);
            canvas.removeEventListener('mousemove', scratch);
            canvas.removeEventListener('mouseup', handleEnd);
            canvas.removeEventListener('mouseleave', handleEnd);
            canvas.removeEventListener('touchstart', handleStart);
            canvas.removeEventListener('touchmove', scratch);
            canvas.removeEventListener('touchend', handleEnd);
        };
    }, [scratched]);

    return (
        <div className="relative w-64 h-36 bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-2xl flex flex-col items-center justify-center text-white border-4 border-yellow-200 shadow-lg overflow-hidden select-none animate-bounce">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-300/30 via-transparent to-transparent"></div>
            <span className="text-xl">✨</span>
            <h5 className="font-extrabold text-[13px] tracking-tight leading-none mb-1">CONGRATULATIONS</h5>
            <span className="text-xl font-black text-white tracking-wide">₹25 Wallet Cash!</span>
            <span className="text-[8px] font-bold bg-white/20 px-2 py-0.5 rounded-full mt-2 uppercase tracking-widest leading-none">Code: KK25</span>

            {!scratched && (
                <canvas 
                    ref={canvasRef} 
                    width={256} 
                    height={144} 
                    className="absolute inset-0 w-full h-full cursor-crosshair touch-none rounded-xl"
                />
            )}
        </div>
    );
};

const DeliveryMap = ({ stepIndex }) => {
    // stepIndex: 1 = Placed, 2 = Packing, 3 = On Way, 4 = Delivered
    let vx = 50;
    let vy = 200;
    
    if (stepIndex === 1) { // Placed
        vx = 50; vy = 200;
    } else if (stepIndex === 2) { // Packing
        vx = 125; vy = 200;
    } else if (stepIndex === 3) { // On Way
        vx = 200; vy = 140;
    } else if (stepIndex === 4) { // Delivered
        vx = 450; vy = 80;
    }

    return (
        <div className="relative w-full bg-slate-900 border border-slate-800 rounded-3xl p-4 overflow-hidden shadow-lg select-none">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                <span className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
                    Live Delivery Dispatch Map
                </span>
                <span className="text-[10px] font-bold text-slate-400">Sector 62 Express Logistics</span>
            </div>
            
            <svg viewBox="0 0 500 250" className="w-full h-auto bg-slate-955 rounded-2xl border border-slate-900">
                <defs>
                    <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1E293B" />
                        <stop offset="100%" stopColor="#0F172A" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>

                {/* Park */}
                <rect x="70" y="30" width="100" height="130" rx="12" fill="#064E3B" fillOpacity="0.35" stroke="#059669" strokeWidth="1" strokeDasharray="3" />
                <text x="120" y="90" fill="#34D399" fontSize="10" fontWeight="bold" textAnchor="middle" opacity="0.6">GREEN WOODS PARK</text>

                {/* Grid Blocks */}
                <rect x="230" y="30" width="90" height="90" rx="8" fill="#1E293B" fillOpacity="0.4" />
                <rect x="340" y="30" width="100" height="90" rx="8" fill="#1E293B" fillOpacity="0.4" />
                <rect x="230" y="140" width="210" height="80" rx="8" fill="#1E293B" fillOpacity="0.4" />

                {/* Labels */}
                <text x="275" y="80" fill="#94A3B8" fontSize="8" fontWeight="bold" textAnchor="middle" opacity="0.4">ZONE A RESIDENTIAL</text>
                <text x="390" y="80" fill="#94A3B8" fontSize="8" fontWeight="bold" textAnchor="middle" opacity="0.4">SHOPPING ARCADE</text>
                <text x="335" y="185" fill="#94A3B8" fontSize="8" fontWeight="bold" textAnchor="middle" opacity="0.4">ZONE B COMMERCIAL</text>

                {/* Roads */}
                <path d="M 50 200 L 200 200 L 200 80 L 450 80" fill="none" stroke="#334155" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 50 200 L 200 200 L 200 80 L 450 80" fill="none" stroke="#475569" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 50 200 L 200 200 L 200 80 L 450 80" fill="none" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="6 8" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />

                {/* Warehouse */}
                <circle cx="50" cy="200" r="14" fill="#312E81" stroke="#4F46E5" strokeWidth="2" filter="url(#glow)" />
                <text x="50" y="230" fill="#818CF8" fontSize="9" fontWeight="extrabold" textAnchor="middle">KIRANAKART HUB</text>
                <text x="50" y="203" fill="#FFFFFF" fontSize="10" fontWeight="black" textAnchor="middle">🏬</text>

                {/* Residence */}
                <circle cx="450" cy="80" r="14" fill="#064E3B" stroke="#059669" strokeWidth="2" filter="url(#glow)" />
                <text x="450" y="110" fill="#34D399" fontSize="9" fontWeight="extrabold" textAnchor="middle">YOUR RESIDENCE</text>
                <text x="450" y="83" fill="#FFFFFF" fontSize="10" fontWeight="black" textAnchor="middle">🏠</text>

                {/* Route highlight */}
                {stepIndex === 3 && (
                    <path 
                        d="M 50 200 L 200 200 L 200 80 L 450 80" 
                        fill="none" 
                        stroke="#6366F1" 
                        strokeWidth="4" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeDasharray="12 12" 
                        className="animate-[dash_2s_linear_infinite]"
                    />
                )}

                {/* Rider Icon */}
                {stepIndex < 4 && (
                    <g transform={`translate(${vx - 12}, ${vy - 12})`} className="transition-all duration-1000 ease-in-out">
                        <circle cx="12" cy="12" r="12" fill="#E11D48" stroke="#FFFFFF" strokeWidth="1.5" filter="url(#glow)" />
                        <text x="12" y="16" fill="#FFFFFF" fontSize="11" fontWeight="black" textAnchor="middle" className="animate-bounce">🏍️</text>
                    </g>
                )}
            </svg>
            
            <style>{`
                @keyframes dash {
                    to {
                        stroke-dashoffset: -24;
                    }
                }
            `}</style>
        </div>
    );
};

const formatOrderPriceAndDate = (amount, createdAt, currency) => {
    const formattedAmount = Math.round(amount);
    const date = new Date(createdAt);
    
    // Day
    const day = String(date.getDate()).padStart(2, '0');
    
    // Month
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    
    // Time
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be 12
    
    return `${currency}${formattedAmount} · ${day} ${month}, ${hours}:${minutes} ${ampm}`;
};

const MyOrders = () => {
    const [myOrders, setMyOrders] = useState([])
    const { currency, axios, user, navigate, addresses, getUserAddress, selectedAddress, setSelectedAddress, setShowHelpModal, cartItems, setCartItems } = useAppContext()

    // Sidebar active tab state
    const [activeSidebarTab, setActiveSidebarTab] = useState("My Orders")

    // Interactive product & delivery rating state
    const [orderRatings, setOrderRatings] = useState({})
    
    // Interactive rider tipping state
    const [riderTips, setRiderTips] = useState({})

    const handleSetRating = (orderId, type, rating) => {
        setOrderRatings(prev => ({
            ...prev,
            [orderId]: {
                ...prev[orderId],
                [type]: rating
            }
        }));
    };

    const handleSubmitReview = (orderId) => {
        const rating = orderRatings[orderId] || {};
        if (!rating.productRating || !rating.deliveryRating) {
            toast.error("Please provide ratings for both product and delivery!");
            return;
        }
        setOrderRatings(prev => ({
            ...prev,
            [orderId]: {
                ...prev[orderId],
                submitted: true
            }
        }));
        toast.success("Thank you for your valuable feedback! ⭐");
    };

    // Re-order past order items
    const handleReOrder = (items) => {
        try {
            let cartData = structuredClone(cartItems || {});
            items.forEach((item) => {
                const itemId = item.product._id;
                if (cartData[itemId]) {
                    cartData[itemId] += item.quantity;
                } else {
                    cartData[itemId] = item.quantity;
                }
            });
            setCartItems(cartData);
            toast.success("All past items successfully added to your cart! 🛒");
            navigate('/cart');
        } catch (error) {
            toast.error(error.message);
        }
    };

    // Premium interactive state hooks
    const [simulatedStatus, setSimulatedStatus] = useState(null)
    const [showSimulator, setShowSimulator] = useState(false)
    const [showRiderChat, setShowRiderChat] = useState(false)
    const [scratchCompleted, setScratchCompleted] = useState(false)
    const [rewardCoupon, setRewardCoupon] = useState(null)
    const [isRiderTyping, setIsRiderTyping] = useState(false)
    const [chatInputText, setChatInputText] = useState('')
    const [expandedOrder, setExpandedOrder] = useState(null)
    const [riderMessages, setRiderMessages] = useState([
        { sender: 'rider', text: 'Hi! I am Rajesh. Packing your organic grocery items now! 📦', time: 'Just now' }
    ])

    // Logout Helper
    const logout = async () => {
        try {
            const { data } = await axios.post('/api/user/logout')
            if (data.success) {
                toast.success("Successfully logged out!")
                window.location.href = "/"
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Delete Address Helper
    const handleDeleteAddress = async (addressId) => {
        try {
            const { data } = await axios.post('/api/address/delete', { addressId })
            if (data.success) {
                toast.success("Address deleted successfully!")
                getUserAddress() // Refresh addresses list
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Simulator Auto Cycle engine
    const runAutoCycleDemo = () => {
        setSimulatedStatus('Order Placed');
        setScratchCompleted(false);
        setRewardCoupon(null);
        toast.success("🚀 Simulator Started! Step 1: Order Placed");
        
        setTimeout(() => {
            setSimulatedStatus('Packing');
            toast.success("📦 Step 2: Preparing & Packing Items");
            setRiderMessages(prev => [...prev, { sender: 'rider', text: "Items are packed! Handing over to delivery terminal... 📦", time: 'Just now' }]);
        }, 4000);

        setTimeout(() => {
            setSimulatedStatus('Out for Delivery');
            toast.success("🚚 Step 3: Rider is Out for Delivery!");
            setRiderMessages(prev => [...prev, { sender: 'rider', text: "I have picked up your package! Heading to Sector 62 now. 🏍️", time: 'Just now' }]);
        }, 8000);

        setTimeout(() => {
            setSimulatedStatus('Delivered');
            toast.success("✅ Step 4: Delivered! Scratch Card unlocked! 🎉");
            setRiderMessages(prev => [...prev, { sender: 'rider', text: "Order successfully delivered! Hope to serve you again soon. 😊", time: 'Just now' }]);
        }, 12000);
    };

    // Rider chatbot auto-replies
    const handleSendRiderMessage = (text) => {
        if (!text.trim()) return;
        
        const userMsg = { sender: 'user', text, time: 'Just now' };
        setRiderMessages(prev => [...prev, userMsg]);
        setChatInputText('');
        setIsRiderTyping(true);

        setTimeout(() => {
            let riderReply = "Got it! Navigating city traffic now. 🏍️";
            const lower = text.toLowerCase();
            if (lower.includes('gate') || lower.includes('code')) {
                riderReply = "Understood. I will enter that gate code at the society scanner! 👍";
            } else if (lower.includes('bell') || lower.includes('ring')) {
                riderReply = "Okay, will ring the doorbell once I place the package on your doorstep! 🔔";
            } else if (lower.includes('leave') || lower.includes('door') || lower.includes('guard')) {
                riderReply = "Sure! I will drop it off at the gate/door and leave a secure note! 📦";
            } else if (lower.includes('where') || lower.includes('delay') || lower.includes('time')) {
                riderReply = "I am currently at the red light near Sector 62. Arriving in 3 minutes!";
            }

            setRiderMessages(prev => [...prev, { sender: 'rider', text: riderReply, time: 'Just now' }]);
            setIsRiderTyping(false);
        }, 1200);
    };

    const fetchMyOrders = async () => {
        try {
            const { data } = await axios.get('/api/order/user')
            if (data.success) {
                setMyOrders(data.orders)
                if (data.orders.length > 0) {
                    setExpandedOrder(data.orders[0]._id) // Expand latest order by default
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDownloadInvoice = (order) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const orderDateObj = new Date(order.createdAt);
        const orderDateStr = orderDateObj.toLocaleDateString('en-GB').replace(/\//g, '-');

        const billingName = order.address ? `${order.address.firstName} ${order.address.lastName}` : (user?.name || "Customer");
        const billingStreet = order.address?.street || "Kirana Street Address";
        const billingCity = order.address?.city || "Mohali";
        const billingState = order.address?.state || "Punjab";
        const billingZip = order.address?.zipcode || "160055";
        const billingPhone = order.address?.phone || "9999999999";

        let itemsRowsHtml = '';
        let totalQty = 0;
        let totalGross = 0;
        let totalDiscount = 0;
        let totalTaxable = 0;
        let totalCgst = 0;
        let totalSgst = 0;
        let totalAmount = 0;

        order.items.forEach((item) => {
            const qty = item.quantity || 1;
            const offerPrice = item.product.offerPrice;
            const originalPrice = item.product.price && item.product.price > item.product.offerPrice ? item.product.price : item.product.offerPrice + 15;

            const grossAmount = originalPrice * qty;
            const total = offerPrice * qty;
            const discount = grossAmount - total;
            
            const taxableValue = Number((total / 1.18).toFixed(2));
            const gstAmount = Number((total - taxableValue).toFixed(2));
            const cgst = Number((gstAmount / 2).toFixed(2));
            const sgst = Number((gstAmount - cgst).toFixed(2));

            totalQty += qty;
            totalGross += grossAmount;
            totalDiscount += discount;
            totalTaxable += taxableValue;
            totalCgst += cgst;
            totalSgst += sgst;
            totalAmount += total;

            const categoryDisplay = item.product.category || "General Store";

            itemsRowsHtml += `
                <tr style="border-bottom: 1px solid #e0e0e0; vertical-align: top;">
                    <td style="padding: 10px 8px; font-weight: bold; color: #555;">
                        ${categoryDisplay}<br>
                        <span style="font-size: 9px; font-weight: normal; color: #999;">FSN: SG-${item.product._id.substring(0, 8).toUpperCase()}</span><br>
                        <span style="font-size: 9px; font-weight: normal; color: #999;">HSN/SAC: 21069099</span>
                    </td>
                    <td style="padding: 10px 8px;">
                        <span style="font-weight: bold; font-size: 11px; color: #111;">${item.product.name}</span><br>
                        <span style="font-size: 9px; color: #666;">SGST/UTGST: 9.0%, CGST: 9.0%</span>
                    </td>
                    <td style="padding: 10px 8px; text-align: center;">${qty}</td>
                    <td style="padding: 10px 8px; text-align: right;">${grossAmount.toFixed(2)}</td>
                    <td style="padding: 10px 8px; text-align: right; color: #388e3c;">-${discount.toFixed(2)}</td>
                    <td style="padding: 10px 8px; text-align: right;">${taxableValue.toFixed(2)}</td>
                    <td style="padding: 10px 8px; text-align: right;">${sgst.toFixed(2)}</td>
                    <td style="padding: 10px 8px; text-align: right;">${cgst.toFixed(2)}</td>
                    <td style="padding: 10px 8px; text-align: right; font-weight: bold;">${total.toFixed(2)}</td>
                </tr>
            `;
        });

        const productsSum = totalAmount;
        const extraCharge = order.amount - productsSum;
        if (extraCharge > 0) {
            const extraTaxable = Number((extraCharge / 1.18).toFixed(2));
            const extraGst = Number((extraCharge - extraTaxable).toFixed(2));
            const extraCgst = Number((extraGst / 2).toFixed(2));
            const extraSgst = Number((extraGst - extraCgst).toFixed(2));

            totalQty += 1;
            totalGross += extraCharge;
            totalTaxable += extraTaxable;
            totalCgst += extraCgst;
            totalSgst += extraSgst;
            totalAmount += extraCharge;

            itemsRowsHtml += `
                <tr style="border-bottom: 1px solid #e0e0e0; vertical-align: top;">
                    <td style="padding: 10px 8px; font-weight: bold; color: #555;">
                        Convenience & Delivery<br>
                        <span style="font-size: 9px; font-weight: normal; color: #999;">SAC: 996412</span>
                    </td>
                    <td style="padding: 10px 8px;">
                        <span style="font-weight: bold; font-size: 11px; color: #111;">Handling & Delivery Surcharges</span>
                    </td>
                    <td style="padding: 10px 8px; text-align: center;">1</td>
                    <td style="padding: 10px 8px; text-align: right;">${extraCharge.toFixed(2)}</td>
                    <td style="padding: 10px 8px; text-align: right; color: #388e3c;">0.00</td>
                    <td style="padding: 10px 8px; text-align: right;">${extraTaxable.toFixed(2)}</td>
                    <td style="padding: 10px 8px; text-align: right;">${extraSgst.toFixed(2)}</td>
                    <td style="padding: 10px 8px; text-align: right;">${extraCgst.toFixed(2)}</td>
                    <td style="padding: 10px 8px; text-align: right; font-weight: bold;">${extraCharge.toFixed(2)}</td>
                </tr>
            `;
        }

        const invoiceHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Tax Invoice - ${order._id}</title>
  <style>
    @media print {
      body { margin: 0; padding: 0; background-color: #fff; }
      .no-print { display: none !important; }
      .invoice-container { border: none !important; box-shadow: none !important; padding: 10px !important; }
    }
    body { font-family: Arial, sans-serif; color: #333; margin: 0; padding: 20px; font-size: 11px; line-height: 1.4; background-color: #f5f7f8; }
    .invoice-container { max-width: 850px; margin: 0 auto; background: #fff; padding: 30px; border: 1px solid #d2d2d2; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    table { width: 100%; border-collapse: collapse; }
    th { background-color: #f1f2f4; color: #333; font-weight: bold; text-transform: uppercase; font-size: 9px; padding: 8px; border-bottom: 2px solid #ccc; }
  </style>
</head>
<body>
  <div class="no-print" style="max-width: 850px; margin: 0 auto 15px; display: flex; justify-content: space-between; align-items: center; background: #4F46E5; color: white; padding: 12px 24px; border-radius: 12px; font-family: sans-serif; box-shadow: 0 4px 12px rgba(79,70,229,0.25);">
    <span style="font-weight: 800; font-size: 14px; letter-spacing: -0.2px;">KiranaKart Retail Tax Invoice</span>
    <button onclick="window.print()" style="background: white; color: #4F46E5; border: none; padding: 8px 18px; border-radius: 8px; font-weight: 800; font-size: 12px; cursor: pointer; transition: 0.15s; box-shadow: 0 2px 4px rgba(0,0,0,0.08);">Print / Save PDF</button>
  </div>
  
  <div class="invoice-container">
    <table style="width: 100%; margin-bottom: 20px;">
      <tr>
        <td style="vertical-align: top; width: 65%;">
          <h2 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 900; letter-spacing: -0.5px; color: #111;">Tax Invoice</h2>
          <div style="font-size: 11px; line-height: 1.5;">
            <strong>Sold By:</strong> KiranaKart Retail Private Limited<br>
            <strong>GSTIN:</strong> 03AAAGK9023N1ZX
          </div>
        </td>
        <td style="vertical-align: top; text-align: right; width: 35%;">
          <div style="border: 1px solid #333; padding: 6px 12px; font-weight: bold; font-size: 11px; display: inline-block; background-color: #fafafa;">
            Invoice Number # LIABSG${order._id.substring(0, 10).toUpperCase()}
          </div>
        </td>
      </tr>
    </table>

    <hr style="border: none; border-top: 1px solid #d2d2d2; margin: 15px 0;" />

    <table style="width: 100%; margin-bottom: 25px; font-size: 10.5px;">
      <tr>
        <td style="vertical-align: top; width: 33%; padding-right: 15px;">
          <div style="line-height: 1.6;">
            <strong>Order ID:</strong> OD${order._id}<br>
            <strong>Order Date:</strong> ${orderDateStr}<br>
            <strong>Invoice Date:</strong> ${orderDateStr}
          </div>
        </td>
        <td style="vertical-align: top; width: 33%; padding-right: 15px; border-left: 1px solid #eaeaea; padding-left: 15px;">
          <strong>Bill To</strong><br>
          <div style="margin-top: 5px; line-height: 1.5; color: #444;">
            <strong>${billingName}</strong><br>
            ${billingStreet}, Sector 62,<br>
            ${billingCity}, ${billingState} - ${billingZip}<br>
            <strong>Phone:</strong> ${billingPhone}
          </div>
        </td>
        <td style="vertical-align: top; width: 34%; border-left: 1px solid #eaeaea; padding-left: 15px;">
          <strong>Ship To</strong><br>
          <div style="margin-top: 5px; line-height: 1.5; color: #444;">
            <strong>${billingName}</strong><br>
            ${billingStreet}, Sector 62,<br>
            ${billingCity}, ${billingState} - ${billingZip}<br>
            <strong>Phone:</strong> ${billingPhone}
          </div>
        </td>
      </tr>
    </table>

    <div style="font-weight: bold; margin-bottom: 8px; font-size: 11px;">Total items: ${order.items.length}</div>

    <table style="margin-bottom: 20px;">
      <thead>
        <tr>
          <th style="width: 20%; text-align: left;">Product</th>
          <th style="width: 32%; text-align: left;">Title</th>
          <th style="width: 5%; text-align: center;">Qty</th>
          <th style="width: 9%; text-align: right;">Gross ₹</th>
          <th style="width: 10%; text-align: right;">Discount ₹</th>
          <th style="width: 9%; text-align: right;">Taxable ₹</th>
          <th style="width: 7%; text-align: right;">SGST ₹</th>
          <th style="width: 7%; text-align: right;">CGST ₹</th>
          <th style="width: 8%; text-align: right;">Total ₹</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRowsHtml}
        <tr style="font-weight: bold; background-color: #fafafa; border-top: 2px solid #ccc; border-bottom: 2px solid #ccc;">
          <td colspan="2" style="padding: 10px 8px; text-align: right; font-size: 11px;">Total</td>
          <td style="padding: 10px 8px; text-align: center;">${totalQty}</td>
          <td style="padding: 10px 8px; text-align: right;">${totalGross.toFixed(2)}</td>
          <td style="padding: 10px 8px; text-align: right; color: #388e3c;">-${totalDiscount.toFixed(2)}</td>
          <td style="padding: 10px 8px; text-align: right;">${totalTaxable.toFixed(2)}</td>
          <td style="padding: 10px 8px; text-align: right;">${totalSgst.toFixed(2)}</td>
          <td style="padding: 10px 8px; text-align: right;">${totalCgst.toFixed(2)}</td>
          <td style="padding: 10px 8px; text-align: right;">${totalAmount.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <table style="width: 100%; margin-top: 15px; margin-bottom: 30px;">
      <tr>
        <td style="width: 60%;"></td>
        <td style="width: 40%; text-align: right;">
          <div style="font-size: 15px; font-weight: bold; color: #111;">
            Grand Total: <span style="font-size: 18px; color: #000; font-weight: 900;">₹${order.amount.toFixed(2)}</span>
          </div>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>
        `;

        printWindow.document.open();
        printWindow.document.write(invoiceHtml);
        printWindow.document.close();
    };

    const generateRewardCoupon = () => {
        const isFlat = Math.random() > 0.5;
        if (isFlat) {
            const amount = Math.floor(Math.random() * 36) + 15;
            const code = `KIRANA${amount}`;
            return {
                code,
                type: 'flat',
                value: amount,
                desc: `Flat ₹${amount} OFF on your next order!`
            };
        } else {
            const options = [
                { cat: 'Cold Drinks & Juices', code: 'DRINK25', val: 25, desc: '25% OFF on Cold Drinks & Juices!' },
                { cat: 'Snacks & Munchies', code: 'SNACK20', val: 20, desc: '20% OFF on Snacks & Munchies!' },
                { cat: 'Dairy, Bread & Eggs', code: 'DAIRY15', val: 15, desc: '15% OFF on Dairy, Bread & Eggs!' },
                { cat: 'Fruits & Vegetables', code: 'FRESH30', val: 30, desc: '30% OFF on Fruits & Vegetables!' },
                { cat: 'Paan Corner', code: 'PAAN50', val: 50, desc: '50% OFF on Paan Corner items!' }
            ];
            const selected = options[Math.floor(Math.random() * options.length)];
            return {
                code: selected.code,
                type: 'category',
                value: selected.val,
                category: selected.cat,
                desc: selected.desc
            };
        }
    };

    useEffect(() => {
        const activeStatus = simulatedStatus || (myOrders[0] ? myOrders[0].status : null);
        if (activeStatus === 'Delivered' && !rewardCoupon) {
            setRewardCoupon(generateRewardCoupon());
        }
    }, [simulatedStatus, myOrders, rewardCoupon]);

    useEffect(() => {
        if (simulatedStatus) {
            playChimeSound(simulatedStatus === 'Order Placed' ? 'Placed' : simulatedStatus);
        }
    }, [simulatedStatus]);

    useEffect(() => {
        if (user) {
            fetchMyOrders()
            getUserAddress()
        }
    }, [user])

    return (
        <div className="mt-28 pb-24 px-4 max-w-6xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-3xl shadow-[0_4px_25px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col lg:flex-row min-h-[650px]">
                
                {/* Left Sidebar Layout matching screenshot exactly */}
                <div className="w-full lg:w-72 shrink-0 bg-white border-r border-gray-150 flex flex-col">
                    
                    {/* Active Phone number displaying top-left panel */}
                    <div className="text-center py-6 border-b border-gray-150 flex items-center justify-center h-20 shrink-0">
                        <p className="text-sm font-bold text-gray-700 tracking-wider">
                            {user?.phone || "+917986312767"}
                        </p>
                    </div>

                    {/* Nav Panel lists */}
                    <div className="flex flex-col flex-grow">
                        {[
                            { label: "My Addresses", icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                </svg>
                            ) },
                            { label: "My Orders", icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z" />
                                </svg>
                            ) },
                            { label: "Help", icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                                </svg>
                            ) },
                            { label: "Logout", icon: (
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                </svg>
                            ), action: logout }
                        ].map((item) => (
                            <button
                                key={item.label}
                                onClick={() => {
                                    if (item.label === "Help") {
                                        setShowHelpModal(true);
                                    } else if (item.action) {
                                        item.action();
                                    } else {
                                        setActiveSidebarTab(item.label);
                                    }
                                }}
                                className={`flex items-center gap-4 px-6 py-5 text-sm font-medium transition duration-150 w-full text-left border-b border-gray-150 cursor-pointer ${
                                    activeSidebarTab === item.label
                                        ? "bg-[#F3F4F6] text-gray-900 font-bold"
                                        : "text-gray-500 bg-white hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <span className={`w-5 h-5 flex items-center justify-center shrink-0 ${activeSidebarTab === item.label ? 'text-gray-800' : 'text-gray-400'}`}>{item.icon}</span>
                                <span className="text-[13px] tracking-tight">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right Orders Panel */}
                <div className="flex-1 bg-[#F3F4F9] p-6 md:p-8 relative flex flex-col min-h-[600px]">
                    {/* Top-Right Decorative Triangles */}
                    <div className="absolute top-4 right-6 flex gap-1 select-none pointer-events-none">
                        <span className="text-[7px] text-gray-400">▲</span>
                        <span className="text-[7px] text-gray-400">▲</span>
                        <span className="text-[7px] text-gray-400">▲</span>
                    </div>

                    {activeSidebarTab === "My Orders" ? (
                        <div className="flex-grow space-y-4 max-w-3xl">
                            {myOrders.length === 0 ? (
                                <div className="py-16 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-[#4F46E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-extrabold text-gray-800 text-base">No orders placed yet</h3>
                                    <p className="text-xs text-gray-400 mt-1">Your ordered items will show up here!</p>
                                </div>
                            ) : (
                                myOrders.map((order, index) => {
                                    const activeStatus = index === 0 && simulatedStatus ? simulatedStatus : order.status;
                                const isCancelled = activeStatus === 'Cancelled';
                                const isDelivered = activeStatus === 'Delivered';
                                const isExpanded = expandedOrder === order._id;
                                
                                // Determine duration (15 to 30 mins) based on order ID character sum for realism
                                const charSum = order._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
                                const duration = 15 + (charSum % 16);

                                return (
                                    <div 
                                        key={order._id} 
                                        className={`border border-gray-200/80 rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.01)] overflow-hidden transition-all duration-300 ${
                                            isExpanded ? 'ring-1 ring-[#4F46E5]/15' : ''
                                        }`}
                                    >
                                        
                                        {/* Main Box Header Summary Row matching Mockup exactly */}
                                        <div 
                                            onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                            className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition duration-150"
                                        >
                                            <div className="flex items-center gap-4">
                                                
                                                {/* Green Rounded-Square Icon Checkmark status badge */}
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                                    isCancelled 
                                                        ? 'bg-rose-50 text-rose-600'
                                                        : isDelivered 
                                                        ? 'bg-[#E6F7ED] text-[#00B050]'
                                                        : 'bg-indigo-50 text-[#4F46E5]'
                                                }`}>
                                                    {isCancelled ? (
                                                        <span className="text-xs font-bold">✕</span>
                                                    ) : isDelivered ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        <span className="relative flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                                                        </span>
                                                    )}
                                                </div>
 
                                                <div className="text-left">
                                                    <h3 className="text-sm font-black text-gray-900 tracking-tight leading-tight">
                                                        {activeStatus === 'Order Placed' ? 'Placed' :
                                                         activeStatus === 'Packing' ? 'Packing' :
                                                         activeStatus === 'Out for Delivery' ? 'Out for Delivery' :
                                                         activeStatus === 'Delivered' ? 'Delivered' :
                                                         activeStatus === 'Cancelled' ? 'Cancelled' : 
                                                         activeStatus}
                                                    </h3>
                                                    <p className="text-xs font-semibold text-gray-500 mt-1">
                                                        {formatOrderPriceAndDate(order.amount, order.createdAt, currency)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleReOrder(order.items);
                                                    }}
                                                    className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-[#4F46E5] hover:bg-[#4F46E5] hover:text-white font-extrabold text-[9px] rounded-lg shadow-3xs transition active:scale-95 cursor-pointer uppercase tracking-wider flex items-center gap-1"
                                                >
                                                    🔁 Re-Order
                                                </button>
                                                <span className={`text-[#333333] text-sm font-bold transition-all duration-300 ${isExpanded ? 'rotate-90 text-[#4F46E5]' : ''}`}>
                                                    →
                                                </span>
                                            </div>
                                        </div>

                                        {/* Horizontal product list thumbnails */}
                                        <div className="px-5 pb-5 pt-4 flex flex-wrap gap-3 items-center border-t border-gray-100">
                                            {(order.items.length <= 5 ? order.items : order.items.slice(0, 4)).map((item, itemIdx) => (
                                                <div 
                                                    key={itemIdx} 
                                                    className="w-14 h-14 bg-white border border-gray-200 rounded-xl p-1.5 flex items-center justify-center shrink-0 shadow-sm hover:scale-105 transition duration-150"
                                                    title={item.product?.name || "Product"}
                                                >
                                                    {item.product?.image?.[0] && (
                                                        <img src={item.product.image[0]} alt="" className="w-full h-full object-contain" />
                                                    )}
                                                </div>
                                            ))}
                                            {order.items.length > 5 && (
                                                <div className="w-14 h-14 bg-[#F3F4F6] border border-gray-200 rounded-xl flex items-center justify-center shrink-0 text-xs font-medium text-gray-500 shadow-sm select-none">
                                                    +{order.items.length - 4}
                                                </div>
                                            )}
                                        </div>

                                        {/* Detailed Expanded Section */}
                                        {isExpanded && (
                                            <div className="border-t border-gray-100 bg-slate-50/20 p-5 space-y-6 animate-fadeIn">
                                                
                                                {/* LIVE TRACKING TIMELINE & MAP */}
                                                {index === 0 && isTrackingVisible(order, simulatedStatus) && (
                                                    <div className="p-5 bg-white border border-gray-150 rounded-3xl shadow-3xs space-y-6">
                                                        
                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                                                            <div className="flex items-center gap-2">
                                                                <span className="relative flex h-2.5 w-2.5">
                                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                                                </span>
                                                                <span className="text-xs font-black text-gray-800 uppercase tracking-wider">Live Tracking & Simulator</span>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                <button 
                                                                    onClick={() => setShowSimulator(!showSimulator)} 
                                                                    className="px-2.5 py-1 text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition cursor-pointer select-none"
                                                                >
                                                                    {showSimulator ? "hide tools ⚙️" : "developer panel ⚙️"}
                                                                </button>
                                                                {!isCancelled && (
                                                                    <button 
                                                                        onClick={() => setShowRiderChat(!showRiderChat)} 
                                                                        className="px-2.5 py-1 text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg hover:bg-emerald-100 transition cursor-pointer select-none flex items-center gap-1"
                                                                    >
                                                                        💬 Rider Chat {showRiderChat ? "(hide)" : "(open)"}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Sandbox Simulator Panel */}
                                                        {showSimulator && (
                                                            <div className="mb-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl text-white">
                                                                <div className="flex items-center justify-between mb-2">
                                                                    <span className="text-xs font-black text-yellow-400 uppercase tracking-widest">⚙️ Sandbox Overrides</span>
                                                                    <span className="text-[9px] font-bold px-2 py-0.5 bg-yellow-400/10 text-yellow-400 rounded-md">Developer</span>
                                                                </div>
                                                                <p className="text-[10px] font-semibold text-slate-400 mb-3 leading-snug">
                                                                    Change delivery lifecycle states below to test SVG map driving vectors, confetti, and canvas reward cards!
                                                                </p>
                                                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                                                    {['Order Placed', 'Packing', 'Out for Delivery', 'Delivered'].map((st, sIdx) => (
                                                                        <button 
                                                                            key={st}
                                                                            onClick={() => { setSimulatedStatus(st); setScratchCompleted(false); setRewardCoupon(null); toast.success(`Simulating: ${st}`); }}
                                                                            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${activeStatus === st ? 'bg-indigo-650 border-indigo-500 text-white font-black' : 'bg-slate-800 border-slate-700 text-slate-300'}`}
                                                                        >
                                                                            {st}
                                                                        </button>
                                                                    ))}
                                                                    <button 
                                                                        onClick={() => { setSimulatedStatus('Cancelled'); setScratchCompleted(false); setRewardCoupon(null); toast.error("Simulating: Cancelled"); }}
                                                                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer col-span-2 sm:col-span-1 ${activeStatus === 'Cancelled' ? 'bg-rose-500 border-rose-400 text-white font-black' : 'bg-slate-800 border-slate-700 text-rose-350'}`}
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                                <button 
                                                                    onClick={runAutoCycleDemo}
                                                                    className="mt-3 w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-black text-xs py-2 px-4 rounded-xl active:scale-98 transition duration-150 cursor-pointer shadow-md"
                                                                >
                                                                    🚀 Trigger 12-Second Delivery Cycle Demo
                                                                </button>
                                                            </div>
                                                        )}

                                                        {/* RIDER CHATBOX */}
                                                        {showRiderChat && !isCancelled && (
                                                            <div className="mb-4 p-4 bg-white border border-gray-150 rounded-2xl shadow-3xs space-y-3">
                                                                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                                                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white text-xs">RK</div>
                                                                    <div className="text-left">
                                                                        <h6 className="text-xs font-black text-gray-800">Rajesh Kumar (Delivery Executive)</h6>
                                                                        <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1">
                                                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                                                            Online · 1.2 km away
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                <div className="h-40 overflow-y-auto space-y-2 p-2 bg-[#F9FAFB] rounded-xl border border-gray-100 flex flex-col no-scrollbar">
                                                                    {riderMessages.map((msg, mIdx) => (
                                                                        <div 
                                                                            key={mIdx} 
                                                                            className={`max-w-[80%] rounded-2xl p-2.5 text-xs font-semibold leading-relaxed ${
                                                                                msg.sender === 'rider' 
                                                                                    ? 'bg-emerald-50 border border-emerald-100 text-emerald-955 align-left self-start rounded-tl-none' 
                                                                                    : 'bg-[#4F46E5] text-white self-end rounded-tr-none'
                                                                            }`}
                                                                        >
                                                                            <p className="leading-snug text-left">{msg.text}</p>
                                                                            <span className="text-[8px] font-medium opacity-60 block text-right mt-1">{msg.time}</span>
                                                                        </div>
                                                                    ))}
                                                                    {isRiderTyping && (
                                                                        <div className="bg-emerald-50 text-emerald-955 self-start p-2.5 rounded-2xl rounded-tl-none text-xs border border-emerald-100 font-bold flex items-center gap-1.5">
                                                                            <span className="text-[10px]">Rajesh is typing</span>
                                                                            <span className="flex gap-1">
                                                                                <span className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce"></span>
                                                                                <span className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                                                                <span className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                <div className="flex flex-wrap gap-1.5">
                                                                    {["Leave package at door 🚪", "Call me when arrived 📞", "Ring the doorbell 🔔"].map((tag) => (
                                                                        <button 
                                                                            key={tag} 
                                                                            onClick={() => handleSendRiderMessage(tag)}
                                                                            className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[10px] font-bold text-gray-600 rounded-full transition cursor-pointer"
                                                                        >
                                                                            {tag}
                                                                        </button>
                                                                    ))}
                                                                </div>

                                                                <div className="flex gap-2">
                                                                    <input 
                                                                        value={chatInputText}
                                                                        onChange={(e) => setChatInputText(e.target.value)}
                                                                        onKeyDown={(e) => e.key === 'Enter' && handleSendRiderMessage(chatInputText)}
                                                                        placeholder="Message rider..." 
                                                                        className="w-full text-xs font-semibold px-3 py-2 border border-gray-250 rounded-xl outline-none focus:border-gray-400 transition"
                                                                    />
                                                                    <button 
                                                                        onClick={() => handleSendRiderMessage(chatInputText)}
                                                                        className="px-4 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-black text-xs rounded-xl active:scale-95 transition"
                                                                    >
                                                                        Send
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* MAP COMPONENT INJECTED */}
                                                        <DeliveryMap stepIndex={getTrackingStepIndex(activeStatus)} />

                                                        {/* TIMELINE PROGRESS STEPPER */}
                                                        {isCancelled ? (
                                                            <div className="flex items-center gap-2.5 p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 text-xs font-bold">
                                                                <span className="text-xl">🚫</span>
                                                                <div className="text-left">
                                                                    <p className="font-extrabold uppercase text-[10.5px] tracking-wide text-rose-800">Order Cancelled</p>
                                                                    <p className="mt-0.5 font-semibold text-rose-600">This transaction was aborted. Refund of {currency}{order.amount.toFixed(2)} has been cleared.</p>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-4">
                                                                <div className="relative flex items-center justify-between w-full px-2 mt-2">
                                                                    <div className="absolute left-8 right-8 top-3.5 h-[3px] bg-gray-200 -z-0"></div>
                                                                    <div 
                                                                        className="absolute left-8 top-3.5 h-[3px] bg-[#4F46E5] transition-all duration-500 -z-0"
                                                                        style={{ 
                                                                            width: `${
                                                                                getTrackingStepIndex(activeStatus) === 1 ? '0%' :
                                                                                getTrackingStepIndex(activeStatus) === 2 ? '33%' :
                                                                                getTrackingStepIndex(activeStatus) === 3 ? '66%' : '100%'
                                                                            }` 
                                                                        }}
                                                                    ></div>

                                                                    {['Placed', 'Packing', 'On Way', 'Delivered'].map((label, stepIdx) => {
                                                                        const stepNum = stepIdx + 1;
                                                                        const activeStep = getTrackingStepIndex(activeStatus);
                                                                        const isDone = activeStep >= stepNum;
                                                                        
                                                                        return (
                                                                            <div key={label} className="flex flex-col items-center gap-1.5 relative z-10 w-16 select-none">
                                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-3xs border-2 transition-all duration-300 ${
                                                                                    isDone 
                                                                                        ? 'bg-[#4F46E5] border-[#4F46E5] text-white' 
                                                                                        : 'bg-white border-gray-300 text-gray-400'
                                                                                }`}>
                                                                                    {isDone ? '✓' : stepNum}
                                                                                </div>
                                                                                <span className={`text-[10px] font-black uppercase tracking-tight text-center leading-none ${
                                                                                    isDone ? 'text-[#4F46E5]' : 'text-gray-400'
                                                                                }`}>
                                                                                    {label}
                                                                                </span>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>

                                                                {/* SCRATCH REWARD FOR DELIVERED ITEMS */}
                                                                {isDelivered && (
                                                                    <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col items-center justify-center text-center animate-fadeIn">
                                                                        <div className="max-w-sm mb-4">
                                                                            <span className="text-xl">🎁</span>
                                                                            <h5 className="font-extrabold text-sm text-gray-800 tracking-tight leading-none mb-1">Interactive Delivery Reward Card!</h5>
                                                                            <p className="text-[10.5px] text-gray-400 font-semibold leading-relaxed">
                                                                                Scratch the metallic shield below to claim your cashback wallet gift card!
                                                                            </p>
                                                                        </div>

                                                                        {!scratchCompleted ? (
                                                                            <ScratchCard onComplete={() => {
                                                                                setScratchCompleted(true);
                                                                                if (rewardCoupon) {
                                                                                    const existing = JSON.parse(localStorage.getItem('kiranakart_unlocked_coupons') || '[]');
                                                                                    if (!existing.some(c => c.code === rewardCoupon.code)) {
                                                                                        existing.push(rewardCoupon);
                                                                                        localStorage.setItem('kiranakart_unlocked_coupons', JSON.stringify(existing));
                                                                                    }
                                                                                }
                                                                                toast.success("🎉 Reward claimed! Coupon saved to your profile.");
                                                                            }} />
                                                                        ) : (
                                                                            rewardCoupon && (
                                                                                <div className="mt-3.5 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl max-w-xs flex flex-col items-center gap-2.5 shadow-sm text-center animate-fadeIn">
                                                                                    <span className="text-2xl animate-bounce">🏆</span>
                                                                                    <div className="text-[11px] font-black uppercase text-amber-800 tracking-wider">Scratch Card Unlocked!</div>
                                                                                    <div className="bg-white border border-dashed border-amber-300 text-amber-950 font-black text-sm px-3.5 py-1.5 rounded-lg select-all">
                                                                                        {rewardCoupon.code}
                                                                                    </div>
                                                                                    <p className="text-[10px] text-amber-700/80 font-bold leading-tight">
                                                                                        {rewardCoupon.desc}
                                                                                    </p>
                                                                                    <button 
                                                                                        onClick={() => {
                                                                                            navigator.clipboard.writeText(rewardCoupon.code);
                                                                                            toast.success("📋 Coupon copied to clipboard!");
                                                                                        }}
                                                                                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-[10px] rounded-lg shadow-sm transition active:scale-95 cursor-pointer uppercase tracking-wider"
                                                                                    >
                                                                                        Copy Code 📋
                                                                                    </button>
                                                                                </div>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Products item details inside expanded view */}
                                                <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-3xs space-y-3">
                                                    <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-2">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ordered Items</span>
                                                        <button 
                                                            onClick={() => handleDownloadInvoice(order)} 
                                                            className="px-3.5 py-1.5 bg-[#4F46E5]/10 hover:bg-[#4F46E5] hover:text-white text-[#4F46E5] text-xs font-extrabold rounded-lg shadow-3xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                                                        >
                                                            📄 Download Invoice
                                                        </button>
                                                    </div>

                                                    {order.items.map((item, itemIdx) => (
                                                        <div 
                                                            key={itemIdx} 
                                                            className="flex items-center justify-between text-xs py-3 border-b border-gray-50 last:border-0"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-lg p-1.5 flex items-center justify-center shrink-0">
                                                                    <img src={item.product.image[0]} alt="" className="w-full h-full object-contain" />
                                                                </div>
                                                                <div className="text-left">
                                                                    <h4 className="font-bold text-gray-800 leading-snug">
                                                                        {item.product.name}
                                                                    </h4>
                                                                    <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Category: {item.product.category}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-black text-gray-800">{currency}{item.product.offerPrice} x {item.quantity}</p>
                                                                <span className="inline-block px-1.5 py-0.5 bg-green-50 text-green-600 rounded-md font-bold text-[8px] uppercase mt-1">{order.status}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Green Eco-Impact Badge */}
                                                {activeStatus === 'Delivered' && (
                                                    <div className="bg-emerald-50/40 border border-emerald-150 rounded-2xl p-4 flex items-center gap-4 text-left shadow-3xs animate-fadeIn">
                                                        <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center shrink-0 text-lg shadow-3xs border border-emerald-100">🌱</div>
                                                        <div>
                                                            <h5 className="font-extrabold text-xs text-emerald-800">Your Green Impact!</h5>
                                                            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5 leading-normal">
                                                                Delivered via electric eco-vehicles! You saved **1.4 kg of Carbon Emissions** and contributed to a plastic-free neighborhood. Thank you! 🌍
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Interactive product & delivery rating section */}
                                                {activeStatus === 'Delivered' && (
                                                    <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-3xs space-y-4">
                                                        <div className="border-b border-gray-100 pb-2 mb-2 flex items-center justify-between">
                                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-left block">Rate Your Order</span>
                                                            <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-md font-bold text-[8px] uppercase tracking-wide">Delivered</span>
                                                        </div>

                                                        {orderRatings[order._id]?.submitted ? (
                                                            <div className="text-center py-6 animate-fadeIn">
                                                                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2 text-xl">🎉</div>
                                                                <h4 className="font-extrabold text-gray-800 text-sm">Feedback Submitted Successfully!</h4>
                                                                <p className="text-[10px] text-gray-400 font-semibold mt-1">Thank you for rating our service! Your feedback keeps us improving.</p>
                                                                
                                                                <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-600 font-bold bg-slate-50 py-2.5 px-4 rounded-xl border border-gray-100 max-w-sm mx-auto">
                                                                    <div>Product: <span className="text-yellow-500">{"★".repeat(orderRatings[order._id].productRating)}{"☆".repeat(5 - orderRatings[order._id].productRating)}</span></div>
                                                                    <div className="w-px h-3 bg-gray-200"></div>
                                                                    <div>Delivery: <span className="text-yellow-500">{"★".repeat(orderRatings[order._id].deliveryRating)}{"☆".repeat(5 - orderRatings[order._id].deliveryRating)}</span></div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                                                                {/* Rate Product Column */}
                                                                <div className="space-y-2 text-left">
                                                                    <h5 className="font-extrabold text-xs text-gray-700">1. Rate Ordered Product(s)</h5>
                                                                    <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">How would you rate the freshness and packaging of your items?</p>
                                                                    <div className="flex gap-1.5 pt-1">
                                                                        {[1, 2, 3, 4, 5].map((star) => {
                                                                            const isSelected = star <= (orderRatings[order._id]?.productRating || 0);
                                                                            return (
                                                                                <button
                                                                                    key={star}
                                                                                    type="button"
                                                                                    onClick={() => handleSetRating(order._id, 'productRating', star)}
                                                                                    className={`text-xl transition duration-150 transform hover:scale-115 active:scale-95 cursor-pointer ${
                                                                                        isSelected ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
                                                                                    }`}
                                                                                >
                                                                                    ★
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>

                                                                {/* Rate Delivery Column */}
                                                                <div className="space-y-2 text-left">
                                                                    <h5 className="font-extrabold text-xs text-gray-700">2. Rate Delivery Partner</h5>
                                                                    <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">How would you rate the behavior and delivery speed of the rider?</p>
                                                                    <div className="flex gap-1.5 pt-1">
                                                                        {[1, 2, 3, 4, 5].map((star) => {
                                                                            const isSelected = star <= (orderRatings[order._id]?.deliveryRating || 0);
                                                                            return (
                                                                                <button
                                                                                    key={star}
                                                                                    type="button"
                                                                                    onClick={() => handleSetRating(order._id, 'deliveryRating', star)}
                                                                                    className={`text-xl transition duration-150 transform hover:scale-115 active:scale-95 cursor-pointer ${
                                                                                        isSelected ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
                                                                                    }`}
                                                                                >
                                                                                    ★
                                                                                </button>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>

                                                                {/* Rider Tipping Column */}
                                                                <div className="md:col-span-2 space-y-2 text-left pt-2 border-t border-gray-100">
                                                                    <h5 className="font-extrabold text-xs text-gray-700">3. Support Delivery Hero (Appreciation Tip)</h5>
                                                                    <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                                                                        100% of your tip goes directly to Rajesh for his express service.
                                                                    </p>
                                                                    <div className="flex flex-wrap gap-2.5 pt-1">
                                                                        {[10, 20, 50].map((amount) => {
                                                                            const isSelected = riderTips[order._id] === amount;
                                                                            return (
                                                                                <button
                                                                                    key={amount}
                                                                                    type="button"
                                                                                    onClick={() => {
                                                                                        setRiderTips(prev => ({ ...prev, [order._id]: amount }));
                                                                                        toast.success(`Added ₹${amount} tip for Rajesh! 🏍️`);
                                                                                    }}
                                                                                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-black transition cursor-pointer ${
                                                                                        isSelected 
                                                                                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-3xs' 
                                                                                            : 'bg-white border-gray-250 text-gray-600 hover:bg-gray-50'
                                                                                    }`}
                                                                                >
                                                                                    + ₹{amount}
                                                                                </button>
                                                                            );
                                                                        })}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => {
                                                                                const customAmt = prompt("Enter custom tip amount (₹):");
                                                                                if (customAmt && !isNaN(customAmt) && parseInt(customAmt) > 0) {
                                                                                    setRiderTips(prev => ({ ...prev, [order._id]: parseInt(customAmt) }));
                                                                                    toast.success(`Added ₹${customAmt} custom tip! 🏍️`);
                                                                                }
                                                                            }}
                                                                            className={`px-3 py-1.5 rounded-xl border text-[11px] font-black transition cursor-pointer ${
                                                                                riderTips[order._id] && ![10, 20, 50].includes(riderTips[order._id])
                                                                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-3xs' 
                                                                                    : 'bg-white border-gray-250 text-gray-600 hover:bg-gray-50'
                                                                            }`}
                                                                        >
                                                                            {riderTips[order._id] && ![10, 20, 50].includes(riderTips[order._id]) 
                                                                                ? `₹${riderTips[order._id]} Custom` 
                                                                                : "Custom Tip"}
                                                                        </button>
                                                                    </div>
                                                                </div>

                                                                <div className="md:col-span-2 pt-2 border-t border-gray-50 flex justify-end">
                                                                    <button
                                                                        onClick={() => handleSubmitReview(order._id)}
                                                                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition active:scale-95 cursor-pointer uppercase tracking-wider"
                                                                    >
                                                                        Submit Review
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                    ) : activeSidebarTab === "My Addresses" ? (
                        <div className="flex-grow max-w-3xl space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-gray-150 shadow-3xs">
                                <div className="text-left">
                                    <h3 className="font-extrabold text-gray-800 text-lg">My Addresses</h3>
                                    <p className="text-xs text-gray-400 font-semibold mt-1">Manage your saved delivery locations</p>
                                </div>
                                <button
                                    onClick={() => navigate('/add-address')}
                                    className="px-4 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-extrabold text-xs rounded-xl shadow-sm transition active:scale-95 cursor-pointer uppercase tracking-wider"
                                >
                                    + Add New Address
                                </button>
                            </div>

                            {addresses.length === 0 ? (
                                <div className="py-16 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">📍</span>
                                    </div>
                                    <h3 className="font-extrabold text-gray-800 text-base">No saved addresses</h3>
                                    <p className="text-xs text-gray-400 mt-1">Please add a shipping address to place orders!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {addresses.map((addr) => {
                                        const isActive = selectedAddress && selectedAddress._id === addr._id;
                                        return (
                                            <div 
                                                key={addr._id} 
                                                className={`p-5 rounded-2xl bg-white border transition duration-150 flex flex-col justify-between h-48 shadow-3xs relative overflow-hidden ${
                                                    isActive ? 'border-[#4F46E5] ring-1 ring-[#4F46E5]/10' : 'border-gray-150 hover:border-gray-300'
                                                }`}
                                            >
                                                {/* Header Category Tag */}
                                                <div className="flex justify-between items-start">
                                                    <span className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg text-[10px] font-black uppercase text-gray-600 tracking-wider flex items-center gap-1.5 select-none">
                                                        {addr.category === 'home' ? '🏠 Home' : addr.category === 'Work' ? '🏢 Work' : '📍 Other'}
                                                    </span>
                                                    {isActive && (
                                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md font-bold text-[8px] uppercase tracking-wide">
                                                            Active
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="text-left mt-3">
                                                    <h4 className="font-extrabold text-gray-900 text-sm">{addr.firstName} {addr.lastName}</h4>
                                                    <p className="text-xs text-gray-500 font-semibold mt-1 leading-snug truncate w-full" title={`${addr.street}, ${addr.city}`}>
                                                        {addr.street}, {addr.city}
                                                    </p>
                                                    <p className="text-[11px] text-gray-400 font-semibold mt-0.5">{addr.state}, {addr.zipcode}, {addr.country}</p>
                                                    <p className="text-xs text-gray-700 font-bold mt-2">📞 {addr.phone}</p>
                                                </div>

                                                <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-3">
                                                    {!isActive ? (
                                                        <button 
                                                            onClick={() => {
                                                                setSelectedAddress(addr);
                                                                toast.success("Active address updated!");
                                                            }}
                                                            className="text-xs font-bold text-[#4F46E5] hover:text-[#4338CA] transition cursor-pointer"
                                                        >
                                                            Set as Active
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs font-bold text-gray-400">Currently Active</span>
                                                    )}
                                                    
                                                    <button 
                                                        onClick={() => handleDeleteAddress(addr._id)}
                                                        className="text-xs font-bold text-rose-500 hover:text-rose-700 transition cursor-pointer"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default MyOrders
