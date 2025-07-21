import { Search } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-20">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-8">
        <h1 className="text-4xl font-bold  text-center">Seguimiento de Compra</h1>

        <div className="text-center mt-10">
          <h3 className="text-xl font-semibold text-red-600 mb-2">Número de compra</h3>
          <div className="flex items-center justify-center gap-4">
            <input
              type="text"
              placeholder="Digite número de compra"
              className="w-100 rounded-full px-3 py-1 border border-red focus:outline-none transition-all duration-300"
            />
            <Search className="text-xl text-red-600" />
            <Link to={'/products'}>
              <button className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition duration-300">
                Consultar
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
