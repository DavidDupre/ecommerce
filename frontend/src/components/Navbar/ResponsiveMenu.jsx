import React from 'react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ResponsiveMenu = ({ openNav, setOpenNav, isLoggedIn, handleAuth }) => {
  return (
    <div
      className={`${
        openNav ? 'left-0' : '-left-[100%]'
      } fixed bottom-0 top-0 z-20 flex h-full w-[75%] flex-col justify-between bg-white px-8 pb-6 pt-16 text-black md:hidden rounded-r-xl shadow-md transition-all`}
    >
      <div>
        <div className="flex items-center justify-start gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <FaUserCircle size={50} />
              <button
                onClick={handleAuth}
                className="flex items-center gap-1 text-red-500"
              >
                <FaSignOutAlt size={20} />
              </button>
            </div>
          ) : (
            <FaUserCircle size={50} />
          )}
          <div>
            <h1>Hola!!, {isLoggedIn ? 'Usuario' : 'Invitado'}</h1>
            <h1 className="text-sm text-slate-500">
              {isLoggedIn ? 'Premium User' : 'Please sign in'}
            </h1>
          </div>
        </div>
        <nav className="mt-12">
          <ul className="flex flex-col gap-7 text-2xl font-semibold">
            <Link
              to={'/'}
              onClick={() => setOpenNav(false)}
              className="cursor-pointer"
            >
              <li>Inicio</li>
            </Link>
            <Link
              to={'/products'}
              onClick={() => setOpenNav(false)}
              className="cursor-pointer"
            >
              <li>Productos</li>
            </Link>
            <Link
              to={'/about'}
              onClick={() => setOpenNav(false)}
              className="cursor-pointer"
            >
              <li>Seguimiento</li>
            </Link>
            <Link
              to={'/contact'}
              onClick={() => setOpenNav(false)}
              className="cursor-pointer"
            >
              <li>Contacto</li>
            </Link>

            <div className="mt-4">
              {isLoggedIn ? (
                <button
                  onClick={handleAuth}
                  className="flex items-center gap-2 text-red-500 font-semibold"
                >
                  <FaSignOutAlt />
                  Cerrar sesión
                </button>
              ) : (
                <button
                  onClick={handleAuth}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Iniciar sesión
                </button>
              )}
            </div>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default ResponsiveMenu;
