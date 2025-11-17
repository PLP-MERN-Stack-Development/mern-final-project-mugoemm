import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { cart } = useCart();
  const [user, setUser] = useState(null);
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition">
            ShopHub
          </Link>
          
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="hover:text-blue-200 transition">
              Home
            </Link>
            <Link to="/products" className="hover:text-blue-200 transition">
              Products
            </Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="hover:text-blue-200 transition">
                Admin
              </Link>
            )}
            {user ? (
              <Link to="/profile" className="hover:text-blue-200 transition flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile
              </Link>
            ) : (
              <Link to="/login" className="hover:text-blue-200 transition">
                Login
              </Link>
            )}
          </div>

          <Link 
            to="/cart" 
            className="relative flex items-center bg-blue-700 px-4 py-2 rounded-lg hover:bg-blue-800 transition"
            aria-label={`Shopping cart with ${cartItemsCount} items`}
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
            {cartItemsCount > 0 && (
              <span 
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center"
                aria-label={`${cartItemsCount} items in cart`}
              >
                {cartItemsCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden pb-4 flex space-x-4">
          <Link to="/" className="hover:text-blue-200 transition text-sm">
            Home
          </Link>
          <Link to="/products" className="hover:text-blue-200 transition text-sm">
            Products
          </Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="hover:text-blue-200 transition text-sm">
              Admin
            </Link>
          )}
          {user ? (
            <Link to="/profile" className="hover:text-blue-200 transition text-sm">
              Profile
            </Link>
          ) : (
            <Link to="/login" className="hover:text-blue-200 transition text-sm">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
