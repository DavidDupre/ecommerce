// src/pages/ProductDetail.jsx
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import { IoCartOutline } from 'react-icons/io5';

const ProductDetail = () => {
  const params = useParams();
  const [SingleProduct, setProduct] = useState('');
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const getSingleProduct = async () => {
    try {
      const res = await axios.get(`http://54-210-169-255.nip.io/products/${params.id}`);
      const product = res.data.product;
      setProduct(product);
      console.log(product);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, []);

  if (!SingleProduct) return <div>Producto no encontrado</div>;

  return (
    <>
      {SingleProduct ? (
        <div className="px-4 pb-4 md:px-0">
          <div className="max-w-6xl mx-auto">
            <Link
              to="/products"
              className="inline-block mt-[15px] mb-6 text-black-700 hover:text-white bg-gray-200 hover:bg-red-500 transition-colors px-4 py-2 rounded-md text-sm font-medium"
            >
              Volver
            </Link>
          </div>

          <div className="max-w-6xl mx-auto md:p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* product image */}
            <div className="w-full">
              <img
                src={SingleProduct.image}
                alt={SingleProduct.title}
                className="rounded-2xl w-full object-cover"
              />
            </div>
            {/* product details */}
            <div className="flex flex-col gap-6">
              <h1 className="md:text-3xl text-xl font-bold text-gray-800">{SingleProduct.title}</h1>
              <div className="text-gray-700">
                {SingleProduct.brand?.toUpperCase()} /{SingleProduct.category?.toUpperCase()} /
                {SingleProduct.model}
              </div>
              <p className="text-xl text-red-500 font-bold">${SingleProduct.price} </p>
              <p className="text-gray-600">{SingleProduct.description}</p>

              {/* qunatity selector */}
              <div className="flex items-center gap-4">
                <label
                  htmlFor=""
                  className="text-sm font-medium text-gray-700"
                >
                  Quantity:
                </label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-20 border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => addToCart(SingleProduct, quantity)}
                  className="px-6 flex gap-2 py-2 text-lg bg-red-500 text-white rounded-md"
                >
                  <IoCartOutline className="w-6 h-6" /> Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <p className="text-2xl text-gray-600">Cargando producto...</p>
        </div>
      )}
    </>
  );
};

export default ProductDetail;
