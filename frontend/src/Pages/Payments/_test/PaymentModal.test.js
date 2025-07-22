// PaymentModal.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import PaymentModal from '../PaymentModal';

describe('PaymentModal', () => {
  const mockOnClose = jest.fn();
  const mockOnPay = jest.fn();

  beforeEach(() => {
    render(
      <PaymentModal
        onClose={mockOnClose}
        onPay={mockOnPay}
      />,
    );
  });

  it('renders card form', () => {
    expect(screen.getByPlaceholderText('1234 1234 1234 1234')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Como aparece en la tarjeta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('MM/AA')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('CVV')).toBeInTheDocument();
  });

  it('formats card number correctly', () => {
    const cardNumberInput = screen.getByPlaceholderText('1234 1234 1234 1234');
    fireEvent.change(cardNumberInput, { target: { value: '4111111111111111' } });
    expect(cardNumberInput.value).toBe('4111 1111 1111 1111');
  });

  it('formats expiry date correctly', () => {
    const expiryInput = screen.getByPlaceholderText('MM/AA');
    fireEvent.change(expiryInput, { target: { value: '1225' } });
    expect(expiryInput.value).toBe('12/25');
  });

  it('shows error when fields are empty', async () => {
    fireEvent.click(screen.getByText('Validar Tarjeta'));
    expect(await screen.findByText('Por favor completa todos los campos')).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    fireEvent.click(screen.getByText('Cancelar'));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
