import React, { useEffect, useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const StoreSettings = () => {
    const { axios } = useAppContext();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [deliveryEnabled, setDeliveryEnabled] = useState(true);
    const [deliveryCharge, setDeliveryCharge] = useState(30);
    const [deliveryLabel, setDeliveryLabel] = useState('Delivery charge');

    const [freeDeliveryEnabled, setFreeDeliveryEnabled] = useState(false);
    const [freeDeliveryThreshold, setFreeDeliveryThreshold] = useState(199);

    const [surgeEnabled, setSurgeEnabled] = useState(true);
    const [surgeCharge, setSurgeCharge] = useState(30);
    const [surgeLabel, setSurgeLabel] = useState('Surge charge');

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/store/settings');
            if (data.success) {
                const s = data.settings;
                setDeliveryEnabled(s.deliveryEnabled);
                setDeliveryCharge(s.deliveryCharge);
                setDeliveryLabel(s.deliveryLabel);
                setFreeDeliveryEnabled(s.freeDeliveryEnabled || false);
                setFreeDeliveryThreshold(s.freeDeliveryThreshold !== undefined ? s.freeDeliveryThreshold : 199);
                setSurgeEnabled(s.surgeEnabled);
                setSurgeCharge(s.surgeCharge);
                setSurgeLabel(s.surgeLabel);
            }
        } catch (err) {
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async () => {
        try {
            setSaving(true);
            const { data } = await axios.post('/api/store/settings', {
                deliveryEnabled,
                deliveryCharge: Number(deliveryCharge),
                deliveryLabel,
                freeDeliveryEnabled,
                freeDeliveryThreshold: Number(freeDeliveryThreshold),
                surgeEnabled,
                surgeCharge: Number(surgeCharge),
                surgeLabel,
            });
            if (data.success) {
                toast.success('Store settings saved!');
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => { fetchSettings(); }, []);

    if (loading) return (
        <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        </div>
    );

    return (
        <div className="flex-1 p-6 md:p-10 bg-gray-50 min-h-screen">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Store Settings</h1>
                    <p className="text-sm text-gray-500 mt-1">Control delivery and surge charges applied to every customer order.</p>
                </div>

                {/* Delivery Charge Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="font-black text-gray-900 text-base">Delivery Charge</h2>
                                <p className="text-xs text-gray-400">Added to every non-empty cart</p>
                            </div>
                        </div>
                        {/* Toggle */}
                        <button
                            onClick={() => setDeliveryEnabled(v => !v)}
                            className={`relative inline-flex w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none cursor-pointer ${deliveryEnabled ? 'bg-indigo-500' : 'bg-gray-300'}`}
                        >
                            <span className={`inline-block w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-300 mt-0.5 ${deliveryEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                        </button>
                    </div>
                    <div className={`space-y-4 transition-opacity duration-200 ${deliveryEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Label shown to customer</label>
                            <input
                                type="text"
                                value={deliveryLabel}
                                onChange={e => setDeliveryLabel(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
                                placeholder="e.g. Delivery charge"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Amount (₹)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={deliveryCharge}
                                    onChange={e => setDeliveryCharge(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold text-gray-800 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
                                />
                            </div>
                        </div>
                        {/* Quick presets */}
                        <div className="flex gap-2 flex-wrap">
                            {[0, 15, 25, 30, 49, 59].map(v => (
                                <button
                                    key={v}
                                    onClick={() => setDeliveryCharge(v)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${Number(deliveryCharge) === v ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'}`}
                                >
                                    {v === 0 ? 'Free' : `₹${v}`}
                                </button>
                            ))}
                        </div>
                    </div>
                    {!deliveryEnabled && (
                        <p className="text-xs font-semibold text-gray-400 mt-3 bg-gray-50 rounded-lg px-3 py-2">
                            Delivery charge is <span className="text-green-600">disabled</span> — customers get free delivery.
                        </p>
                    )}
                </div>

                {/* Free Delivery Settings Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="font-black text-gray-900 text-base">Free Delivery System</h2>
                                <p className="text-xs text-gray-400">Offer free delivery on high-value carts</p>
                            </div>
                        </div>
                        {/* Toggle */}
                        <button
                            onClick={() => setFreeDeliveryEnabled(v => !v)}
                            className={`relative inline-flex w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none cursor-pointer ${freeDeliveryEnabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
                        >
                            <span className={`inline-block w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-300 mt-0.5 ${freeDeliveryEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                        </button>
                    </div>
                    <div className={`space-y-4 transition-opacity duration-200 ${freeDeliveryEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Free Delivery Min Cart Value (₹)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={freeDeliveryThreshold}
                                    onChange={e => setFreeDeliveryThreshold(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold text-gray-800 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none"
                                />
                            </div>
                        </div>
                        {/* Quick presets */}
                        <div className="flex gap-2 flex-wrap">
                            {[99, 149, 199, 299, 499].map(v => (
                                <button
                                    key={v}
                                    onClick={() => setFreeDeliveryThreshold(v)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${Number(freeDeliveryThreshold) === v ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-350'}`}
                                >
                                    ₹{v} Preset
                                </button>
                            ))}
                        </div>
                    </div>
                    {!freeDeliveryEnabled && (
                        <p className="text-xs font-semibold text-red-700 mt-3 bg-red-50/50 rounded-lg px-3 py-2 border border-red-100">
                             Free delivery system is <span className="font-bold">OFF</span> — standard delivery fees apply to all orders regardless of cart value.
                        </p>
                    )}
                    {freeDeliveryEnabled && (
                        <p className="text-xs font-semibold text-emerald-800 mt-3 bg-emerald-50/50 rounded-lg px-3 py-2 border border-emerald-100">
                             Free delivery is <span className="font-bold">ON</span> — customers ordering <span className="font-black text-emerald-950">₹{freeDeliveryThreshold} or more</span> get 100% free delivery.
                        </p>
                    )}
                </div>

                {/* Surge Charge Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                                <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="font-black text-gray-900 text-base">Surge Charge</h2>
                                <p className="text-xs text-gray-400">Apply during peak hours or high demand</p>
                            </div>
                        </div>
                        {/* Toggle */}
                        <button
                            onClick={() => setSurgeEnabled(v => !v)}
                            className={`relative inline-flex w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none cursor-pointer ${surgeEnabled ? 'bg-orange-500' : 'bg-gray-300'}`}
                        >
                            <span className={`inline-block w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-300 mt-0.5 ${surgeEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
                        </button>
                    </div>
                    <div className={`space-y-4 transition-opacity duration-200 ${surgeEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Label shown to customer</label>
                            <input
                                type="text"
                                value={surgeLabel}
                                onChange={e => setSurgeLabel(e.target.value)}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none"
                                placeholder="e.g. Surge charge"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Amount (₹)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={surgeCharge}
                                    onChange={e => setSurgeCharge(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold text-gray-800 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none"
                                />
                            </div>
                        </div>
                        {/* Quick presets */}
                        <div className="flex gap-2 flex-wrap">
                            {[0, 10, 20, 30, 50].map(v => (
                                <button
                                    key={v}
                                    onClick={() => setSurgeCharge(v)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${Number(surgeCharge) === v ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'}`}
                                >
                                    {v === 0 ? 'None' : `₹${v}`}
                                </button>
                            ))}
                        </div>
                    </div>
                    {!surgeEnabled && (
                        <p className="text-xs font-semibold text-gray-400 mt-3 bg-gray-50 rounded-lg px-3 py-2">
                            Surge pricing is <span className="text-green-600">disabled</span> — no surge charge applied.
                        </p>
                    )}
                </div>

                {/* Live Preview */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-8">
                    <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-3">Customer Cart Preview</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-gray-700">
                            <span>Item subtotal (Under Threshold)</span><span className="font-bold">₹150</span>
                        </div>
                        {deliveryEnabled && (
                            <div className="flex justify-between text-gray-700">
                                <span>{deliveryLabel || 'Delivery charge'}</span>
                                <span className="font-bold text-gray-900">₹{deliveryCharge}</span>
                            </div>
                        )}
                        <div className="border-t border-indigo-200/50 pt-2 flex justify-between text-gray-900">
                            <span>Grand Total (Carts &lt; ₹{freeDeliveryThreshold})</span>
                            <span className="font-black">₹{150 + (deliveryEnabled ? Number(deliveryCharge) : 0)}</span>
                        </div>
                        
                        <div className="border-t border-dashed border-indigo-200/50 pt-2" />
                        
                        <div className="flex justify-between text-gray-700">
                            <span>Item subtotal (Above Threshold)</span><span className="font-bold">₹250</span>
                        </div>
                        {deliveryEnabled && (
                            <div className="flex justify-between text-gray-700">
                                <span>{deliveryLabel || 'Delivery charge'}</span>
                                <span className="font-bold text-gray-900">
                                    {freeDeliveryEnabled ? (
                                        <span className="text-emerald-600 font-extrabold line-through mr-1.5">₹{deliveryCharge}</span>
                                    ) : null}
                                    <span className={freeDeliveryEnabled ? 'text-emerald-700 font-black' : 'text-gray-900 font-bold'}>
                                        {freeDeliveryEnabled ? '₹0 (Free)' : `₹${deliveryCharge}`}
                                    </span>
                                </span>
                            </div>
                        )}
                        <div className="border-t border-indigo-200/50 pt-2 flex justify-between text-gray-900">
                            <span>Grand Total (Carts &ge; ₹{freeDeliveryThreshold})</span>
                            <span className="font-black">₹{250 + (deliveryEnabled && !freeDeliveryEnabled ? Number(deliveryCharge) : 0)}</span>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={saveSettings}
                    disabled={saving}
                    className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-2xl font-extrabold text-sm shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {saving ? (
                        <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Saving...
                        </>
                    ) : '💾  Save Settings'}
                </button>
            </div>
        </div>
    );
};

export default StoreSettings;
