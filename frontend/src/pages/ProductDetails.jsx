import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);

  // Mock products data (same as ProductList)
  const mockProducts = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      price: 99.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop',
      category: 'Electronics',
      description: 'Experience premium sound quality with our top-of-the-line wireless headphones. Features active noise cancellation, 30-hour battery life, and premium comfort padding. Perfect for music lovers and professionals alike.',
      features: ['Active Noise Cancellation', '30-hour battery life', 'Bluetooth 5.0', 'Premium comfort padding', 'Foldable design'],
      stock: 25
    },
    {
      id: 2,
      name: 'Smart Watch Series 5',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
      category: 'Electronics',
      description: 'Stay connected and track your fitness goals with our advanced smartwatch. Features heart rate monitoring, GPS tracking, water resistance, and seamless smartphone integration.',
      features: ['Heart rate monitoring', 'GPS tracking', 'Water resistant', 'Sleep tracking', 'Notifications'],
      stock: 15
    },
    {
      id: 3,
      name: 'Leather Laptop Bag',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
      category: 'Accessories',
      description: 'Professional leather laptop bag with multiple compartments for organization. Fits laptops up to 15 inches. Durable construction with adjustable shoulder strap.',
      features: ['Premium leather', 'Fits 15" laptops', 'Multiple compartments', 'Adjustable strap', 'Water resistant'],
      stock: 30
    },
    {
      id: 4,
      name: 'Portable Bluetooth Speaker',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&h=800&fit=crop',
      category: 'Electronics',
      description: 'Compact yet powerful Bluetooth speaker with 360-degree sound. Perfect for outdoor adventures with waterproof design and 12-hour battery life.',
      features: ['360-degree sound', 'Waterproof', '12-hour battery', 'Bluetooth 5.0', 'Built-in microphone'],
      stock: 40
    },
    {
      id: 5,
      name: 'Designer Sunglasses',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop',
      category: 'Accessories',
      description: 'Premium designer sunglasses with UV400 protection. Modern design with lightweight frame and polarized lenses for maximum comfort and protection.',
      features: ['UV400 protection', 'Polarized lenses', 'Lightweight frame', 'Designer style', 'Includes case'],
      stock: 20
    },
    {
      id: 6,
      name: 'Wireless Gaming Mouse',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=800&fit=crop',
      category: 'Electronics',
      description: 'High-precision wireless gaming mouse with customizable RGB lighting. Features adjustable DPI, programmable buttons, and ergonomic design for extended gaming sessions.',
      features: ['Adjustable DPI', 'RGB lighting', 'Programmable buttons', 'Wireless', 'Ergonomic design'],
      stock: 35
    },
    {
      id: 7,
      name: 'Minimalist Backpack',
      price: 69.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=800&fit=crop',
      category: 'Accessories',
      description: 'Sleek minimalist backpack with water-resistant material. Features multiple compartments, padded laptop sleeve, and comfortable shoulder straps.',
      features: ['Water-resistant', 'Laptop sleeve', 'Multiple compartments', 'Comfortable straps', 'Modern design'],
      stock: 28
    },
    {
      id: 8,
      name: 'Mechanical Keyboard',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=800&fit=crop',
      category: 'Electronics',
      description: 'Premium mechanical keyboard with Cherry MX switches. Features customizable RGB backlighting, aluminum frame, and N-key rollover for gaming and productivity.',
      features: ['Cherry MX switches', 'RGB backlighting', 'Aluminum frame', 'N-key rollover', 'Detachable cable'],
      stock: 18
    },
    {
      id: 9,
      name: 'Fitness Tracker Band',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&h=800&fit=crop',
      category: 'Electronics',
      description: 'Affordable fitness tracker with step counting, heart rate monitoring, and sleep tracking. Water-resistant design with 7-day battery life.',
      features: ['Step counter', 'Heart rate monitor', 'Sleep tracking', 'Water-resistant', '7-day battery'],
      stock: 50
    }
  ];

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In real app: const response = await fetch(`/api/products/${id}`);
      // const data = await response.json();
      const foundProduct = mockProducts.find(p => p.id === parseInt(id));
      setProduct(foundProduct);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-gray-600">
          <button onClick={() => navigate('/')} className="hover:text-blue-600">Home</button>
          <span className="mx-2">/</span>
          <button onClick={() => navigate('/products')} className="hover:text-blue-600">Products</button>
          <span className="mx-2">/</span>
          <span className="text-gray-800">{product.name}</span>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-w-lg rounded-lg shadow-md"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <span className="text-sm text-blue-600 font-semibold uppercase mb-2">
                {product.category}
              </span>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
              
              <div className="flex items-center mb-6">
                <span className="text-4xl font-bold text-blue-600">${product.price}</span>
                <span className="ml-4 text-green-600 font-semibold">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed">{product.description}</p>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Key Features:</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">Quantity:</label>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800 font-bold py-2 px-4 rounded-lg transition"
                  >
                    -
                  </button>
                  <span className="text-2xl font-semibold text-gray-800 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800 font-bold py-2 px-4 rounded-lg transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition text-lg"
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => navigate('/cart')}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition"
                >
                  Go to Cart
                </button>
              </div>

              {/* Success Message */}
              {addedToCart && (
                <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                  ✓ Added to cart successfully!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={() => navigate('/products')}
            className="text-blue-600 hover:text-blue-700 font-semibold flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
