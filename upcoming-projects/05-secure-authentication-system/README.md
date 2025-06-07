# 🔐 Secure Authentication System

> Enterprise-grade authentication and authorization platform with multi-factor authentication, OAuth integrations, and advanced security features.

## 📊 Project Overview

- **Status**: ✅ Completed
- **Timeline**: Q2 2024 - June 2025 (4-5 months)
- **Complexity**: ⭐⭐⭐⭐ Advanced
- **Type**: Security-First Backend Service

## 🎯 Project Description

Build a comprehensive authentication system that handles user registration, login, multi-factor authentication, OAuth integrations, and role-based access control. Designed to be scalable, secure, and easily integrable into other applications.

## ✨ Key Features

### Authentication Core
- **Email/Password Authentication**: Secure registration and login
- **Multi-Factor Authentication (MFA)**: TOTP, SMS, Email codes
- **OAuth Integration**: Google, GitHub, Facebook, Discord
- **Passwordless Login**: Magic links and email authentication
- **Biometric Support**: WebAuthn/FIDO2 integration
- **Session Management**: Secure token handling and refresh

### Security Features
- **Password Security**: Argon2 hashing with salt
- **Rate Limiting**: Brute force protection
- **Device Tracking**: Login location and device monitoring
- **Suspicious Activity Detection**: AI-powered fraud detection
- **Account Recovery**: Secure password reset flows
- **Audit Logging**: Comprehensive security event tracking

### User Management
- **Profile Management**: User data and preferences
- **Role-Based Access Control (RBAC)**: Granular permissions
- **Organization Support**: Multi-tenant architecture
- **User Verification**: Email and phone verification
- **Account Linking**: Connect multiple OAuth accounts
- **Privacy Controls**: GDPR compliance features

### Developer Features
- **RESTful API**: Complete authentication endpoints
- **SDK Libraries**: JavaScript, Python, Go client libraries
- **Webhook Support**: Real-time event notifications
- **Admin Dashboard**: User management interface
- **API Documentation**: Interactive Swagger docs
- **Integration Guides**: Step-by-step implementation

## 🛠 Technical Stack

### Backend Core
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis for sessions and rate limiting
- **Queue**: Bull Queue for background jobs

### Security & Authentication
- **Password Hashing**: Argon2
- **JWT**: Access and refresh tokens
- **OAuth**: Passport.js strategies
- **MFA**: Speakeasy (TOTP) + Twilio (SMS)
- **WebAuthn**: @simplewebauthn/server
- **Encryption**: Node.js crypto module

### Infrastructure
- **API Gateway**: NGINX with rate limiting
- **Monitoring**: Winston + Morgan logging
- **Health Checks**: Custom health monitoring
- **Email**: SendGrid for transactional emails
- **SMS**: Twilio for MFA and notifications

### DevOps
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Deployment**: AWS ECS or Railway
- **Monitoring**: DataDog or New Relic
- **Security Scanning**: Snyk + SonarQube

## 🗄 Database Schema

```javascript
// User Schema
const userSchema = new mongoose.Schema({
  id: { type: String, default: () => nanoid(), unique: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  emailVerified: { type: Boolean, default: false },
  phone: { type: String, sparse: true },
  phoneVerified: { type: Boolean, default: false },
  
  // Password authentication
  passwordHash: { type: String, select: false },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  
  // Profile information
  profile: {
    firstName: String,
    lastName: String,
    avatar: String,
    bio: String,
    timezone: { type: String, default: 'UTC' },
    locale: { type: String, default: 'en' }
  },
  
  // Security settings
  security: {
    mfaEnabled: { type: Boolean, default: false },
    mfaSecret: { type: String, select: false },
    backupCodes: [{ type: String, select: false }],
    trustedDevices: [{
      deviceId: String,
      name: String,
      lastUsed: Date,
      userAgent: String,
      createdAt: { type: Date, default: Date.now }
    }]
  },
  
  // OAuth connections
  connections: [{
    provider: { type: String, enum: ['google', 'github', 'facebook', 'discord'] },
    providerId: String,
    email: String,
    profile: Object,
    connectedAt: { type: Date, default: Date.now }
  }],
  
  // RBAC
  roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }],
  permissions: [String],
  
  // Metadata
  status: { type: String, enum: ['active', 'suspended', 'pending'], default: 'pending' },
  lastLoginAt: Date,
  lastActiveAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Role Schema
const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  permissions: [String],
  isDefault: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Session Schema
const sessionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  deviceId: String,
  refreshToken: { type: String, required: true, unique: true },
  userAgent: String,
  ipAddress: String,
  location: {
    country: String,
    city: String,
    coordinates: [Number]
  },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Audit Log Schema
const auditLogSchema = new mongoose.Schema({
  userId: String,
  action: { type: String, required: true },
  resource: String,
  details: Object,
  ipAddress: String,
  userAgent: String,
  success: { type: Boolean, required: true },
  timestamp: { type: Date, default: Date.now }
});
```

