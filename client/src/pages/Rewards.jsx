import React, { useEffect, useState, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const ScratchModal = ({ isOpen, onClose, reward, onScratchComplete }) => {
    const canvasRef = useRef(null);
    const [scratched, setScratched] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        if (!isOpen || !reward) return;
        setScratched(false);
        setIsDrawing(false);

        // Allow some time for the canvas to mount in DOM
        const timer = setTimeout(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            
            // Draw gradient metallic cover
            const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            grad.addColorStop(0, "#818CF8"); // Indigo-400
            grad.addColorStop(0.5, "#A5B4FC"); // Indigo-300
            grad.addColorStop(1, "#4F46E5"); // Indigo-600
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add patterns/text on overlay
            ctx.font = "bold 13px system-ui, sans-serif";
            ctx.fillStyle = "#FFFFFF";
            ctx.textAlign = "center";
            ctx.fillText("🎁 SECRET REWARD 🎁", canvas.width / 2, canvas.height / 2 - 8);
            ctx.font = "medium 9px system-ui, sans-serif";
            ctx.fillText("Scratch to unlock!", canvas.width / 2, canvas.height / 2 + 14);
        }, 150);

        return () => clearTimeout(timer);
    }, [isOpen, reward]);

    if (!isOpen || !reward) return null;

    const getMousePos = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const handleScratch = (e) => {
        if (!isDrawing || scratched) return;
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const { x, y } = getMousePos(e);

        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();

        // Check scratch percentage
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let transparent = 0;
        for (let i = 3; i < imgData.data.length; i += 4) {
            if (imgData.data[i] === 0) transparent++;
        }
        const percent = (transparent / (canvas.width * canvas.height)) * 100;
        if (percent >= 45 && !scratched) {
            setScratched(true);
            onScratchComplete(reward.id || reward.code);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl p-6 w-full max-w-sm flex flex-col items-center gap-4 relative shadow-2xl animate-scaleUp">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer text-lg font-black"
                >
                    ✕
                </button>
                <span className="text-3xl animate-bounce">✨</span>
                <h4 className="text-lg font-black text-gray-900 dark:text-white text-center">Interactive Scratch Reward</h4>
                <p className="text-[11px] text-gray-400 font-bold text-center leading-normal mb-2">
                    Drag your pointer across the card below to rub off the cover and reveal your cashback offer!
                </p>

                {/* Card Container */}
                <div className="relative w-64 h-48 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 dark:from-slate-800 dark:to-slate-800/50 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center p-4 text-center overflow-hidden shadow-inner">
                    {/* Unlocked Reward Layer */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-3xl">🏆</span>
                        <div className="text-[10px] font-black uppercase text-amber-800 dark:text-amber-400 tracking-wider">You Won!</div>
                        <div className="text-lg font-black text-amber-950 dark:text-white select-all border border-dashed border-amber-300 dark:border-amber-700/60 bg-amber-100/60 dark:bg-slate-700 px-3 py-1 rounded-xl">
                            {reward.code}
                        </div>
                        <div className="text-[11px] text-amber-700 dark:text-amber-300/80 font-extrabold max-w-[200px] leading-tight mt-1">
                            {reward.desc}
                        </div>
                    </div>

                    {/* Canvas Scratch Shield */}
                    {!scratched && (
                        <canvas
                            ref={canvasRef}
                            width={256}
                            height={192}
                            onMouseDown={(e) => { setIsDrawing(true); handleScratch(e); }}
                            onMouseMove={handleScratch}
                            onMouseUp={() => setIsDrawing(false)}
                            onMouseLeave={() => setIsDrawing(false)}
                            onTouchStart={(e) => { setIsDrawing(true); handleScratch(e); }}
                            onTouchMove={handleScratch}
                            onTouchEnd={() => setIsDrawing(false)}
                            className="absolute inset-0 w-full h-full cursor-crosshair rounded-2xl transition duration-300"
                        />
                    )}
                </div>

                {scratched && (
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(reward.code);
                            toast.success("📋 Coupon code copied!");
                            onClose();
                        }}
                        className="w-full mt-2 py-3 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-black text-xs rounded-xl shadow-md transition active:scale-98 cursor-pointer text-center uppercase tracking-wider"
                    >
                        Copy Code & Close 📋
                    </button>
                )}
            </div>
        </div>
    );
};

