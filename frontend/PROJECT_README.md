# E-Commerce Platform Frontend

A modern, responsive e-commerce platform built with React, Vite, and Tailwind CSS.

## Features

### 1. **HomePage**
- Hero banner with search functionality
- Featured products grid (responsive)
- Footer with site links
- Feature highlights section

### 2. **ProductList**
- Fetches and displays products from API
- Responsive grid layout
- Sorting options (by name, price low-to-high, price high-to-low)
- Category filtering
- Search functionality
- Product cards with image, name, price, and "View" button

### 3. **ProductDetails**
- Detailed product information
- Large product image
- Product description and features list
- Quantity selector
- "Add to Cart" button with stock validation
- Breadcrumb navigation

### 4. **Cart**
- Display all cart items
- Quantity controls for each item
- Remove item functionality
- Real-time total calculation
- Order summary sidebar
- "Proceed to Checkout" button
- Empty cart state with call-to-action

### 5. **AdminPanel**
- Add new products form with fields:
  - Product name
  - Description
  - Price
  - Image URL
  - Category
- Product list table with edit/delete actions
- Inline editing functionality
- Product count display

### 6. **Navigation & Layout**
- Responsive Navbar with cart badge showing item count
- Footer with links and contact information
- Mobile-friendly navigation
- Consistent layout across all pages

## Tech Stack

- **React 19.2.0** - UI library
- **Vite 7.2.2** - Build tool and dev server
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Context API** - State management for shopping cart

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Navigation bar with cart badge
│   │   └── Footer.jsx          # Site footer
│   ├── pages/
│   │   ├── HomePage.jsx        # Landing page with hero and featured products
│   │   ├── ProductList.jsx     # All products with filtering/sorting
│   │   ├── ProductDetails.jsx  # Individual product details
│   │   ├── Cart.jsx            # Shopping cart page
│   │   └── AdminPanel.jsx      # Admin product management
│   ├── context/
│   │   └── CartContext.jsx     # Shopping cart state management
│   ├── App.jsx                 # Main app component with routing
│   ├── App.css                 # App styles
│   ├── index.css               # Global styles with Tailwind
│   └── main.jsx                # App entry point
├── package.json
├── vite.config.js
└── README.md
```

## Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## Features in Detail

### Cart Context (State Management)
- Persistent cart using localStorage
- Add to cart functionality
- Update item quantities
- Remove items from cart
- Calculate cart total
- Get cart items count

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Mobile-friendly navigation
- Optimized for all screen sizes

### User Experience
- Loading states for async operations
- Empty state handling
- Success/error notifications
- Intuitive navigation
- Breadcrumb trails
- Search functionality

## Mock Data

The application uses placeholder data for products. In a production environment, these would be replaced with actual API calls to:
- `GET /api/products` - Fetch all products
- `GET /api/products/:id` - Fetch single product
- `POST /api/products` - Create new product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

## Routes

- `/` - Home page
- `/products` - Product listing
- `/products/:id` - Product details
- `/cart` - Shopping cart
- `/admin` - Admin panel

## Styling

All components are styled using Tailwind CSS utility classes. The design features:
- Blue primary color scheme
- Clean, modern interface
- Smooth transitions and hover effects
- Consistent spacing and typography
- Shadow effects for depth

## Future Enhancements

- User authentication and login
- Real backend API integration
- Payment gateway integration
- Order history
- Wishlist functionality
- Product reviews and ratings
- Advanced search with filters
- Image upload for products
- Pagination for product lists
- Product variants (size, color)

## License

MIT
