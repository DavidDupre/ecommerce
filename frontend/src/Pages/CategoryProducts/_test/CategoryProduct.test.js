import { render, screen, waitFor } from '@testing-library/react';
import CategoryProduct from '../CategoryProducts';
import axios from 'axios';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

jest.mock('axios');

describe('CategoryProduct Component', () => {
  const mockProducts = [
    { id: 1, name: 'Product 1', price: 100, image: 'image1.jpg' },
    { id: 2, name: 'Product 2', price: 200, image: 'image2.jpg' },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: { products: mockProducts },
    });
  });

  it('should fetch and display products by category', async () => {
    render(
      <MemoryRouter initialEntries={['/category/electronics']}>
        <Routes>
          <Route
            path="/category/:category"
            element={<CategoryProduct />}
          />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        'http://ec2-3-14-72-122.us-east-2.compute.amazonaws.com:3000/products/category/electronics',
      );
      expect(screen.getByText('Back')).toBeInTheDocument();
      expect(screen.getAllByRole('article').length).toBe(mockProducts.length);
    });
  });

  it('should show loading state initially', () => {
    render(
      <MemoryRouter initialEntries={['/category/electronics']}>
        <Routes>
          <Route
            path="/category/:category"
            element={<CategoryProduct />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText('Back')).not.toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));
    console.error = jest.fn();

    render(
      <MemoryRouter initialEntries={['/category/electronics']}>
        <Routes>
          <Route
            path="/category/:category"
            element={<CategoryProduct />}
          />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });
});
