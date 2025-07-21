import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { FaRegTrashAlt } from 'react-icons/fa';
import { LuNotebookText } from 'react-icons/lu';
import { MdDeliveryDining } from 'react-icons/md';
import { GiShoppingBag } from 'react-icons/gi';
import { useNavigate } from 'react-router-dom';
import emptyCart from '../../assets/empty-cart.png';
import PaymentModal from '../../Pages/Payments/PaymentModal';

const Cart = ({ location, getLocation }) => {
  const { cartItem, updateQuantity, deleteItem } = useCart();
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const totalPrice = cartItem.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingCost = totalPrice > 100 ? 0 : 15;

  const handlePaymentSuccess = (token) => {
    setModalOpen(false);
  };

  return (
    <div className="mt-10 max-w-6xl mx-auto mb-5 px-4 md:px-0">
      {cartItem.length > 0 ? (
        <div>
          <h1 className="font-bold text-2xl ">Carrito ({cartItem.length})</h1>
          <div>
            <div className="mt-10">
              {cartItem.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="bg-gray-100 p-5 rounded-md flex items-center justify-between mt-3 w-full"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-20 rounded-md"
                      />
                      <div>
                        <h1 className="md:w-[300px] line-clamp-2 ">{item.title}</h1>
                        <p className="text-red-500 font-semibold text-lg">${item.price}</p>
                      </div>
                    </div>
                    <div className="bg-red-500 text-white flex gap-4 p-2 rounded-md font-bold text-xl">
                      <button
                        onClick={() => updateQuantity(cartItem, item.id, 'decrease')}
                        className="cursor-pointer"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(cartItem, item.id, 'increase')}
                        className="cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <span
                      onClick={() => deleteItem(item.id)}
                      className="hover:bg-white/60 transition-all rounded-full p-3 hover:shadow-2xl"
                    >
                      <FaRegTrashAlt className="text-red-500 text-2xl cursor-pointer" />
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-20">
              <div className="bg-gray-100 rounded-md p-7 mt-4 space-y-2">
                <h1 className="text-gray-800 font-bold text-xl">Información de envío</h1>
                <div className="flex flex-col space-y-1">
                  <label htmlFor="">Nombre Completo</label>
                  <input
                    type="text"
                    placeholder="Nombre Completo"
                    className="p-2 rounded-md"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <label htmlFor="">Dirección</label>
                  <input
                    type="text"
                    placeholder="Ingresa tu dirección de envío"
                    className="p-2 rounded-md"
                    value={location?.county}
                  />
                </div>
                <div className="flex w-full gap-5">
                  <div className="flex flex-col space-y-1 w-full">
                    <label htmlFor="">Ciudad</label>
                    <input
                      type="text"
                      placeholder="Ingresa tu ciudad"
                      className="p-2 rounded-md w-full"
                      value={location?.state}
                    />
                  </div>
                  <div className="flex flex-col space-y-1 w-full">
                    <label htmlFor="">Código postal</label>
                    <input
                      type="text"
                      placeholder="Ingresa tu código postal"
                      className="p-2 rounded-md w-full"
                      value={location?.postcode}
                    />
                  </div>
                </div>
                <div className="flex w-full gap-5">
                  <div className="flex flex-col space-y-1 w-full">
                    <label htmlFor="">Número de Teléfono</label>
                    <input
                      type="text"
                      placeholder="Ingresa tu número de teléfono"
                      className="p-2 rounded-md w-full"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center w-full text-gray-700">
                  ---------O-----------
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={getLocation}
                    className="bg-red-500 text-white px-3 py-2 rounded-md"
                  >
                    Detectar Localización
                  </button>
                </div>
              </div>
              <div className="bg-white border border-gray-100 shadow-xl rounded-md p-7 mt-4 space-y-2 h-max">
                <h1 className="text-gray-800 font-bold text-xl">Detalles de la factura</h1>
                <div className="flex justify-between items-center">
                  <h1 className="flex gap-1 items-center text-gray-700">
                    <span>
                      <LuNotebookText />
                    </span>
                    Productos
                  </h1>
                  <p>${totalPrice}</p>
                </div>
                <div className="flex justify-between items-center">
                  <h1 className="flex gap-1 items-center text-gray-700">
                    <span>
                      <MdDeliveryDining />
                    </span>
                    Envío y manejo
                  </h1>
                  <p className={`text-red-500 font-semibold`}>
                    {shippingCost === 0 ? (
                      <>
                        <span className="text-gray-600 line-through">$15</span> FREE
                      </>
                    ) : (
                      `$${shippingCost}`
                    )}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <h1 className="flex gap-1 items-center text-gray-700">
                    <span>
                      <GiShoppingBag />
                    </span>
                    Cuota de garantía del tipo de cambio
                  </h1>
                  <p className="text-red-500 font-semibold">$5</p>
                </div>
                <hr className="text-gray-200 mt-2" />
                <div className="flex justify-between items-center">
                  <h1 className="font-semibold text-lg">Total</h1>
                  <p className="font-semibold text-lg">${totalPrice + shippingCost}</p>
                </div>
                <div>
                  <h1 className="font-semibold text-gray-700 mb-3 mt-7">Código de promoción</h1>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="p-2 rounded-md w-full"
                    />
                    <button className="bg-white text-black border border-gray-200 px-4 cursor-pointer py-1 rounded-md">
                      Aplicar
                    </button>
                  </div>
                </div>
                <button
                  className="bg-red-500 text-white px-3 py-2 rounded-md w-full cursor-pointer mt-3"
                  onClick={() => setModalOpen(true)}
                >
                  Proceder al pago
                </button>
                {isModalOpen && (
                  <PaymentModal
                    onClose={() => setModalOpen(false)}
                    onPay={handlePaymentSuccess}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 justify-center items-center h-[600px]">
          <h1 className="text-red-500/80 font-bold text-5xl text-muted">
            Oh no! Your cart is empty
          </h1>
          <img
            src={emptyCart}
            alt=""
            className="w-[400px]"
          />
          <button
            onClick={() => navigate('/products')}
            className="bg-red-500 text-white px-3 py-2 rounded-md cursor-pointer "
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
