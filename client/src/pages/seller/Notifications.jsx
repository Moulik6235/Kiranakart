import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Notifications = () => {
  const { axios, currency } = useAppContext()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/seller/notifications')
      if (data.success) {
        setNotifications(data.notifications)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const markAllRead = async () => {
    try {
      const { data } = await axios.post('/api/seller/notifications/read', {})
      if (data.success) {
        toast.success("All notifications marked as read")
        fetchNotifications()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const markSingleRead = async (id) => {
    try {
      const { data } = await axios.post('/api/seller/notifications/read', { id })
      if (data.success) {
        fetchNotifications()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-gray-50/50">
      <div className="w-full md:p-10 p-4 max-w-4xl">
        <div className="flex justify-between items-center pb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Seller Notifications</h2>
            <p className="text-xs text-gray-500 mt-1 font-semibold">Track stock warnings and store alerts</p>
          </div>
          {notifications.some(n => !n.read) && (
            <button 
              onClick={markAllRead}
              className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-black rounded-lg transition active:scale-95 cursor-pointer shadow-3xs"
            >
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200/60 shadow-sm">
            <span className="text-4xl">🔔</span>
            <h3 className="font-extrabold text-gray-800 text-base mt-4">All quiet here</h3>
            <p className="text-xs text-gray-400 mt-1 font-semibold">You have no notifications at the moment.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((item) => (
              <div 
                key={item._id}
                onClick={() => !item.read && markSingleRead(item._id)}
                className={`bg-white rounded-2xl p-5 border transition-all flex items-start justify-between gap-4 shadow-3xs cursor-pointer hover:shadow-2xs ${
                  item.read ? 'border-gray-150/70 opacity-75' : 'border-rose-100 bg-rose-50/5'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    item.type === 'warning' ? 'bg-rose-50 text-rose-500' : 'bg-blue-50 text-blue-500'
                  }`}>
                    <span className="text-lg font-bold">{item.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className={`text-sm ${item.read ? 'font-semibold text-gray-700' : 'font-extrabold text-gray-900'}`}>
                        {item.message}
                      </p>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0 animate-pulse"></span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications
