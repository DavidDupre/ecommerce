import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const About = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [transactionData, setTransactionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTransactionData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://54-210-169-255/transaction/${trackingNumber}`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
      setTransactionData(response.data.data);
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudo encontrar la información de la compra.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-20">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-8">
        <h1 className="text-4xl font-bold text-center">Seguimiento de Compra</h1>

        <div className="text-center mt-10">
          <h3 className="text-xl font-semibold text-red-600 mb-2">Número de compra</h3>
          <div className="flex items-center justify-center gap-4">
            <input
              type="text"
              placeholder="Digite número de compra"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="w-100 rounded-full px-3 py-1 border border-red focus:outline-none transition-all duration-300"
            />
            <Search
              className="text-xl text-red-600 cursor-pointer"
              onClick={fetchTransactionData}
            />
            <button
              onClick={fetchTransactionData}
              className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition duration-300"
            >
              Consultar
            </button>
          </div>

          {/* Mostrar los resultados de la consulta */}
          {loading && <p className="text-center text-blue-600 mt-4">Cargando...</p>}
          {error && <p className="text-center text-red-600 mt-4">{error}</p>}

          {transactionData && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold">Información de la Compra</h3>
              <div className="space-y-4 mt-4">
                <p>
                  <strong>Estado:</strong> {transactionData.status}
                </p>
                <p>
                  <strong>Cliente:</strong> {transactionData.customerName}
                </p>
                <p>
                  <strong>Dirección de entrega:</strong> {transactionData.deliveryAddress}
                </p>
                <p>
                  <strong>Ciudad:</strong> {transactionData.city}
                </p>
                <p>
                  <strong>Código Postal:</strong> {transactionData.postalCode}
                </p>
                <p>
                  <strong>Total:</strong> ${transactionData.totalAmount.toFixed(2)}
                </p>
                <p>
                  <strong>Fecha de creación:</strong>{' '}
                  {new Date(transactionData.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Fecha estimada de entrega:</strong>{' '}
                  {transactionData.estimatedDelivery.message}
                </p>

                <div className="mt-4">
                  <h4 className="text-lg font-semibold">Productos:</h4>
                  <ul className="list-disc ml-5">
                    {transactionData.products.map((product, index) => (
                      <li key={index}>
                        Producto: {product.name}, Precio: ${product.price}, Cantidad:{' '}
                        {product.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;
