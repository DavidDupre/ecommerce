import { useState } from 'react';

const getCardType = (number) => {
  const num = number.replace(/\D/g, '');
  if (/^4/.test(num)) return 'VISA';
  if (/^5[1-5]/.test(num)) return 'MASTERCARD';
  if (/^3[47]/.test(num)) return 'AMEX';
  if (/^6(?:011|5)/.test(num)) return 'DISCOVER';
  return 'TARJETA';
};

const tokenizeCard = async ({ number, cvc, exp_month, exp_year, card_holder }) => {
  const publicKey = 'pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7';

  const response = await fetch('https://api-sandbox.co.uat.wompi.dev/v1/tokens/cards', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${publicKey}`,
    },
    body: JSON.stringify({
      number: number.replace(/\s/g, ''),
      cvc,
      exp_month,
      exp_year,
      card_holder,
    }),
  });

  const data = await response.json();

  if (data.status === 'CREATED') {
    return data.data.id;
  } else {
    throw new Error(data.error_message || 'Tokenización fallida');
  }
};

const CreditCardPreview = ({ number, name, expiry, cvc }) => {
  const cardType = getCardType(number);
  const formattedNumber =
    number
      .replace(/\s/g, '')
      .padEnd(16, '•')
      .match(/.{1,4}/g)
      ?.join(' ') || '';
  const formattedExpiry = expiry.padEnd(4, '•').replace(/(\d{2})22(\d{0,2})/, '$1/$2');
  const formattedCvc = cvc.padEnd(3, '•');

  return (
    <div className="bg-gradient-to-r from-blue-800 to-blue-600 rounded-lg p-4 text-white mb-4 shadow-lg h-40 flex flex-col justify-between">
      <div className="flex justify-between">
        <div className="text-sm">Número de tarjeta</div>
        <div className="text-xs">{cardType}</div>
      </div>

      <div className="text-xl font-mono tracking-wider">{formattedNumber}</div>

      <div className="flex justify-between">
        <div>
          <div className="text-xs">Titular</div>
          <div className="text-sm uppercase">{name || '••••••••'}</div>
        </div>

        <div>
          <div className="text-xs">Expira</div>
          <div className="text-sm">{formattedExpiry}</div>
        </div>

        <div>
          <div className="text-xs">CVV</div>
          <div className="text-sm">{formattedCvc}</div>
        </div>
      </div>
    </div>
  );
};

const PaymentModal = ({ onClose, onPay }) => {
  const [state, setState] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validationLoading, setValidationLoading] = useState(false);
  const [token, setToken] = useState(null);
  const [validated, setValidated] = useState(false);

  const formatCardNumber = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, '');

    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;

    if (name === 'number') {
      processedValue = formatCardNumber(value).slice(0, 19);
    } else if (name === 'expiry') {
      processedValue = formatExpiry(value).slice(0, 5);
    } else if (name === 'cvc') {
      processedValue = value.replace(/\D/g, '').slice(0, 3);
    } else if (name === 'name') {
      processedValue = value.toUpperCase();
    }

    setState((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    if (validated) {
      setValidated(false);
      setToken(null);
    }
  };

  const validateCard = async () => {
    setError('');
    setValidationLoading(true);

    try {
      if (!state.number || !state.name || !state.expiry || !state.cvc) {
        throw new Error('Por favor completa todos los campos');
      }

      const expiryDigits = state.expiry.replace(/\D/g, '');
      if (expiryDigits.length !== 4) throw new Error('Formato de fecha inválido');

      const exp_month = expiryDigits.slice(0, 2);
      const exp_year = expiryDigits.slice(2, 4);

      const cardToken = await tokenizeCard({
        number: state.number,
        cvc: state.cvc,
        exp_month,
        exp_year,
        card_holder: state.name,
      });

      setToken(cardToken);
      setValidated(true);
    } catch (err) {
      setError(err.message || 'Error validando la tarjeta');
      setValidated(false);
      setToken(null);
    } finally {
      setValidationLoading(false);
    }
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!validated || !token) {
        throw new Error('Por favor valida la tarjeta primero');
      }

      await onPay({ card_token: token });
      onClose();
    } catch (err) {
      setError(err.message || 'Error procesando el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-2">
        <h2 className="text-xl font-semibold mb-4 text-center">Ingrese datos de la tarjeta</h2>

        {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded text-sm">{error}</div>}
        {validated && (
          <div className="bg-green-100 text-green-700 p-2 mb-4 rounded text-sm">
            Tarjeta validada correctamente
          </div>
        )}

        <form
          onSubmit={handlePay}
          className="space-y-3"
        >
          <div>
            <label
              htmlFor="number"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Número de tarjeta
            </label>
            <input
              type="text"
              name="number"
              id="number"
              placeholder="1234 1234 1234 1234"
              value={state.number}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={19}
              required
              disabled={validated}
            />
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre del titular
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Como aparece en la tarjeta"
              value={state.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={validated}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="expiry"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Fecha expiración (MM/AA)
              </label>
              <input
                type="text"
                name="expiry"
                id="expiry"
                placeholder="MM/AA"
                value={state.expiry}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={5}
                required
                disabled={validated}
              />
            </div>

            <div>
              <label
                htmlFor="cvc"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Código CVV
              </label>
              <input
                type="text"
                name="cvc"
                id="cvc"
                placeholder="CVV"
                value={state.cvc}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                maxLength={3}
                required
                disabled={validated}
              />
            </div>
          </div>

          {!validated ? (
            <div className="flex justify-between gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                disabled={validationLoading}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={validateCard}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-70"
                disabled={validationLoading}
              >
                {validationLoading ? 'Validando...' : 'Validar Tarjeta'}
              </button>
            </div>
          ) : (
            <div className="flex justify-between gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setValidated(false);
                  setToken(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                disabled={loading}
              >
                Editar Datos
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-70"
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Confirmar Pago'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
