# Security Implementation Guide

## Overview

This document outlines all security measures implemented in the e-commerce platform.

## Backend Security

### 1. Authentication & Authorization

#### JWT Implementation
- **Token Expiration**: 7 days (configurable)
- **Secure Storage**: HttpOnly cookies + Authorization header
- **Token Refresh**: Implemented via `/api/auth/refresh` endpoint
- **Password Requirements**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character

#### Role-Based Access Control (RBAC)
```javascript
// Middleware usage
router.post('/products', protect, restrictTo('admin'), createProduct);
```

**Roles**:
- `user`: Standard user access
- `admin`: Full system access

#### Password Security
- **Hashing**: bcrypt with salt rounds = 10
- **Reset Tokens**: Cryptographically secure random tokens (32 bytes)
- **Token Expiration**: 1 hour for password reset, 24 hours for email verification

### 2. Input Validation & Sanitization

#### Express Validator
All inputs are validated before processing:

```javascript
// Example validation
validateRegister: [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/regex/),
  handleValidationErrors
]
```

#### NoSQL Injection Prevention
- **mongo-sanitize**: Removes prohibited characters from user input
- **Parameterized Queries**: Always use Mongoose queries (never string concatenation)

```javascript
// Safe
User.findOne({ email: req.body.email });

// Unsafe (DON'T DO THIS)
User.findOne({ $where: req.body.query });
```

### 3. Rate Limiting

#### API Rate Limits
- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 5 login attempts per 15 minutes per IP
- **Strict Endpoints**: 10 requests per hour per IP

```javascript
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.'
});
```

### 4. Security Headers (Helmet)

Implemented headers:
- `X-Frame-Options`: SAMEORIGIN (prevent clickjacking)
- `X-Content-Type-Options`: nosniff
- `X-XSS-Protection`: 1; mode=block
- `Strict-Transport-Security`: max-age=31536000
- `Content-Security-Policy`: Configured for safe resource loading

### 5. CORS Configuration

```javascript
const corsOptions = {
  origin: [allowed origins],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
```

### 6. Cookie Security

```javascript
const cookieOptions = {
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  httpOnly: true,  // Prevents XSS attacks
  secure: process.env.NODE_ENV === 'production',  // HTTPS only
  sameSite: 'strict'  // Prevents CSRF attacks
};
```

### 7. Parameter Pollution Prevention

Using `hpp` middleware to prevent HTTP Parameter Pollution attacks.

Whitelisted parameters: `['price', 'category', 'sort', 'limit', 'page']`

### 8. Email Security

#### Email Verification
- Users must verify email before certain actions
- Cryptographically secure tokens (SHA-256 hashed)
- 24-hour expiration

#### Password Reset
- Secure token generation
- 1-hour expiration
- One-time use tokens
- Email confirmation required

### 9. Logging & Monitoring

#### Winston Logger
- **Error logs**: Stored in `logs/error.log`
- **Combined logs**: Stored in `logs/combined.log`
- **Console logging**: Development only
- **Log rotation**: 5MB max file size, 5 files retained

#### Request Logging
Every request is logged with:
- Method, URL, status code
- Response time
- IP address
- User agent

### 10. Error Handling

```javascript
// Production: Don't leak stack traces
if (process.env.NODE_ENV === 'production') {
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal Server Error' : message
  });
} else {
  res.status(statusCode).json({
    error: message,
    stack: err.stack  // Only in development
  });
}
```

## Frontend Security

### 1. XSS Prevention

#### React's Built-in Protection
React escapes all values by default, but be careful with:
- `dangerouslySetInnerHTML` (avoid if possible)
- User-generated content
- URL parameters

#### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';">
```

### 2. Token Storage

**Implemented Strategy**:
- JWT stored in httpOnly cookie (primary)
- Backup in localStorage (for mobile apps)
- Auto-refresh on expiration

**Best Practice**:
```javascript
// Don't store sensitive data in localStorage
// Use httpOnly cookies when possible
```

### 3. CSRF Protection

- **SameSite cookies**: 'strict' mode
- **CORS**: Restricted origins
- **Custom headers**: Require 'Content-Type' header

### 4. Sensitive Data Handling

```javascript
// Never log sensitive information
console.log({ email: user.email });  // OK
console.log({ password: user.password });  // NEVER!

// Remove sensitive fields before sending to frontend
const userResponse = {
  id: user._id,
  name: user.name,
  email: user.email,
  // password is excluded
};
```

### 5. Secure API Calls

```javascript
// Always use HTTPS in production
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.your-domain.com'
  : 'http://localhost:5000';

