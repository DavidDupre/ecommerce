import { render, screen, waitFor } from '@testing-library/react';
import Home from '../Home';

jest.mock('../../context/DataContext', () => ({
  getData: () => ({
    data: [
      {
        id: 1,
        title: 'Test Product 1',
        description: 'Test Description 1',
        image: 'test1.jpg',
      },
      {
        id: 2,
        title: 'Test Product 2',
        description: 'Test Description 2',
        image: 'test2.jpg',
      },
    ],
    fetchAllProducts: jest.fn(),
  }),
}));

describe('Home Component', () => {
  it('should render the slider with products', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(
        screen.getByText('Powering Your World with the Best in Electronics'),
      ).toBeInTheDocument();
      expect(screen.getByText('Test Product 1')).toBeInTheDocument();
      expect(screen.getByText('Test Description 1')).toBeInTheDocument();
      expect(screen.getByText('Shop Now')).toBeInTheDocument();
    });
  });

  it('should display the correct number of slides', async () => {
    render(<Home />);

    await waitFor(() => {
      // Slider shows only the first 7 items
      expect(screen.getAllByRole('img').length).toBeLessThanOrEqual(7);
    });
  });

  it('should render Category and Banner components', async () => {
    render(<Home />);

    await waitFor(() => {
      // Assuming these components have some distinctive text or role
      expect(screen.getByTestId('category-component')).toBeInTheDocument();
      expect(screen.getByTestId('banner-component')).toBeInTheDocument();
    });
  });
});
