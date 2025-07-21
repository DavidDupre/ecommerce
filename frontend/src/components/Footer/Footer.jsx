import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10">
      <div className="max-w-7xl mx-auto px-4 md:flex md:justify-between">
        {/*  info */}
        <div className="mb-6 md:mb-0">
          <Link to="/">
            {/* <img src={Logo} alt="" className='w-32'/> */}
            <h1 className="text-red-500 text-2xl font-bold">OnBoarding</h1>
          </Link>
          <p className="mt-2 text-sm">Impulsa tu mundo con lo mejor en electrónica.</p>
          <p className="mt-2 text-sm">Tienda Virtual</p>
          <p className="text-sm">Email: d.aldanadupre@gmail.com</p>
          <p className="text-sm">Phone: (123) 456-7890</p>
        </div>
        {/* customer service link */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-semibold">Atención al cliente</h3>
          <ul className="mt-2 text-sm space-y-2">
            <li>Contacte con nosotros</li>
            <li>Envíos y devoluciones</li>
            <li>FAQs</li>
            <li>Seguimiento de pedidos</li>
          </ul>
        </div>
        {/* social media links */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-semibold">Siguenos en</h3>
          <div className="flex space-x-4 mt-2">
            <Facebook />
            <Instagram />
            <Twitter />
          </div>
        </div>
        {/* newsletter subscription */}
        <div>
          <h3 className="text-xl font-semibold">Manténgase informado</h3>
          <p className="mt-2 text-sm">
            Suscríbase para recibir ofertas especiales, sorteos y mucho más
          </p>
          <form
            action=""
            className="mt-4 flex"
          >
            <input
              type="email"
              placeholder="Dirección de correo electrónico"
              className="w-full p-2 rounded-l-md  text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <button
              type="submit"
              className="bg-red-600 text-white px-4 rounded-r-md hover:bg-red-700"
            >
              Suscribirse
            </button>
          </form>
        </div>
      </div>
      {/* bottom section */}
      <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm">
        <p>
          &copy; {new Date().getFullYear()} Creado por
          <span className="text-red-500"> David Dupre</span>.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