const Rewards = () => {
    const { currency } = useAppContext();
    const [rewardsList, setRewardsList] = useState([]);
    const [activeTab, setActiveTab] = useState("all"); // "all", "active", "used", "expired"
    const [selectedReward, setSelectedReward] = useState(null);
    const [showScratchModal, setShowScratchModal] = useState(false);

    // Initializer and expired status checks
    useEffect(() => {
        let existing = JSON.parse(localStorage.getItem("kiranakart_unlocked_coupons") || "[]");

        if (existing.length === 0) {
            // Generate Google Pay starter coupons & scratchcards
            existing = [
                {
                    id: "sc_1",
                    isUnscratched: true,
                    code: "KIRANA30",
                    type: "flat",
                    value: 30,
                    desc: "Flat ₹30 cashback off your complete cart total!",
                    createdAt: new Date().toISOString(),
                    used: false
                },
                {
                    id: "sc_2",
                    isUnscratched: true,
                    code: "SNACK20",
                    type: "category",
                    value: 20,
                    category: "Snacks & Munchies",
                    desc: "20% Discount on cold chips, noodles and cookies!",
                    createdAt: new Date().toISOString(),
                    used: false
                },
                {
                    id: "sc_3",
                    isUnscratched: false,
                    code: "DRINK25",
                    type: "category",
                    value: 25,
                    category: "Cold Drinks & Juices",
                    desc: "25% Discount on soft drinks, milkshakes & juices!",
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    used: true
                },
                {
                    id: "sc_4",
                    isUnscratched: false,
                    code: "PAAN50",
                    type: "category",
                    value: 50,
                    category: "Paan Corner",
                    desc: "50% Discount on Paan corner collections!",
                    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
                    used: false
                }
            ];
            localStorage.setItem("kiranakart_unlocked_coupons", JSON.stringify(existing));
        }

        setRewardsList(existing);
    }, []);

    const isExpired = (createdAt) => {
        return Date.now() - new Date(createdAt).getTime() > THIRTY_DAYS_MS;
    };

    // Calculate total cashback earned
    const totalCashback = rewardsList.reduce((acc, reward) => {
        if (!reward.isUnscratched && reward.type === "flat") {
            return acc + reward.value;
        }
        return acc;
    }, 0);

    const handleScratchComplete = (rewardId) => {
        const updated = rewardsList.map((reward) => {
            if (reward.id === rewardId || reward.code === rewardId) {
                return { ...reward, isUnscratched: false };
            }
            return reward;
        });
        localStorage.setItem("kiranakart_unlocked_coupons", JSON.stringify(updated));
        setRewardsList(updated);
        toast.success("🎉 Congratulations! Scratch Card unlocked successfully.");
    };

    const triggerScratch = (reward) => {
        setSelectedReward(reward);
        setShowScratchModal(true);
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        toast.success("📋 Coupon code copied to clipboard!");
    };

    // Filter Rewards
    const filteredRewards = rewardsList.filter((reward) => {
        const expired = isExpired(reward.createdAt);
        if (activeTab === "all") return true;
        if (activeTab === "active") return !reward.used && !expired && !reward.isUnscratched;
        if (activeTab === "used") return reward.used;
        if (activeTab === "expired") return expired && !reward.used;
        if (activeTab === "scratchcards") return reward.isUnscratched;
        return true;
    });

    return (
        <div className="py-8 min-h-[80vh] flex flex-col gap-6 animate-fadeIn">
            {/* Header / Wallet container */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-slate-800 dark:to-slate-800/90 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Visual decorations */}
                <div className="absolute right-0 top-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute left-1/3 bottom-0 w-24 h-24 bg-white/5 rounded-full -mb-10 pointer-events-none"></div>

                <div className="space-y-2 text-center md:text-left z-10">
                    <span className="text-xs font-black uppercase bg-indigo-500/50 px-3 py-1 rounded-full tracking-wider">Google Pay Style Rewards</span>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-1">Scratch Cards & Rewards</h2>
                    <p className="text-[11px] md:text-xs text-indigo-100 font-bold max-w-md">
                        Earn interactive scratch cards with every successful delivery! Scratched cashback is added instantly to your wallet.
                    </p>
                </div>

                {/* Total Cashback Metric Container */}
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-5 rounded-2xl text-center flex flex-col items-center justify-center shrink-0 min-w-[160px] z-10 shadow-inner select-none animate-pulse">
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-200">Total Cashback</span>
                    <span className="text-3xl md:text-4xl font-black mt-1 flex items-center justify-center">
                        {currency}{totalCashback}
                    </span>
                    <span className="text-[9px] font-bold text-indigo-100/80 mt-1">Saved from scratchcards</span>
                </div>
            </div>

            {/* Filter Tabs Drawer */}
            <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                {[
                    { id: "all", label: "All Rewards" },
                    { id: "scratchcards", label: "Scratch Cards 🎁" },
                    { id: "active", label: "Active Offers 🏷️" },
                    { id: "used", label: "Used 🚫" },
                    { id: "expired", label: "Expired ⏳" }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`shrink-0 px-4 py-2 text-xs font-black rounded-xl border select-none transition cursor-pointer ${
                            activeTab === tab.id
                                ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs"
                                : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Rewards Grid */}
            {filteredRewards.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center bg-white dark:bg-slate-800/30 border border-dashed border-gray-200 dark:border-slate-800 rounded-3xl gap-3">
                    <span className="text-4xl">🎁</span>
                    <h5 className="font-black text-gray-800 dark:text-white text-sm">No rewards matching filter</h5>
                    <p className="text-[11px] text-gray-400 font-bold max-w-xs">
                        Keep purchasing to unlock rewards, or select another category filter to explore!
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                    {filteredRewards.map((reward) => {
                        const expired = isExpired(reward.createdAt);
                        const isCardActive = !reward.used && !expired;
                        
                        // Remaining Days Tracker
                        const daysLeft = Math.max(
                            0,
                            Math.ceil((THIRTY_DAYS_MS - (Date.now() - new Date(reward.createdAt).getTime())) / (1000 * 60 * 60 * 24))
                        );

                        if (reward.isUnscratched) {
                            // Unscratched Shiny Google Pay style card
                            return (
                                <div
                                    key={reward.id || reward.code}
                                    onClick={() => triggerScratch(reward)}
                                    className="relative w-full aspect-[4/3.2] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 border border-indigo-400 dark:border-indigo-800 rounded-2xl flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all duration-300 hover:scale-[1.04] hover:shadow-lg group shadow-sm overflow-hidden select-none active:scale-95 animate-fadeIn"
                                >
                                    {/* Shimmer Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition duration-1000 ease-out"></div>
                                    <span className="text-3xl group-hover:animate-bounce">🎁</span>
                                    <span className="text-[11px] font-black text-white uppercase tracking-wider mt-2.5">Unrevealed Card</span>
                                    <span className="text-[8px] bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-white font-extrabold mt-1.5 uppercase">
                                        Tap to Scratch ⚡
                                    </span>
                                </div>
                            );
                        }

                        // Scratched card layout
                        return (
                            <div
                                key={reward.id || reward.code}
                                className={`relative w-full aspect-[4/3.2] bg-white dark:bg-slate-800 border rounded-2xl p-4 flex flex-col justify-between transition shadow-2xs hover:shadow-xs group animate-fadeIn ${
                                    !isCardActive 
                                        ? "border-gray-100 dark:border-slate-800 opacity-60 bg-gray-50/50 dark:bg-slate-800/40" 
                                        : "border-amber-200 dark:border-slate-700 bg-gradient-to-br from-amber-50/20 to-transparent"
                                }`}
                            >
                                {/* Expiry or Status Tag */}
                                <div className="flex justify-between items-start">
                                    <span className="text-lg">
                                        {reward.type === "flat" ? "🪙" : "🏷️"}
                                    </span>
                                    {reward.used ? (
                                        <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 rounded-full select-none">
                                            Used 🚫
                                        </span>
                                    ) : expired ? (
                                        <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-gray-150 text-gray-500 dark:bg-slate-700 dark:text-gray-400 rounded-full select-none">
                                            Expired ⏳
                                        </span>
                                    ) : (
                                        <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-full select-none animate-pulse">
                                            Active
                                        </span>
                                    )}
                                </div>

                                {/* Reward details */}
                                <div className="space-y-1.5 mt-2">
                                    <div className="flex items-center gap-1.5">
                                        <span className={`text-base font-black ${
                                            !isCardActive ? "text-gray-500" : "text-amber-950 dark:text-white"
                                        }`}>
                                            {reward.code}
                                        </span>
                                        {isCardActive && (
                                            <button
                                                onClick={() => copyToClipboard(reward.code)}
                                                className="text-[9px] text-[#4F46E5] hover:text-[#4338CA] font-extrabold cursor-pointer border border-indigo-100 px-1.5 py-0.5 rounded-md hover:bg-indigo-50/40"
                                                title="Copy Code"
                                            >
                                                📋
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-extrabold leading-tight">
                                        {reward.desc}
                                    </p>
                                </div>

                                {/* Footer Expiration message */}
                                <div className="text-[8.5px] font-bold text-gray-400/80 mt-1 border-t border-dashed border-gray-100 dark:border-slate-700/60 pt-1.5 flex justify-between items-center leading-none select-none">
                                    <span>Unlocked</span>
                                    <span>
                                        {!isCardActive 
                                            ? "Deactivated" 
                                            : `Expires in ${daysLeft} days`
                                        }
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal Scratch Window Overlay */}
            <ScratchModal
                isOpen={showScratchModal}
                onClose={() => { setShowScratchModal(false); setSelectedReward(null); }}
                reward={selectedReward}
                onScratchComplete={handleScratchComplete}
            />
        </div>
    );
};

export default Rewards;
