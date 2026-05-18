import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/greencart_assets/assets";
import ProductCard from "../components/ProductCard";

const ProductDetails = () => {

    const { products, navigate, currency, addToCart } = useAppContext()
    const { id } = useParams()

    const [relatedProducts, setRelatedProducts] = useState([]);

    const [thumbnail, setThumbnail] = useState(null);
    const product = products.find((item) => item._id === id);
    useEffect(() => {
        if (products.length > 0) {
            let productsCopy = products.slice();
            productsCopy = productsCopy.filter((item) => product.category === item.category)
            setRelatedProducts(productsCopy.slice(0, 5))
        }
    }, [products])

    useEffect(() => {
        setThumbnail(product?.image[0] ? product.image[0] : null)
    }, [product])

    return product && (
        <div className="mt-12 px-6 md:px-16 lg:px-24 xl:px-32">
            <p className="text-on-surface-variant text-sm font-medium">
                <Link to={"/"} className="hover:text-primary transition">Home</Link> /
                <Link to={"/products"} className="hover:text-primary transition"> Products</Link> /
                <Link to={`/products/${product.category.toLowerCase()}`} className="hover:text-primary transition"> {product.category}</Link> /
                <span className="text-primary font-bold"> {product.name}</span>
            </p>

            <div className="flex flex-col md:flex-row gap-12 mt-8">
                <div className="flex gap-4">
                    <div className="flex flex-col gap-3">
                        {product.image.map((image, index) => (
                            <div key={index} onClick={() => setThumbnail(image)} className={`border-2 rounded-xl overflow-hidden cursor-pointer max-w-20 transition ${thumbnail === image ? 'border-primary' : 'border-outline-variant hover:border-outline'}`} >
                                <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>

                    <div className="border border-outline-variant max-w-100 rounded-3xl overflow-hidden bg-surface-container-lowest shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-center p-4">
                        <img src={thumbnail} alt="Selected product" className="w-full h-full object-contain" />
                    </div>
                </div>

                <div className="text-sm w-full md:w-1/2 flex flex-col justify-center">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface leading-tight tracking-tight">{product.name}</h1>

                    <div className="flex items-center gap-1 mt-3">
                        {Array(5).fill('').map((_, i) => (
                            <img key={i} src={i < 4 ? assets.star_icon : assets.star_dull_icon} alt="star-icon" className="md:w-4 w-3.5" />
                        ))}
                        <p className="text-sm font-medium text-outline ml-2">(4 Reviews)</p>
                    </div>

                    <div className="mt-8 bg-surface-container rounded-2xl p-6 border border-outline-variant/50">
                        {product.price > product.offerPrice && (
                            <p className="text-outline text-sm line-through font-medium">MRP: {currency} {product.price}</p>
                        )}
                        <div className="flex items-end gap-3 mt-1">
                            <p className="text-4xl font-extrabold text-on-surface">{currency} {product.offerPrice}</p>
                            <span className="text-outline font-medium text-sm pb-1">(inclusive of all taxes)</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <p className="text-lg font-bold text-on-surface mb-3 tracking-tight">About Product</p>
                        <ul className="list-disc ml-5 text-on-surface-variant font-medium leading-relaxed space-y-2">
                            {product.description.map((desc, index) => (
                                <li key={index}>{desc}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center mt-10 gap-4 text-base">
                        <button onClick={() => addToCart(product._id)} className="w-full py-4 rounded-xl cursor-pointer font-bold bg-surface-container border border-outline-variant text-on-surface hover:bg-surface-container-high transition shadow-sm" >
                            Add to Cart
                        </button>
                        <button onClick={() => { addToCart(product._id); navigate("/cart") }} className="w-full py-4 rounded-xl cursor-pointer font-bold bg-primary text-white hover:bg-primary-container shadow-sm active:scale-95 transition" >
                            Buy now
                        </button>
                    </div>
                </div>
            </div>
            {/* ----------Related Products----------- */}
            <div className="flex flex-col items-center mt-24">
                <div className="flex flex-col items-center w-max">
                    <p className="text-3xl font-extrabold text-on-surface tracking-tight">Related Products</p>
                    <div className="w-20 h-1 bg-primary rounded-full mt-2"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 lg:grid-cols-5 mt-10 w-full">
                    {relatedProducts.filter((product)=> product.inStock).map((product, index)=> (
                        <ProductCard key={index} product={product}/>
                    ))}
                </div>
                <button onClick={()=> {navigate('/products'); scrollTo(0,0)}} className="mx-auto cursor-pointer px-12 my-16 py-3 border-2 border-primary rounded-full text-primary font-bold hover:bg-primary/10 transition shadow-sm">See More</button>
            </div>
        </div>
    );
};

export default ProductDetails