import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Products from './Pages/Products/Products';
import CategoryProduct from './Pages/CategoryProducts/CategoryProducts';
import About from './Pages/About/About';
import Contact from './Pages/Contact/Contact';
import Footer from './components/Footer/Footer';
import Cart from './components/ProductList/Cart';
import Navbar from './components/Navbar/Navbar';
import Login from './Auth/pages/Login';
import Register from './Auth/pages/Register';
import ProductDetail from './Pages/Products/ProductDetail';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/products"
          element={<Products />}
        />
        <Route
          path="/products/:id"
          element={<ProductDetail />}
        />
        <Route
          path="/category/:category"
          element={<CategoryProduct />}
        />
        <Route
          path="/about"
          element={<About />}
        />
        <Route
          path="/contact"
          element={<Contact />}
        />
        <Route
          path="/cart"
          element={<Cart />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