// Include credentials
fetch(url, {
  credentials: 'include',  // Send cookies
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## Database Security

### 1. MongoDB Security

#### Connection String
```javascript
// Use environment variables
const MONGO_URI = process.env.MONGO_URI;

// Enable SSL in production
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: process.env.NODE_ENV === 'production',
  sslValidate: true
};
```

#### Database User Permissions
- Create separate users for different environments
- Use principle of least privilege
- Enable MongoDB authentication
- Restrict network access (IP whitelist)

### 2. Data Encryption

#### At Rest
- Enable MongoDB encryption at rest (Atlas supports this)
- Encrypt backup files

#### In Transit
- Always use TLS/SSL
- Minimum TLS version: 1.2

## Production Security Checklist

### Pre-Deployment
- [ ] Change all default secrets and keys
- [ ] Enable HTTPS
- [ ] Update CORS origins to production domain
- [ ] Enable rate limiting
- [ ] Set up error tracking (Sentry)
- [ ] Configure firewall rules
- [ ] Set up automated backups
- [ ] Enable database authentication
- [ ] Review and remove development/debug code
- [ ] Disable verbose error messages
- [ ] Set NODE_ENV=production
- [ ] Enable security headers
- [ ] Configure CSP
- [ ] Set up monitoring and alerts
- [ ] Implement DDoS protection (Cloudflare)
- [ ] Set up WAF (Web Application Firewall)

### Post-Deployment
- [ ] Run security audit (npm audit, Snyk)
- [ ] Perform penetration testing
- [ ] Test all authentication flows
- [ ] Verify rate limiting works
- [ ] Test CORS configuration
- [ ] Monitor logs for suspicious activity
- [ ] Set up automated security scanning
- [ ] Document security procedures
- [ ] Create incident response plan

## Security Testing

### 1. Automated Testing

```bash
# Security audit
npm audit

# Fix vulnerabilities
npm audit fix

# Using Snyk
npm install -g snyk
snyk test
snyk monitor
```

### 2. Manual Testing

#### Test Authentication
```bash
# Test rate limiting
for i in {1..10}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
done

# Should block after 5 attempts
```

#### Test SQL Injection (NoSQL)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":{"$ne":null},"password":{"$ne":null}}'

# Should be blocked by sanitization
```

#### Test XSS
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"<script>alert('XSS')</script>","price":10}'

# Should be sanitized
```

## Incident Response

### 1. Security Breach Procedure

1. **Immediate Actions**:
   - Isolate affected systems
   - Revoke compromised credentials
   - Enable enhanced logging
   - Notify stakeholders

2. **Investigation**:
   - Review logs
   - Identify entry point
   - Assess damage
   - Document findings

3. **Remediation**:
   - Patch vulnerabilities
   - Reset all secrets
   - Force password reset for affected users
   - Deploy fixes

4. **Post-Incident**:
   - Update security measures
   - Document lessons learned
   - Improve monitoring
   - Train team

### 2. Common Vulnerabilities

#### SQL/NoSQL Injection
- **Prevention**: Input validation, parameterized queries
- **Detection**: Monitor for unusual database queries

#### XSS (Cross-Site Scripting)
- **Prevention**: Input sanitization, CSP headers
- **Detection**: Monitor for suspicious JavaScript execution

#### CSRF (Cross-Site Request Forgery)
- **Prevention**: SameSite cookies, CSRF tokens
- **Detection**: Monitor for unauthorized state changes

#### Brute Force
- **Prevention**: Rate limiting, account lockout
- **Detection**: Monitor failed login attempts

## Updates & Maintenance

### Regular Tasks

**Weekly**:
- Review security logs
- Check for suspicious activity
- Monitor failed login attempts

**Monthly**:
- Update dependencies (`npm update`)
- Review and rotate secrets
- Security audit (`npm audit`)
- Review access logs

**Quarterly**:
- Comprehensive security review
- Penetration testing
- Update security documentation
- Review and update incident response plan

### Dependency Management

```bash
# Check for outdated packages
npm outdated

# Update to latest
npm update

# Check for security issues
npm audit

# Auto-fix
npm audit fix

# For breaking changes
npm audit fix --force
```

## Compliance

### GDPR Compliance
- User data export functionality
- Right to be forgotten (account deletion)
- Clear privacy policy
- Cookie consent
- Data encryption
- Breach notification procedures

### PCI DSS (if handling payments)
- Never store credit card data
- Use certified payment processors (Stripe, PayPal)
- Implement strong access controls
- Regularly test security systems

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
- [Mozilla Web Security Guidelines](https://infosec.mozilla.org/guidelines/web_security)
- [Helmet.js Documentation](https://helmetjs.github.io/)