import React, { useState } from 'react'
import { assets } from '../assets/greencart_assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { useEffect } from 'react'

// Input Field Component
const InputField = ({ type, placeholder, name, handleChange, address }) => (
    <input className='w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-xl outline-none text-gray-700 placeholder-gray-400 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all duration-200'
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        name={name}
        value={address[name]}
        required
    />
)

const AddAddress = () => {
    const { axios, user, navigate } = useAppContext()

    const [address, setAddress] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: '',
        category: 'home',
    })

    const handleChange = (e) => {
        const { name, value } = e.target;

        setAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }))
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/address/add', { address });
            if (data.success) {
                toast.success(data.message)
                navigate('/cart')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(() => {
        if (!user) {
            navigate('/cart')
        }
    }, [])

    return (
        <div className='mt-12 pb-16 max-w-6xl mx-auto px-4'>
            <div className='flex flex-col mb-10'>
                <h1 className='text-3xl font-extrabold text-gray-900 tracking-tight'>
                    Add Shipping <span className='text-primary'>Address</span>
                </h1>
                <p className='text-gray-500 mt-2 text-sm'>Please fill in your primary home or office delivery location details.</p>
            </div>

            <div className='flex flex-col-reverse md:flex-row justify-between items-start gap-12 mt-4'>
                <div className='flex-1 w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant/15'>
                    <form onSubmit={onSubmitHandler} className='space-y-4 text-sm'>
                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name='firstName' type='text' placeholder="First Name" />
                            <InputField handleChange={handleChange} address={address} name='lastName' type='text' placeholder="Last Name" />
                        </div>

                        <InputField handleChange={handleChange} address={address} name='email' type='email' placeholder='Email Address' />
                        <InputField handleChange={handleChange} address={address} name='street' type='text' placeholder='Street Name & House No.' />

                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name='city' type='text' placeholder='City' />
                            <InputField handleChange={handleChange} address={address} name='state' type='text' placeholder='State' />
                        </div>

                        <div className='grid grid-cols-2 gap-4'>
                            <InputField handleChange={handleChange} address={address} name='zipcode' type='number' placeholder='Zipcode' />
                            <InputField handleChange={handleChange} address={address} name='country' type='text' placeholder='Country' />
                        </div>

                        <InputField handleChange={handleChange} address={address} name='phone' type='text' placeholder='Mobile Number' />

                        {/* Category Selector */}
                        <div className="space-y-2 pt-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Address Label</label>
                            <div className="flex gap-4">
                                {['home', 'Work', 'Other'].map((cat) => (
                                    <button
                                        type="button"
                                        key={cat}
                                        onClick={() => setAddress(prev => ({ ...prev, category: cat }))}
                                        className={`flex-1 py-3 px-4 rounded-xl border text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                                            (address.category || 'home') === cat
                                                ? 'bg-primary border-primary text-white shadow-sm'
                                                : 'bg-surface-container-low border-outline-variant/30 text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {cat === 'home' ? '🏠 Home' : cat === 'Work' ? '🏢 Work' : '📍 Other'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className='w-full mt-6 bg-primary text-white py-3.5 rounded-xl hover:bg-primary/95 hover:shadow-md active:scale-[0.99] transition-all duration-200 cursor-pointer font-bold tracking-wide uppercase'>
                            Save Address
                        </button>
                    </form>
                </div>
                <div className='flex-1 w-full flex justify-center items-center max-md:mb-4'>
                    <img className='w-full max-w-sm rounded-3xl shadow-sm border border-outline-variant/10' src={assets.add_address_image} alt="Add Address" />
                </div>
            </div>
        </div>
    )
}

export default AddAddress

