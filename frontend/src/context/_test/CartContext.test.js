// CartContext.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import { CartProvider, useCart } from '../CartContext';

describe('CartContext', () => {
  it('should add item to cart', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    const product = { id: 1, name: 'Test Product', price: 100 };

    act(() => {
      result.current.addToCart(product);
    });

    expect(result.current.cartItem).toEqual([{ ...product, quantity: 1 }]);
  });

  it('should update quantity if item already exists in cart', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    const product = { id: 1, name: 'Test Product', price: 100 };

    act(() => {
      result.current.addToCart(product);
      result.current.addToCart(product, 2);
    });

    expect(result.current.cartItem).toEqual([{ ...product, quantity: 3 }]);
  });

  it('should remove item from cart', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    const product = { id: 1, name: 'Test Product', price: 100 };

    act(() => {
      result.current.addToCart(product);
      result.current.deleteItem(1);
    });

    expect(result.current.cartItem).toEqual([]);
  });

  it('should update quantity correctly', () => {
    const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;
    const { result } = renderHook(() => useCart(), { wrapper });

    const product = { id: 1, name: 'Test Product', price: 100 };

    act(() => {
      result.current.addToCart(product);
      result.current.updateQuantity(result.current.cartItem, 1, 'increase');
    });

    expect(result.current.cartItem[0].quantity).toBe(2);

    act(() => {
      result.current.updateQuantity(result.current.cartItem, 1, 'decrease');
    });

    expect(result.current.cartItem[0].quantity).toBe(1);

    act(() => {
      result.current.updateQuantity(result.current.cartItem, 1, 'decrease');
    });

    expect(result.current.cartItem).toEqual([]);
  });
});
