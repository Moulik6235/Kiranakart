import React, { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ProductList = () => {

  const { products, currency, axios, fetchProducts } = useAppContext()
  const [editingId, setEditingId] = useState(null)
  const [editPrice, setEditPrice] = useState('')
  const [editOfferPrice, setEditOfferPrice] = useState('')
  const [editStock, setEditStock] = useState('')

  const startEdit = (product) => {
    setEditingId(product._id)
    setEditPrice(product.price)
    setEditOfferPrice(product.offerPrice)
    setEditStock(product.stock !== undefined ? product.stock : 100)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const savePrice = async (id) => {
    try {
      const resPrice = await axios.post('/api/product/update-price', {
        id,
        price: Number(editPrice),
        offerPrice: Number(editOfferPrice)
      })
      const resStock = await axios.post('/api/product/stock', {
        id,
        stock: Number(editStock)
      })
      if (resPrice.data.success && resStock.data.success) {
        toast.success("Product updated successfully!")
        fetchProducts()
        setEditingId(null)
      } else {
        toast.error(resPrice.data.message || resStock.data.message)
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
        <div className="max-w-5xl w-full overflow-x-auto rounded-md bg-white border border-gray-500/20 no-scrollbar">
          <table className="w-full min-w-[750px] border-collapse text-left">
            <thead className="bg-gray-50 text-gray-900 text-sm border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Original Price</th>
                <th className="px-4 py-3 font-semibold">Selling Price</th>
                <th className="px-4 py-3 font-semibold">Stock Qty</th>
                <th className="px-4 py-3 font-semibold">Status</th>
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
                    {editingId === product._id ? (
                      <input 
                        type="number" 
                        value={editStock} 
                        onChange={(e) => setEditStock(e.target.value)} 
                        className="w-16 border border-gray-300 rounded px-2 py-1 text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      />
                    ) : (
                      <span className={`font-bold ${product.stock <= 0 ? 'text-rose-600' : 'text-gray-800'}`}>
                        {product.stock !== undefined ? product.stock : 100} pcs
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-black select-none ${
                      product.inStock && (product.stock === undefined || product.stock > 0)
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                        : "bg-rose-50 text-rose-700 border border-rose-100"
                    }`}>
                      {product.inStock && (product.stock === undefined || product.stock > 0) ? "In Stock" : "Out of Stock"}
                    </span>
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
                        Edit Product
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