## 🔌 API Design

### Authentication Endpoints

```typescript
// Registration & Login
POST   /api/auth/register           // Create new account
POST   /api/auth/login              // Email/password login
POST   /api/auth/logout             // Logout current session
POST   /api/auth/logout-all         // Logout all sessions
POST   /api/auth/refresh            // Refresh access token

// Password Management
POST   /api/auth/forgot-password    // Request password reset
POST   /api/auth/reset-password     // Reset password with token
PUT    /api/auth/change-password    // Change password (authenticated)

// Email & Phone Verification
POST   /api/auth/verify-email       // Verify email address
POST   /api/auth/resend-verification // Resend verification email
POST   /api/auth/verify-phone       // Verify phone number
POST   /api/auth/send-phone-code    // Send phone verification code

// Multi-Factor Authentication
POST   /api/auth/mfa/setup          // Set up MFA
POST   /api/auth/mfa/verify         // Verify MFA token
POST   /api/auth/mfa/backup-codes   // Generate backup codes
DELETE /api/auth/mfa/disable        // Disable MFA

// OAuth
GET    /api/auth/oauth/:provider    // OAuth redirect
POST   /api/auth/oauth/callback     // OAuth callback handler
DELETE /api/auth/oauth/:provider    // Disconnect OAuth account

// WebAuthn
POST   /api/auth/webauthn/register  // Register authenticator
POST   /api/auth/webauthn/login     // Authenticate with WebAuthn
GET    /api/auth/webauthn/credentials // List registered credentials
DELETE /api/auth/webauthn/:id       // Remove credential
```

### User Management API

```typescript
// Profile Management
GET    /api/users/me                // Get current user profile
PUT    /api/users/me                // Update profile
DELETE /api/users/me                // Delete account
GET    /api/users/me/sessions       // List active sessions
DELETE /api/users/me/sessions/:id   // Revoke specific session

// Admin Endpoints
GET    /api/admin/users             // List all users (paginated)
GET    /api/admin/users/:id         // Get user details
PUT    /api/admin/users/:id/status  // Update user status
POST   /api/admin/users/:id/roles   // Assign roles
GET    /api/admin/audit-logs        // Security audit logs
GET    /api/admin/analytics         // Authentication analytics

// Role & Permission Management
GET    /api/roles                   // List available roles
POST   /api/roles                   // Create new role
PUT    /api/roles/:id               // Update role
DELETE /api/roles/:id               // Delete role
GET    /api/permissions             // List all permissions
```

## 🎨 Admin Dashboard UI

### Dashboard Overview
- **User Analytics**: Registration trends, active users, login statistics
- **Security Metrics**: Failed login attempts, MFA adoption, suspicious activity
- **System Health**: API response times, error rates, uptime status
- **Recent Activity**: Latest user registrations, logins, security events

### User Management Interface
- **User Search**: Filter by email, status, role, registration date
- **User Details**: Profile information, security settings, login history
- **Bulk Actions**: Export users, send notifications, role assignments
- **User Timeline**: Complete activity history and audit trail

### Security Monitoring
- **Threat Detection**: Suspicious login patterns, brute force attempts
- **Device Management**: Track and manage trusted devices
- **Audit Logs**: Searchable security event history
- **Alert Configuration**: Set up security notifications

## 🔒 Security Implementation

### Password Security
```typescript
import argon2 from 'argon2';
import crypto from 'crypto';

export class PasswordService {
  private static readonly PEPPER = process.env.PASSWORD_PEPPER;
  
  static async hashPassword(password: string): Promise<string> {
    // Add pepper for extra security
    const pepperedPassword = password + this.PEPPER;
    
    return argon2.hash(pepperedPassword, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64 MB
      timeCost: 3,       // 3 iterations
      parallelism: 4,    // 4 threads
    });
  }
  
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    const pepperedPassword = password + this.PEPPER;
    return argon2.verify(hash, pepperedPassword);
  }
  
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }
}
```

### Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

// Login rate limiting
export const loginLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

// Registration rate limiting
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 registrations per hour per IP
  message: 'Too many registration attempts, please try again later',
});
```

### JWT Implementation
```typescript
import jwt from 'jsonwebtoken';

export class TokenService {
  static generateTokens(userId: string, deviceId: string) {
    const accessToken = jwt.sign(
      { userId, deviceId, type: 'access' },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );
    
    const refreshToken = jwt.sign(
      { userId, deviceId, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );
    
    return { accessToken, refreshToken };
  }
  
  static verifyAccessToken(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET!);
  }
  
  static verifyRefreshToken(token: string) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
  }
}
```

## 🧪 Testing Strategy

### Unit Tests
```typescript
import { PasswordService } from '../services/PasswordService';

