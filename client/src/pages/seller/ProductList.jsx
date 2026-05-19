import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ProductList = () => {

  const { products, currency, axios, fetchProducts } = useAppContext()
  const [editingId, setEditingId] = useState(null)
  const [editPrice, setEditPrice] = useState('')
  const [editOfferPrice, setEditOfferPrice] = useState('')

  const startEdit = (product) => {
    setEditingId(product._id)
    setEditPrice(product.price)
    setEditOfferPrice(product.offerPrice)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const savePrice = async (id) => {
    try {
      const { data } = await axios.post('/api/product/update-price', {
        id,
        price: Number(editPrice),
        offerPrice: Number(editOfferPrice)
      })
      if (data.success) {
        toast.success("Prices updated successfully!")
        fetchProducts()
        setEditingId(null)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post('/api/product/stock', { id, inStock })
      if (data.success) {
        fetchProducts();
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Products</h2>
        <div className="flex flex-col items-center max-w-5xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="w-full overflow-hidden border-collapse text-left">
            <thead className="bg-gray-50 text-gray-900 text-sm border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Original Price</th>
                <th className="px-4 py-3 font-semibold">Selling Price</th>
                <th className="px-4 py-3 font-semibold">In Stock</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-600 divide-y divide-gray-150">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 flex items-center space-x-3 max-w-[240px]">
                    <div className="border border-gray-200 rounded p-1 bg-white flex-shrink-0">
                      <img src={product.image[0]} alt="Product" className="w-12 h-12 object-contain" />
                    </div>
                    <span className="font-medium text-gray-800 truncate" title={product.name}>
                      {product.name}
                      {product.quantityValue && product.unit ? ` (${product.quantityValue} ${product.unit})` : ''}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{product.category}</td>
                  <td className="px-4 py-3">
                    {editingId === product._id ? (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400 font-medium">{currency}</span>
                        <input 
                          type="number" 
                          value={editPrice} 
                          onChange={(e) => setEditPrice(e.target.value)} 
                          className="w-20 border border-gray-300 rounded px-2 py-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        />
                      </div>
                    ) : (
                      <span className="text-gray-500 line-through">{currency}{product.price}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === product._id ? (
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400 font-medium">{currency}</span>
                        <input 
                          type="number" 
                          value={editOfferPrice} 
                          onChange={(e) => setEditOfferPrice(e.target.value)} 
                          className="w-20 border border-gray-300 rounded px-2 py-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                        />
                      </div>
                    ) : (
                      <span className="font-semibold text-primary">{currency}{product.offerPrice}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                      <input onClick={() => toggleStock(product._id, !product.inStock)} checked={product.inStock} type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-primary transition-colors duration-200"></div>
                      <span className="dot absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    {editingId === product._id ? (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => savePrice(product._id)} 
                          className="bg-primary hover:bg-primary-dark text-white px-3 py-1.5 rounded text-xs font-semibold cursor-pointer shadow-sm transition-all"
                        >
                          Save
                        </button>
                        <button 
                          onClick={cancelEdit} 
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => startEdit(product)} 
                        className="border border-primary text-primary hover:bg-primary hover:text-white px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-all duration-200"
                      >
                        Edit Price
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ProductList
