import { createContext, useContext, useState, useEffect } from 'react';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // Cargar el carrito desde localStorage al inicializar
  const [cartItem, setCartItem] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  // Guardar en localStorage cada vez que cambie el carrito
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cartItem));
    }
  }, [cartItem]);

  const addToCart = (product, quantity = 1) => {
    const itemInCart = cartItem.find((item) => item.id === product.id);
    if (itemInCart) {
      const updatedCart = cartItem.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
      );
      setCartItem(updatedCart);
    } else {
      setCartItem([...cartItem, { ...product, quantity }]);
    }
  };

  const updateQuantity = (cartItem, productId, action) => {
    setCartItem(
      cartItem
        .map((item) => {
          if (item.id === productId) {
            let newUnit = item.quantity;
            if (action === 'increase') {
              newUnit = newUnit + 1;
            } else if (action === 'decrease') {
              newUnit = newUnit - 1;
            }
            return newUnit > 0 ? { ...item, quantity: newUnit } : null;
          }
          return item;
        })
        .filter((item) => item != null),
    );
  };

  const deleteItem = (productId) => {
    setCartItem(cartItem.filter((item) => item.id !== productId));
  };

  return (
    <CartContext.Provider value={{ cartItem, setCartItem, addToCart, updateQuantity, deleteItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