describe('PasswordService', () => {
  test('should hash password securely', async () => {
    const password = 'testPassword123!';
    const hash = await PasswordService.hashPassword(password);
    
    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(50);
  });
  
  test('should verify correct password', async () => {
    const password = 'testPassword123!';
    const hash = await PasswordService.hashPassword(password);
    const isValid = await PasswordService.verifyPassword(password, hash);
    
    expect(isValid).toBe(true);
  });
  
  test('should reject incorrect password', async () => {
    const password = 'testPassword123!';
    const wrongPassword = 'wrongPassword';
    const hash = await PasswordService.hashPassword(password);
    const isValid = await PasswordService.verifyPassword(wrongPassword, hash);
    
    expect(isValid).toBe(false);
  });
});
```

### Integration Tests
```typescript
import supertest from 'supertest';
import { app } from '../app';

describe('Authentication API', () => {
  test('POST /api/auth/register should create new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'SecurePassword123!',
      firstName: 'John',
      lastName: 'Doe'
    };
    
    const response = await supertest(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);
    
    expect(response.body.user.email).toBe(userData.email);
    expect(response.body.tokens.accessToken).toBeDefined();
  });
});
```

### Security Tests
```typescript
// Test rate limiting
test('should block after too many login attempts', async () => {
  const credentials = { email: 'test@example.com', password: 'wrong' };
  
  // Make 5 failed attempts
  for (let i = 0; i < 5; i++) {
    await supertest(app)
      .post('/api/auth/login')
      .send(credentials)
      .expect(401);
  }
  
  // 6th attempt should be rate limited
  await supertest(app)
    .post('/api/auth/login')
    .send(credentials)
    .expect(429);
});
```

## 🚀 Deployment Configuration

### Docker Configuration
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S auth -u 1001
USER auth

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "start"]
```

### Environment Configuration
```env
# Database
MONGODB_URI=mongodb://localhost:27017/auth_system
REDIS_URL=redis://localhost:6379

# JWT Secrets
JWT_SECRET=your-super-secure-jwt-secret
JWT_REFRESH_SECRET=your-refresh-token-secret
PASSWORD_PEPPER=additional-password-security-layer

# OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Email & SMS
SENDGRID_API_KEY=your-sendgrid-api-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-phone

# Security
RATE_LIMIT_REDIS_URL=redis://localhost:6379
TRUSTED_PROXIES=127.0.0.1,::1
CORS_ORIGINS=http://localhost:3000,https://yourdomain.com

# Monitoring
LOG_LEVEL=info
DATADOG_API_KEY=your-datadog-key
```

## 📈 Implementation Phases

### Phase 1: Core Authentication (Week 1-3)
- Set up Node.js/Express backend with TypeScript
- Implement user registration and login
- Add password hashing with Argon2
- Create JWT token management

### Phase 2: Security Features (Week 4-6)
- Implement rate limiting and brute force protection
- Add email verification system
- Create password reset functionality
- Set up audit logging

### Phase 3: Multi-Factor Authentication (Week 7-9)
- Implement TOTP-based MFA
- Add SMS verification
- Create backup codes system
- Integrate WebAuthn/FIDO2 support

### Phase 4: OAuth Integration (Week 10-12)
- Set up OAuth providers (Google, GitHub, etc.)
- Implement account linking
- Add social login flows
- Create provider management

### Phase 5: Advanced Features (Week 13-16)
- Build admin dashboard
- Implement RBAC system
- Add device tracking
- Create suspicious activity detection

### Phase 6: Testing & Deployment (Week 17-20)
- Write comprehensive test suite
- Set up CI/CD pipelines
- Deploy to production
- Monitor security metrics

## 🎓 Learning Outcomes

### Security Expertise
- **Password Security**: Advanced hashing techniques and best practices
- **JWT Management**: Secure token implementation and refresh strategies
- **OAuth Flows**: Understanding various OAuth grant types
- **MFA Implementation**: Multi-factor authentication strategies
- **Security Monitoring**: Threat detection and audit logging

### Backend Development
- **API Security**: Rate limiting, input validation, CORS
- **Database Security**: Secure data storage and retrieval
- **Session Management**: Stateless and stateful authentication
- **Performance Optimization**: Caching and query optimization
- **Error Handling**: Secure error responses and logging

## 📞 Contact & Collaboration

**Developer**: Stephane Elkhoury  
**Email**: stephanelkhoury.dev@gmail.com  
**Portfolio**: [stephanelkhoury.com](https://stephanelkhoury.com)  
**GitHub**: [@stephanelkhoury](https://github.com/stephanelkhoury)

---

*This project demonstrates enterprise-level security practices, advanced authentication patterns, and comprehensive threat protection while showcasing modern backend development techniques and security-first architecture.*
