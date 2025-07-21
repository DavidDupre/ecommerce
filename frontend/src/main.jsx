import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ScrollToTop from 'react-scroll-to-top';
import { CartProvider } from './context/CartContext';
import AuthProvider from './Auth/context/AuthProvider';
import { BrowserRouter } from 'react-router-dom';
import { DataProvider } from './context/DataContext';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <DataProvider>
        <CartProvider>
          <App />
          <ScrollToTop
            color="white"
            smooth
            style={{
              backgroundColor: '#fa2d37',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        </CartProvider>
      </DataProvider>
    </AuthProvider>
  </BrowserRouter>,
);
