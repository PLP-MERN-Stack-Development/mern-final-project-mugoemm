# Component Usage Guide

## Quick Reference

### CartContext Usage

Import and use the cart context in any component:

```jsx
import { useCart } from '../context/CartContext';

function MyComponent() {
  const { cart, addToCart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  
  // Add product to cart
  addToCart({ id: 1, name: "Product", price: 99.99, quantity: 1, image: "url", stock: 10 });
  
  // Remove from cart
  removeFromCart(productId);
  
  // Update quantity
  updateQuantity(productId, newQuantity);
  
  // Get total
  const total = getCartTotal();
}
```

### Navigation Examples

```jsx
import { Link, useNavigate } from 'react-router-dom';

// Using Link component
<Link to="/products">View Products</Link>
<Link to={`/products/${productId}`}>View Details</Link>

// Using navigate programmatically
const navigate = useNavigate();
navigate('/cart');
navigate(-1); // Go back
```

### Tailwind CSS Classes Reference

**Common Patterns Used:**

**Buttons:**
```jsx
// Primary button
className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"

// Secondary button
className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg transition"

// Danger button
className="text-red-600 hover:text-red-700 font-semibold"
```

**Cards:**
```jsx
className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
```

**Grid Layouts:**
```jsx
// Products grid
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"

// Two column layout
className="grid grid-cols-1 lg:grid-cols-2 gap-8"
```

**Containers:**
```jsx
className="container mx-auto px-4"
```

**Text:**
```jsx
// Headings
className="text-4xl font-bold text-gray-800"
className="text-2xl font-semibold text-gray-700"

// Body text
className="text-gray-600"
className="text-sm text-gray-500"
```

## Component Props

### Navbar
No props needed - uses CartContext internally

### Footer
No props needed

### HomePage
No props needed - self-contained with featured products

### ProductList
Uses URL search params for search functionality:
- Access via: `/products?search=keyword`

### ProductDetails
Uses URL params:
- Access via: `/products/:id`

### Cart
No props needed - uses CartContext

### AdminPanel
No props needed - manages internal state

## State Management

**Local State (useState):**
Used for component-specific data like form inputs, loading states, etc.

**Global State (Context API):**
Used for shopping cart that needs to be accessed across multiple components.

## API Integration Notes

Replace mock data with actual API calls:

```jsx
// Example API call
const fetchProducts = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/products');
    const data = await response.json();
    setProducts(data);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};
```

## Adding New Routes

1. Create component in `/src/pages/`
2. Import in `App.jsx`
3. Add route in the Routes component:

```jsx
<Route path="/new-page" element={<NewPage />} />
```

## Styling Tips

1. Use Tailwind's responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
2. Hover states: `hover:bg-blue-700`
3. Focus states: `focus:outline-none focus:ring-2`
4. Transitions: Add `transition` class for smooth animations
5. Shadows: `shadow-md`, `shadow-lg` for depth

## Common Issues & Solutions

**Issue:** Cart not persisting
**Solution:** CartContext uses localStorage automatically

**Issue:** Images not loading
**Solution:** Use valid image URLs (currently using Unsplash)

**Issue:** Navigation not working
**Solution:** Ensure BrowserRouter wraps the entire app

**Issue:** Tailwind classes not working
**Solution:** Verify `@import "tailwindcss"` is in index.css

## Development Workflow

1. Start dev server: `npm run dev`
2. Edit components in `src/`
3. Changes reflect immediately (HMR)
4. Check browser console for errors
5. Test on different screen sizes

## Production Build

```bash
npm run build
npm run preview
```

Build output goes to `dist/` folder.
