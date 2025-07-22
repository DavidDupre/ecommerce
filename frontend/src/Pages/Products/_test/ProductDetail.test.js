import { render, screen, waitFor } from '@testing-library/react';
import ProductDetail from '../ProductDetail';
import { CartProvider } from '../../../context/CartContext';
import axios from 'axios';

jest.mock('axios');

describe('ProductDetail', () => {
  const mockProduct = {
    id: 1,
    title: 'Test Product',
    price: 100,
    description: 'Test Description',
    image: 'test.jpg',
    brand: 'TestBrand',
    category: 'TestCategory',
    model: 'TestModel',
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: {
        product: mockProduct,
      },
    });
  });

  it('fetches and displays product details', async () => {
    render(
      <CartProvider>
        <ProductDetail />
      </CartProvider>,
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
      expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
      expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument();
      expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    });
  });

  it('adds product to cart when button is clicked', async () => {
    render(
      <CartProvider>
        <ProductDetail />
      </CartProvider>,
    );

    await waitFor(() => {
      const quantityInput = screen.getByRole('spinbutton');
      fireEvent.change(quantityInput, { target: { value: '2' } });
      fireEvent.click(screen.getByText('Add to Cart'));
    });
  });

  it('shows loading state initially', () => {
    render(
      <CartProvider>
        <ProductDetail />
      </CartProvider>,
    );

    expect(screen.getByText('Cargando producto...')).toBeInTheDocument();
  });
});
