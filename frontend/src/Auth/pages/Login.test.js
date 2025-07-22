// Login.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';
import { AuthProvider } from './AuthContext';

const mockLogin = jest.fn();
const mockSwitchToRegister = jest.fn();

describe('Login Component', () => {
  it('renders login form', () => {
    render(
      <AuthProvider>
        <Login
          onSuccess={jest.fn()}
          switchToRegister={mockSwitchToRegister}
        />
      </AuthProvider>,
    );

    expect(screen.getByPlaceholderText('Usuario')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
  });

  it('shows error when credentials are wrong', async () => {
    render(
      <AuthProvider>
        <Login
          onSuccess={jest.fn()}
          switchToRegister={mockSwitchToRegister}
        />
      </AuthProvider>,
    );

    fireEvent.change(screen.getByPlaceholderText('Usuario'), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByText('Iniciar Sesión'));

    expect(await screen.findByText('Credenciales incorrectas')).toBeInTheDocument();
  });

  it('calls switchToRegister when register link is clicked', () => {
    render(
      <AuthProvider>
        <Login
          onSuccess={jest.fn()}
          switchToRegister={mockSwitchToRegister}
        />
      </AuthProvider>,
    );

    fireEvent.click(screen.getByText('Regístrate'));
    expect(mockSwitchToRegister).toHaveBeenCalled();
  });
});
