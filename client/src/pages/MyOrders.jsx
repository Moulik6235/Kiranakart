import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'

const getTrackingStepIndex = (status) => {
    const s = status ? status.toLowerCase() : '';
    if (s.includes('delivered')) return 4;
    if (s.includes('out') || s.includes('delivery')) return 3;
    if (s.includes('pack') || s.includes('prepare')) return 2;
    return 1; // placed
}

const isTrackingVisible = (order, simulatedStatus) => {
    if (!order) return false;
    const status = simulatedStatus || order.status;
    if (status !== 'Delivered' && status !== 'Cancelled') {
        return true; // Keep visible while in-progress
    }
    if (simulatedStatus) return true; // Always keep visible if simulated to allow testing
    const timeDiffMs = new Date() - new Date(order.updatedAt);
    const minutesElapsed = timeDiffMs / (1000 * 60);
    return minutesElapsed < 10; // Disappear after 10 minutes
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
        ctx.font = 'bold 13px "Plus Jakarta Sans"';
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

const MyOrders = () => {
    const [myOrders, setMyOrders] = useState([])
    const { currency, axios, user } = useAppContext()

    // Premium interactive state hooks
    const [simulatedStatus, setSimulatedStatus] = useState(null)
    const [showSimulator, setShowSimulator] = useState(false)
    const [showRiderChat, setShowRiderChat] = useState(false)
    const [scratchCompleted, setScratchCompleted] = useState(false)
    const [rewardCoupon, setRewardCoupon] = useState(null)
    const [isRiderTyping, setIsRiderTyping] = useState(false)
    const [chatInputText, setChatInputText] = useState('')
    const [riderMessages, setRiderMessages] = useState([
        { sender: 'rider', text: 'Hi! I am Rajesh. Packing your organic grocery items now! 📦', time: 'Just now' }
    ])

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
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDownloadInvoice = (order) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        // Date calculations
        const orderDateObj = new Date(order.createdAt);
        const orderDateStr = orderDateObj.toLocaleDateString('en-GB').replace(/\//g, '-'); // DD-MM-YYYY

        // Bill To details
        const billingName = order.address ? `${order.address.firstName} ${order.address.lastName}` : (user?.name || "Customer");
        const billingStreet = order.address?.street || "Kirana Street Address";
        const billingCity = order.address?.city || "Mohali";
        const billingState = order.address?.state || "Punjab";
        const billingCountry = order.address?.country || "India";
        const billingZip = order.address?.zipcode || "160055";
        const billingPhone = order.address?.phone || "9999999999";

        // Products table rows construction
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

        // Handling Fee/Convenience Fee Calculation
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

        // Build the high-fidelity HTML content
        const invoiceHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Tax Invoice - ${order._id}</title>
  <style>
    @media print {
      body {
        margin: 0;
        padding: 0;
        background-color: #fff;
      }
      .no-print {
        display: none !important;
      }
      .invoice-container {
        border: none !important;
        box-shadow: none !important;
        padding: 10px !important;
      }
    }
    body {
      font-family: Arial, sans-serif;
      color: #333;
      margin: 0;
      padding: 20px;
      font-size: 11px;
      line-height: 1.4;
      background-color: #f5f7f8;
    }
    .invoice-container {
      max-width: 850px;
      margin: 0 auto;
      background: #fff;
      padding: 30px;
      border: 1px solid #d2d2d2;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      background-color: #f1f2f4;
      color: #333;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 9px;
      padding: 8px;
      border-bottom: 2px solid #ccc;
    }
  </style>
</head>
<body>
  <!-- Print Trigger Bar -->
  <div class="no-print" style="max-width: 850px; margin: 0 auto 15px; display: flex; justify-content: space-between; align-items: center; background: #4F46E5; color: white; padding: 12px 24px; border-radius: 12px; font-family: sans-serif; box-shadow: 0 4px 12px rgba(79,70,229,0.25);">
    <span style="font-weight: 800; font-size: 14px; letter-spacing: -0.2px;">KiranaKart Retail Tax Invoice</span>
    <button onclick="window.print()" style="background: white; color: #4F46E5; border: none; padding: 8px 18px; border-radius: 8px; font-weight: 800; font-size: 12px; cursor: pointer; transition: 0.15s; box-shadow: 0 2px 4px rgba(0,0,0,0.08);">Print / Save PDF</button>
  </div>
  
  <div class="invoice-container">
    <!-- Invoice Header -->
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
          <div style="margin-bottom: 12px; display: inline-block;">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="black" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="16" height="16" fill="black" />
              <rect x="2" y="2" width="12" height="12" fill="white" />
              <rect x="4" y="4" width="8" height="8" fill="black" />
              
              <rect x="44" y="0" width="16" height="16" fill="black" />
              <rect x="46" y="2" width="12" height="12" fill="white" />
              <rect x="48" y="4" width="8" height="8" fill="black" />
              
              <rect x="0" y="44" width="16" height="16" fill="black" />
              <rect x="2" y="46" width="12" height="12" fill="white" />
              <rect x="4" y="48" width="8" height="8" fill="black" />
              
              <rect x="8" y="20" width="4" height="4" />
              <rect x="20" y="8" width="4" height="4" />
              <rect x="24" y="24" width="8" height="8" />
              <rect x="36" y="20" width="4" height="4" />
              <rect x="20" y="36" width="4" height="4" />
              <rect x="32" y="32" width="4" height="4" />
              <rect x="40" y="40" width="8" height="8" />
              <rect x="48" y="32" width="4" height="4" />
              <rect x="32" y="48" width="4" height="4" />
            </svg>
          </div>
          <div style="border: 1px solid #333; padding: 6px 12px; font-weight: bold; font-size: 11px; display: inline-block; background-color: #fafafa;">
            Invoice Number # LIABSG${order._id.substring(0, 10).toUpperCase()}
          </div>
        </td>
      </tr>
    </table>

    <hr style="border: none; border-top: 1px solid #d2d2d2; margin: 15px 0;" />

    <!-- Order Metadata & Billing/Shipping Grid -->
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
          <div style="margin-top: 10px; font-style: italic; color: #777; font-size: 9.5px;">
            *Keep this invoice and manufacturer box for warranty purposes.
          </div>
        </td>
      </tr>
    </table>

    <div style="font-weight: bold; margin-bottom: 8px; font-size: 11px;">Total items: ${order.items.length}</div>

    <!-- Product Details Table -->
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
        <!-- Summary Row -->
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

    <!-- Grand Total -->
    <table style="width: 100%; margin-top: 15px; margin-bottom: 30px;">
      <tr>
        <td style="width: 60%;"></td>
        <td style="width: 40%; text-align: right;">
          <div style="font-size: 15px; font-weight: bold; color: #111;">
            Grand Total: <span style="font-size: 18px; color: #000; font-weight: 900;">₹${order.amount.toFixed(2)}</span>
          </div>
          <div style="margin-top: 20px; font-size: 11px;">
            <strong>KiranaKart Retail Private Limited</strong>
            <div style="margin-top: 8px;">
              <svg width="150" height="40" viewBox="0 0 150 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 25C25 12 40 32 55 16C70 5 85 28 100 12C115 2 125 22 135 10C140 8 143 18 147 16" stroke="#1A237E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div style="font-size: 9.5px; color: #555; margin-top: 4px; border-top: 1px dashed #bbb; padding-top: 4px; display: inline-block;">
              Authorized Signatory
            </div>
          </div>
        </td>
      </tr>
    </table>

    <hr style="border: none; border-top: 1px solid #d2d2d2; margin: 20px 0 15px;" />

    <!-- Returns Policy & Regd Footer -->
    <table style="width: 100%; font-size: 9px; color: #555; line-height: 1.5;">
      <tr>
        <td>
          <strong>Returns Policy:</strong> At KiranaKart we try to deliver perfectly fresh and accurate items each and every time. But in the off-chance that you need to return any item, please do so with the <strong>original Brand box/price tag, original packaging and invoice</strong> within the eligible return period. Please contact support to facilitate quick processing.<br>
          <span style="font-weight: bold; color: #333; display: block; margin-top: 4px;">Contact KiranaKart Support: 1800-208-9898 || www.kiranakart.com/helpcentre</span>
        </td>
        <td style="text-align: right; vertical-align: bottom; white-space: nowrap; width: 15%; font-weight: bold; color: #333;">
          E. & O.E. | page 1 of 1
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
            const amount = Math.floor(Math.random() * 36) + 15; // Random between ₹15 and ₹50
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
        if (user) {
            fetchMyOrders()
        }
    }, [user])

    return (
        <div className='mt-16 pb-16 px-4 max-w-4xl mx-auto'>
            <div className='flex flex-col items-start w-max mb-8'>
                <p className='text-2xl font-bold uppercase tracking-tight text-gray-900'>My Orders</p>
                <div className='w-16 h-1 bg-primary rounded-full mt-1.5'></div>
            </div>
            {myOrders.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h3 className="font-extrabold text-gray-800 text-lg">No orders placed yet</h3>
                    <p className="text-sm text-gray-400 mt-1">Your ordered items will show up here!</p>
                </div>
            ) : (
                myOrders.map((order, index) => (
                    <div key={index} className='border border-gray-200 rounded-2xl mb-8 p-6 bg-white shadow-sm hover:shadow-md transition-shadow duration-300'>
                        <div className='flex justify-between md:items-center text-gray-500 font-semibold border-b border-gray-100 pb-4 mb-4 max-md:flex-col gap-3'>
                            <div className='flex flex-col gap-0.5'>
                                <span className="text-gray-900 font-extrabold text-sm">OrderId: {order._id}</span>
                                <span className="text-xs text-gray-400">Payment: {order.paymentType} · Date: {new Date(order.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-3 max-md:mt-1">
                                <span className='text-gray-950 font-black text-base mr-2'>Total: {currency}{order.amount}</span>
                                <button 
                                    onClick={() => handleDownloadInvoice(order)} 
                                    className='px-3.5 py-1.5 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-lg shadow-sm active:scale-95 transition cursor-pointer flex items-center gap-1.5'
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Invoice
                                </button>
                            </div>
                        </div>

                        {/* Render Tracking Feature ONLY on the Latest Order (index === 0) and disappears after 10 minutes of delivery/cancellation */}
                        {index === 0 && isTrackingVisible(order, simulatedStatus) && (() => {
                            const activeStatus = simulatedStatus || order.status;
                            const isCancelled = activeStatus === 'Cancelled';
                            const isDelivered = activeStatus === 'Delivered';
                            
                            return (
                                <div className="mt-3 mb-8 p-5 bg-[#F9FAFB] border border-gray-200 rounded-3xl transition duration-300 shadow-xs relative overflow-hidden">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3.5 border-b border-gray-100">
                                        <div className="flex items-center gap-2">
                                            <span className="relative flex h-2.5 w-2.5">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                            </span>
                                            <span className="text-xs font-black text-gray-800 uppercase tracking-wider">Live Tracking & Simulator</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {/* Toggle Simulator */}
                                            <button 
                                                onClick={() => setShowSimulator(!showSimulator)} 
                                                className="px-2.5 py-1 text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition cursor-pointer select-none"
                                            >
                                                {showSimulator ? "hide tools ⚙️" : "developer panel ⚙️"}
                                            </button>

                                            {/* Toggle Rider Chat */}
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

                                    {/* DEVELOPER SIMULATION SANDBOX PANEL */}
                                    {showSimulator && (
                                        <div className="mb-5 p-4 bg-slate-900 border border-slate-800 rounded-2xl text-white">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-black text-yellow-400 uppercase tracking-widest">⚙️ Sandbox Status Overrides</span>
                                                <span className="text-[9px] font-bold px-2 py-0.5 bg-yellow-400/10 text-yellow-400 rounded-md">Developer Sandbox</span>
                                            </div>
                                            <p className="text-[10px] font-semibold text-slate-400 mb-3.5 leading-snug">
                                                Force change the order delivery lifecycle states dynamically below to test client notifications, vector progress updates, dynamic rider chat, and the canvas scratch cashback cards!
                                            </p>
                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                                <button 
                                                    onClick={() => { setSimulatedStatus('Order Placed'); setScratchCompleted(false); setRewardCoupon(null); toast.success("Set simulated state: Order Placed"); }}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${activeStatus === 'Order Placed' ? 'bg-yellow-500 border-yellow-400 text-slate-950 font-black' : 'bg-slate-800 border-slate-700 text-slate-300'}`}
                                                >
                                                    1. Placed
                                                </button>
                                                <button 
                                                    onClick={() => { setSimulatedStatus('Packing'); setScratchCompleted(false); setRewardCoupon(null); toast.success("Set simulated state: Packing"); }}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${activeStatus === 'Packing' ? 'bg-yellow-500 border-yellow-400 text-slate-950 font-black' : 'bg-slate-800 border-slate-700 text-slate-300'}`}
                                                >
                                                    2. Packing
                                                </button>
                                                <button 
                                                    onClick={() => { setSimulatedStatus('Out for Delivery'); setScratchCompleted(false); setRewardCoupon(null); toast.success("Set simulated state: Out for Delivery"); }}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${activeStatus === 'Out for Delivery' ? 'bg-yellow-500 border-yellow-400 text-slate-950 font-black' : 'bg-slate-800 border-slate-700 text-slate-300'}`}
                                                >
                                                    3. On Way
                                                </button>
                                                <button 
                                                    onClick={() => { setSimulatedStatus('Delivered'); toast.success("Set simulated state: Delivered"); }}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${activeStatus === 'Delivered' ? 'bg-yellow-500 border-yellow-400 text-slate-950 font-black' : 'bg-slate-800 border-slate-700 text-slate-300'}`}
                                                >
                                                    4. Delivered
                                                </button>
                                                <button 
                                                    onClick={() => { setSimulatedStatus('Cancelled'); setScratchCompleted(false); setRewardCoupon(null); toast.success("Set simulated state: Cancelled"); }}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer col-span-2 md:col-span-1 ${activeStatus === 'Cancelled' ? 'bg-rose-500 border-rose-400 text-white font-black' : 'bg-slate-800 border-slate-700 text-rose-300'}`}
                                                >
                                                    Cancelled
                                                </button>
                                            </div>

                                            <div className="mt-4 pt-3.5 border-t border-slate-800 flex items-center justify-between">
                                                <button 
                                                    onClick={runAutoCycleDemo}
                                                    className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-black text-xs py-2 px-4 rounded-xl active:scale-98 transition duration-150 cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                                                >
                                                    <span>🚀 Trigger Auto-Demo Run (12-Second Delivery Cycle)</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* LIVE RIDER CHAT WIDGET */}
                                    {showRiderChat && !isCancelled && (
                                        <div className="mb-5 p-4 bg-white border border-gray-150 rounded-2xl shadow-xs">
                                            <div className="flex items-center gap-2 pb-2.5 border-b border-gray-100 mb-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white text-xs">RK</div>
                                                <div>
                                                    <h6 className="text-xs font-black text-gray-800">Rajesh Kumar (Delivery Executive)</h6>
                                                    <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                                        Online · 1.2 km away
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Messages Area */}
                                            <div className="h-40 overflow-y-auto mb-3.5 space-y-2 p-2 bg-[#F9FAFB] rounded-xl border border-gray-100 flex flex-col no-scrollbar">
                                                {riderMessages.map((msg, mIdx) => (
                                                    <div 
                                                        key={mIdx} 
                                                        className={`max-w-[80%] rounded-2xl p-2.5 text-xs font-semibold leading-relaxed ${
                                                            msg.sender === 'rider' 
                                                                ? 'bg-emerald-50 border border-emerald-100 text-emerald-950 align-left self-start rounded-tl-none' 
                                                                : 'bg-[#4F46E5] text-white self-end rounded-tr-none'
                                                        }`}
                                                    >
                                                        <p className="leading-snug">{msg.text}</p>
                                                        <span className="text-[8px] font-medium opacity-60 block text-right mt-1">{msg.time}</span>
                                                    </div>
                                                ))}
                                                {isRiderTyping && (
                                                    <div className="bg-emerald-50 text-emerald-950 self-start p-2.5 rounded-2xl rounded-tl-none text-xs border border-emerald-100 font-bold flex items-center gap-1.5">
                                                        <span className="text-[10px]">Rajesh is typing</span>
                                                        <span className="flex gap-1">
                                                            <span className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce"></span>
                                                            <span className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                                            <span className="w-1 h-1 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Action Tags */}
                                            <div className="flex flex-wrap gap-1.5 mb-3">
                                                {[
                                                    "Leave package at door 🚪",
                                                    "Gate security code is 4290 🔑",
                                                    "Call me when you arrive 📞",
                                                    "Please ring the bell 🔔"
                                                ].map((tag, tIdx) => (
                                                    <button 
                                                        key={tIdx} 
                                                        onClick={() => handleSendRiderMessage(tag)}
                                                        className="px-2.5 py-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[10px] font-bold text-gray-600 rounded-full transition cursor-pointer select-none"
                                                    >
                                                        {tag}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Chat Inputs */}
                                            <div className="flex gap-2">
                                                <input 
                                                    value={chatInputText}
                                                    onChange={(e) => setChatInputText(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleSendRiderMessage(chatInputText)}
                                                    placeholder="Send instructions to delivery rider..." 
                                                    className="w-full text-xs font-semibold px-3 py-2 border border-gray-200 rounded-xl outline-none focus:border-gray-400 transition"
                                                />
                                                <button 
                                                    onClick={() => handleSendRiderMessage(chatInputText)}
                                                    className="px-4 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-black text-xs rounded-xl active:scale-95 transition cursor-pointer"
                                                >
                                                    Send
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* ACTIVE TIMELINE STEPPER CONTENT */}
                                    {isCancelled ? (
                                        <div className="flex items-center gap-2.5 p-4 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 text-xs font-bold">
                                            <span className="text-xl">🚫</span>
                                            <div>
                                                <p className="font-extrabold uppercase text-[10.5px] tracking-wide text-rose-800">Order Cancelled</p>
                                                <p className="mt-0.5 font-semibold text-rose-600">This transaction was aborted. Refund of {currency}{order.amount.toFixed(2)} has been cleared to your source account.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {/* Horizontal Stepper bar */}
                                            <div className="relative flex items-center justify-between w-full px-2 mt-2">
                                                {/* Background Progress bar line */}
                                                <div className="absolute left-8 right-8 top-3.5 h-[3px] bg-gray-200 -z-0"></div>
                                                
                                                {/* Active progress bar line */}
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

                                                {/* Stepper bubbles */}
                                                {[
                                                    { label: 'Placed', desc: 'Order Placed' },
                                                    { label: 'Packing', desc: 'Preparing items' },
                                                    { label: 'On Way', desc: 'Out for delivery' },
                                                    { label: 'Delivered', desc: 'Enjoy your food' }
                                                ].map((step, stepIdx) => {
                                                    const stepNum = stepIdx + 1;
                                                    const activeStep = getTrackingStepIndex(activeStatus);
                                                    const isDone = activeStep >= stepNum;
                                                    
                                                    return (
                                                        <div key={stepIdx} className="flex flex-col items-center gap-1.5 relative z-10 w-16 select-none">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-xs border-2 transition-all duration-300 ${
                                                                isDone 
                                                                    ? 'bg-[#4F46E5] border-[#4F46E5] text-white font-extrabold shadow-sm' 
                                                                    : 'bg-white border-gray-300 text-gray-400 font-semibold'
                                                            }`}>
                                                                {isDone ? '✓' : stepNum}
                                                            </div>
                                                            <span className={`text-[10px] font-black uppercase tracking-tight text-center leading-none ${
                                                                isDone ? 'text-[#4F46E5]' : 'text-gray-400'
                                                            }`}>
                                                                {step.label}
                                                            </span>
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            {/* GAMIFIED SCRATCH CASHBACK INTERACTIVE VOUCHER CARD */}
                                            {isDelivered && (
                                                <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col items-center justify-center text-center animate-fadeIn">
                                                    <div className="max-w-sm mb-4">
                                                        <span className="text-xl">🎁</span>
                                                        <h5 className="font-extrabold text-sm text-gray-800 tracking-tight leading-none mb-1">Interactive Delivery Reward Card!</h5>
                                                        <p className="text-[10.5px] text-gray-400 font-semibold leading-relaxed">
                                                            We appreciate your support. Scratch the metallic shield below to claim your cashback wallet gift card!
                                                        </p>
                                                    </div>

                                                    {!scratchCompleted && (
                                                        <ScratchCard onComplete={() => {
                                                            setScratchCompleted(true);
                                                            // Save this coupon in local storage
                                                            if (rewardCoupon) {
                                                                const existing = JSON.parse(localStorage.getItem('kiranakart_unlocked_coupons') || '[]');
                                                                if (!existing.some(c => c.code === rewardCoupon.code)) {
                                                                    existing.push(rewardCoupon);
                                                                    localStorage.setItem('kiranakart_unlocked_coupons', JSON.stringify(existing));
                                                                }
                                                            }
                                                            toast.success("🎉 Reward claimed! Coupon saved to your profile.");
                                                        }} />
                                                    )}

                                                    {scratchCompleted && rewardCoupon && (
                                                        <div className="mt-3.5 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl max-w-xs flex flex-col items-center gap-2.5 shadow-sm text-center animate-fadeIn">
                                                            <span className="text-2xl animate-bounce">🏆</span>
                                                            <div className="text-[11px] font-black uppercase text-amber-800 tracking-wider">Scratch Card Unlocked!</div>
                                                            <div className="bg-amber-100/60 border border-dashed border-amber-300 text-amber-950 font-black text-sm px-3.5 py-1.5 rounded-lg select-all">
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
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })()}

                        {order.items.map((item, index) => (
                            <div key={index} className={`relative bg-white text-gray-500/70 ${order.items.length !== index + 1 && "border-b"} border-gray-150 flex flex-col md:flex-row md:items-center justify-between py-4 md:gap-16 w-full`}>
                                <div className='flex items-center mb-4 md:mb-0'>
                                    <div className='bg-gray-50 border border-gray-100 p-2.5 rounded-xl shrink-0'>
                                        <img src={item.product.image[0]} alt="" className='w-14 h-14 object-contain' />
                                    </div>
                                    <div className='ml-4'>
                                        <h2 className='text-base font-bold text-gray-800 leading-snug line-clamp-1'>
                                            {item.product.name}
                                            {item.product.quantityValue && item.product.unit ? ` (${item.product.quantityValue} ${item.product.unit})` : ''}
                                        </h2>
                                        <p className="text-xs text-gray-400 mt-1 font-semibold">Category: {item.product.category}</p>
                                    </div>
                                </div>

                                <div className='flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start text-xs font-semibold text-gray-500 gap-1 mb-4 md:mb-0'>
                                    <p>Qty: {item.quantity || "1"}</p>
                                    <p className="px-2 py-0.5 bg-green-50 text-green-600 rounded-md font-bold text-[10px] uppercase">{order.status}</p>
                                </div>
                                <p className='text-primary text-base font-extrabold text-right max-md:mt-2'>
                                    {currency}{item.product.offerPrice * item.quantity}
                                </p>
                            </div>
                        ))}
                    </div>
                ))
            )}
        </div>
    )
}

export default MyOrders
