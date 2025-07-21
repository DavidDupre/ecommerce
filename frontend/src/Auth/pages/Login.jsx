import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Login = ({ onSuccess, switchToRegister }) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      if (user === 'usuariodemo' && password === 'contraseña123') {
        const mockUser = {
          id: '1',
          username: user,
          name: 'Usuario Demo',
        };
        await login(mockUser);
        onSuccess?.(); // Cierra el modal si existe
        navigate('/');
      } else {
        throw new Error('Credenciales incorrectas');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[90vw] mx-auto p-4 bg-white/90 rounded-lg border border-gray-200/60">
      {/* Encabezado */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Iniciar Sesión</h2>
      </div>

      {/* Mensaje de error */}
      {error && <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4 text-xs">{error}</div>}

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="space-y-3"
      >
        <div>
          <input
            type="text"
            placeholder="Usuario"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-sm bg-red-500 text-white rounded-md ${
            loading ? 'opacity-70' : ''
          }`}
        >
          {loading ? 'Cargando...' : 'Iniciar Sesión'}
        </button>
      </form>

      {/* Enlace a registro */}
      <p className="text-xs text-center text-gray-600 mt-3">
        ¿No tienes cuenta?{' '}
        <button
          onClick={switchToRegister}
          className="text-red-500 font-medium"
        >
          Regístrate
        </button>
      </p>
    </div>
  );
};

export default Login;
