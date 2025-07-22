import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import About from '../About';
import axios from 'axios';

jest.mock('axios');

describe('About Component', () => {
  const mockTransactionData = {
    status: 'Delivered',
    customerName: 'John Doe',
    deliveryAddress: '123 Main St',
    city: 'New York',
    postalCode: '10001',
    totalAmount: 150.99,
    createdAt: '2023-01-01T00:00:00Z',
    estimatedDelivery: { message: 'Jan 5, 2023' },
    products: [
      { name: 'Product 1', price: 50.99, quantity: 1 },
      { name: 'Product 2', price: 100.0, quantity: 1 },
    ],
  };

  it('renders tracking form', () => {
    render(<About />);
    expect(screen.getByPlaceholderText('Digite número de compra')).toBeInTheDocument();
    expect(screen.getByText('Consultar')).toBeInTheDocument();
  });

  it('fetches transaction data when form is submitted', async () => {
    axios.get.mockResolvedValue({ data: { data: mockTransactionData } });
    render(<About />);

    const input = screen.getByPlaceholderText('Digite número de compra');
    const button = screen.getByText('Consultar');

    fireEvent.change(input, { target: { value: '12345' } });
    fireEvent.click(button);

    expect(await screen.findByText('Cargando...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Información de la Compra')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
    });
  });

  it('shows error when transaction is not found', async () => {
    axios.get.mockRejectedValue(new Error('Transaction not found'));
    render(<About />);

    const input = screen.getByPlaceholderText('Digite número de compra');
    const button = screen.getByText('Consultar');

    fireEvent.change(input, { target: { value: 'invalid' } });
    fireEvent.click(button);

    expect(
      await screen.findByText('No se pudo encontrar la información de la compra.'),
    ).toBeInTheDocument();
  });
});
