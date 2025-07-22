import { render, screen, fireEvent } from '@testing-library/react';
import Navbar from '../Navbar';
import { CartProvider } from '../../../context/CartContext';
import { AuthProvider } from '../../../Auth/context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

describe('Navbar', () => {
  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Navbar />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>,
    );

    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Productos')).toBeInTheDocument();
    expect(screen.getByText('Seguimiento')).toBeInTheDocument();
    expect(screen.getByText('Contacto')).toBeInTheDocument();
  });

  it('shows cart item count', () => {
    const wrapper = ({ children }) => (
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </BrowserRouter>
    );

    render(<Navbar />, { wrapper });

    // Initially should show 0
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('toggles mobile menu', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Navbar />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>,
    );

    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
  });

  it('shows login modal when login button is clicked', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Navbar />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>,
    );

    const loginButton = screen.getByText('Iniciar sesión');
    fireEvent.click(loginButton);
    expect(screen.getByPlaceholderText('Usuario')).toBeInTheDocument();
  });
});
