# E-commerce Platform - MERN Stack Final Project

Full-stack e-commerce platform built with React, Node.js, Express, and MongoDB. Features secure authentication, product management, shopping cart, and admin dashboard.

## 🌐 Live Demo

- **Frontend:** https://frontend-moaasl5zo-bernard-mugos-projects.vercel.app
- **Backend API:** https://mern-final-project-mugoemm.onrender.com
- **Admin Panel:** https://frontend-moaasl5zo-bernard-mugos-projects.vercel.app/admin

## 📝 Assignment Requirements

This project fulfills the MERN Stack Development final project requirements:
- ✅ Full MERN stack implementation (MongoDB, Express, React, Node.js)
- ✅ RESTful API with CRUD operations
- ✅ User authentication and authorization (JWT)
- ✅ Responsive frontend with React and Tailwind CSS
- ✅ Database integration with MongoDB Atlas
- ✅ Deployment on cloud platforms (Render + Vercel)
- ✅ Security best practices implemented
- ✅ Complete documentation

## 🛠️ Tech Stack

**Frontend:**
- React 19.2 + Vite 7.2
- Tailwind CSS 4.1
- React Router DOM
- Context API for state management

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Socket.io for real-time updates

**Security:**
- Helmet (security headers)
- Rate limiting (100 req/15min)
- Input validation (express-validator)
- NoSQL injection prevention
- Email verification
- CORS configuration

## 📦 Local Development

### Prerequisites
- Node.js 18+ and npm 9+
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and secrets
npm run dev  # Runs on http://localhost:5000
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev  # Runs on http://localhost:5173
```

## 🌟 Features

✅ User authentication (register, login, logout)
✅ Email verification system
✅ Password reset flow
✅ Product browsing with search/filter
✅ Shopping cart (Context API + localStorage)
✅ Order management
✅ Admin dashboard for product CRUD
✅ Role-based access control
✅ Real-time notifications (Socket.io)
✅ Responsive design
✅ Comprehensive security measures

## 📁 Project Structure

```
├── backend/
│   ├── middleware/       # Auth, security, validation, logging
│   ├── models/           # User, Product, Order schemas
│   ├── routes/           # API endpoints
│   ├── utils/            # Email service
│   ├── server.js         # Main application
│   ├── Dockerfile        # Docker configuration
│   └── render.yaml       # Render deployment config
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Route pages
│   │   ├── context/      # Global state
│   │   └── utils/        # API helpers
│   ├── vercel.json       # Vercel configuration
│   └── vite.config.js    # Build configuration
└── docs/
    ├── DEPLOYMENT_RENDER_VERCEL.md  # Detailed deployment guide
    ├── DEPLOYMENT_QUICK_START.md    # Quick deployment checklist
    ├── DEPLOYMENT.md                # Alternative deployment options
    └── SECURITY.md                  # Security documentation
```

## 🔐 Environment Variables

### Backend (.env)
```bash
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
COOKIE_SECRET=your_cookie_secret
FRONTEND_URL=http://localhost:5173

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
```

Generate secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend (.env.local)
```bash
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Deployment Options

### Option 1: Render + Vercel (Recommended)
Fast deployment with free tiers available.
- **Guide:** [DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md)

### Option 2: Docker
Containerized deployment for any platform.
- **Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)

### Option 3: AWS / Heroku
Traditional cloud deployment.
- **Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Security audit
npm audit

# Fix vulnerabilities
npm audit fix
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password

### Products
- `GET /api/products` - Get all products (paginated)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart & Orders
- `POST /api/cart` - Add to cart
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order

## 🔒 Security Features

- **Authentication:** JWT with httpOnly cookies
- **Authorization:** Role-based access control (RBAC)
- **Rate Limiting:** 100 requests/15min, 5 login attempts/15min
- **Input Validation:** All inputs validated with express-validator
- **NoSQL Injection:** Sanitization middleware
- **XSS Protection:** Security headers with Helmet
- **CSRF Protection:** SameSite cookies
- **Email Verification:** Required before sensitive actions
- **Logging:** Winston with daily log rotation

See [SECURITY.md](./SECURITY.md) for complete security documentation.

## 🚀 Deployment

This project is deployed using:
- **Frontend:** Vercel (https://frontend-moaasl5zo-bernard-mugos-projects.vercel.app)
- **Backend:** Render (https://mern-final-project-mugoemm.onrender.com)
- **Database:** MongoDB Atlas

### Deployment Guides:
- [Quick Start Guide](./DEPLOYMENT_QUICK_START.md) - 5-minute deployment
- [Complete Guide](./DEPLOYMENT_RENDER_VERCEL.md) - Detailed instructions
- [Alternative Options](./DEPLOYMENT.md) - Docker, AWS, Heroku

## 📄 License

See [LICENSE](./LICENSE)

## 👨‍💻 Author

**Bernard Mugo**
- GitHub: [@mugoemm](https://github.com/mugoemm)
- Project: [mern-final-project-mugoemm](https://github.com/PLP-MERN-Stack-Development/mern-final-project-mugoemm)

## 🎓 Course Information

This project was developed as part of the **PLP MERN Stack Development** course final assignment.

**Course Requirements Met:**
- Full-stack MERN application
- User authentication and authorization
- RESTful API design
- Database design and implementation
- Frontend routing and state management
- Cloud deployment
- Security best practices
- Complete documentation

## 📧 Support

For issues and questions, please open a GitHub issue.

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Manual](https://docs.mongodb.com)
- [Vite Guide](https://vitejs.dev/guide)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

Built with ❤️ using React, Node.js, and MongoDB

