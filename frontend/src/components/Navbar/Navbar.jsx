import React, { useState } from 'react';
import { IoCartOutline } from 'react-icons/io5';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import ResponsiveMenu from './ResponsiveMenu';
import { HiMenuAlt1, HiMenuAlt3 } from 'react-icons/hi';
import Login from '../../Auth/pages/Login';
import Register from '../../Auth/pages/Register';
import { useAuth } from '../../Auth/hooks/useAuth';
import { FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { cartItem } = useCart();
  const [openNav, setOpenNav] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(null); // 'login' | 'register' | null
  const { user, isAuthenticated, logout } = useAuth();

  const openLoginModal = () => setShowAuthModal('login');
  const openRegisterModal = () => setShowAuthModal('register');
  const closeAuthModal = () => setShowAuthModal(null);

  const handleAuth = () => {
    if (isAuthenticated) {
      logout();
    } else {
      openLoginModal();
    }
  };

  return (
    <div className="bg-white py-3 shadow-2xl px-4 md:px-0">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* logo section */}
        <div className="flex gap-7 items-center">
          <Link to={'/'}>
            <h1 className="font-bold text-3xl">
              <span className="text-red-500 font-serif">On</span>Boarding
            </h1>
          </Link>
        </div>
        {/* menu section */}
        <nav className="flex gap-7 items-center">
          <ul className="md:flex gap-7 items-center text-xl font-semibold hidden">
            <NavLink
              to={'/'}
              className={({ isActive }) =>
                `${
                  isActive ? 'border-b-3 transition-all border-red-500' : 'text-black'
                } cursor-pointer`
              }
            >
              <li>Inicio</li>
            </NavLink>
            <NavLink
              to={'/products'}
              className={({ isActive }) =>
                `${
                  isActive ? 'border-b-3 transition-all border-red-500' : 'text-black'
                } cursor-pointer`
              }
            >
              <li>Productos</li>
            </NavLink>
            <NavLink
              to={'/about'}
              className={({ isActive }) =>
                `${
                  isActive ? 'border-b-3 transition-all border-red-500' : 'text-black'
                } cursor-pointer`
              }
            >
              <li>Seguimiento</li>
            </NavLink>
            <NavLink
              to={'/contact'}
              className={({ isActive }) =>
                `${
                  isActive ? 'border-b-3 transition-all border-red-500' : 'text-black'
                } cursor-pointer`
              }
            >
              <li>Contacto</li>
            </NavLink>
          </ul>
          <Link
            to={'/cart'}
            className="relative"
          >
            <IoCartOutline className="h-7 w-7" />
            <span className="bg-red-500 px-2 rounded-full absolute -top-3 -right-3 text-white">
              {cartItem.length}
            </span>
          </Link>
          <div className="hidden md:block">
            {isAuthenticated ? (
              <button
                onClick={handleAuth}
                className="flex items-center gap-1 text-red-500 font-semibold hover:text-red-700"
              >
                <FaSignOutAlt className="" />
                <span className="hidden md:inline">Cerrar sesión</span>
              </button>
            ) : (
              <button
                onClick={handleAuth}
                className="bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer"
              >
                <span className="hidden md:inline">Iniciar sesión</span>
              </button>
            )}
          </div>
          {openNav ? (
            <HiMenuAlt3
              onClick={() => setOpenNav(false)}
              className="h-7 w-7 md:hidden"
            />
          ) : (
            <HiMenuAlt1
              onClick={() => setOpenNav(true)}
              className="h-7 w-7 md:hidden"
            />
          )}
        </nav>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] flex items-center justify-center z-50 p-4">
          <div className="bg-black/15 border border-gray-200 rounded-lg shadow-lg w-full max-w-md relative">
            <button
              onClick={closeAuthModal}
              className="absolute top-3 right-3 text-black hover:text-gray-900 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="pt-10 pb-6 px-6">
              {' '}
              {showAuthModal === 'login' ? (
                <Login
                  onSuccess={closeAuthModal}
                  switchToRegister={openRegisterModal}
                />
              ) : (
                <Register
                  onSuccess={closeAuthModal}
                  switchToLogin={openLoginModal}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <ResponsiveMenu
        openNav={openNav}
        setOpenNav={setOpenNav}
        isLoggedIn={isAuthenticated}
        handleAuth={handleAuth}
      />
    </div>
  );
};

export default Navbar;
