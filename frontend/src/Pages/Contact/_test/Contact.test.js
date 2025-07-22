import { render, screen, fireEvent } from '@testing-library/react';
import Contact from './Contact';

describe('Contact Component', () => {
  it('should render contact information and form', () => {
    render(<Contact />);

    expect(screen.getByText('Póngase en contacto con OnBoarding')).toBeInTheDocument();
    expect(screen.getByText('Información de contacto')).toBeInTheDocument();
    expect(screen.getByText('d.aldanadupre@gmail.com')).toBeInTheDocument();
    expect(screen.getByText('(123) 456-7890')).toBeInTheDocument();

    // Form elements
    expect(screen.getByPlaceholderText('Nombre completo...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('correo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Escriba aqui sus Comentarios...')).toBeInTheDocument();
    expect(screen.getByText('Enviar mensaje 🚀')).toBeInTheDocument();
  });

  it('should update form fields when user types', () => {
    render(<Contact />);

    const nameInput = screen.getByPlaceholderText('Nombre completo...');
    const emailInput = screen.getByPlaceholderText('correo');
    const commentsInput = screen.getByPlaceholderText('Escriba aqui sus Comentarios...');

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(commentsInput, { target: { value: 'Test message' } });

    expect(nameInput.value).toBe('John Doe');
    expect(emailInput.value).toBe('john@example.com');
    expect(commentsInput.value).toBe('Test message');
  });

  it('should submit the form', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<Contact />);

    const submitButton = screen.getByText('Enviar mensaje 🚀');
    fireEvent.click(submitButton);

    // Verify form submission (you might want to mock an API call here)
    expect(consoleSpy).toHaveBeenCalled(); // Replace with actual submission test
    consoleSpy.mockRestore();
  });
});
