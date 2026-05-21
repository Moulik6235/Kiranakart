import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/greencart_assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const SellerLayout = () => {

    const { axios, navigate, setIsSeller } = useAppContext()



    const sidebarLinks = [
        { name: "Add Product", path: "/seller", icon: assets.add_icon },
        { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
        { name: "Order", path: "/seller/orders", icon: assets.order_icon },
        { name: "Store Settings", path: "/seller/settings", icon: assets.box_icon },
    ];

    const logout = async () => {
        try {
            const { data } = await axios.post('/api/seller/logout');
            if (data.success) {
                setIsSeller(false)
                toast.success(data.message)
                navigate('/')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    return (
        <>
            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white">
                <Link to="/">
                    <img src={assets.logo} alt="logo" className="cursor-pointer w-34 md:w-38" />
                </Link>
                <div className="flex items-center gap-5 text-gray-500">
                    <p className="font-semibold text-slate-800">Hi! Admin</p>
                    <button 
                        onClick={() => {
                            setIsSeller(false);
                            navigate('/');
                        }} 
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#4F46E5]/10 hover:bg-[#4F46E5]/20 text-[#4F46E5] text-xs font-black rounded-lg transition active:scale-95 cursor-pointer shadow-3xs"
                    >
                        <span>🛍️</span>
                        <span>Customer View</span>
                    </button>
                    <button onClick={logout} className='border rounded-full text-sm px-4 py-1 cursor-pointer hover:bg-slate-50 transition'>Logout</button>
                </div>
            </div>
            <div className="flex">
                <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex flex-col">
                    {sidebarLinks.map((item) => (
                        <NavLink to={item.path} key={item.name} end={item.path === "/seller"}
                            className={({ isActive }) => `flex items-center py-3 px-4 gap-3 
                            ${isActive ? "border-r-4 md:border-r-[6px] bg-primary/10 border-primary text-primary"
                                    : "hover:bg-gray-100/90 border-white"
                                }`
                            }
                        >
                            <img src={item.icon} alt="icon" className="w-7 h-7" />
                            <p className="md:block hidden text-center">{item.name}</p>
                        </NavLink>
                    ))}
                </div>
                <Outlet />
            </div>

        </>
    );
};

export default SellerLayout