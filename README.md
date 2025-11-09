<img width="598" height="861" alt="image" src="https://github.com/user-attachments/assets/2d35ea38-6b4b-4a21-a1dd-6037651669cd" />


# 🌟 Xeno CRM - Advanced Customer Relationship Management Platform

<div align="center">

![Xeno CRM Logo](https://img.shields.io/badge/Xeno-CRM-0080ff?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMiA5TDEzLjA5IDkuNzRMMTIgMTZMMTAuOTEgOS43NEwyIDlMMTAuOTEgOC4yNkwxMiAyWiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+)

**A modern, AI-powered CRM platform with stunning dark theme UI**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.19.2-000000?style=flat-square&logo=express)](https://expressjs.com/)
[![Deployed](https://img.shields.io/badge/Deployed-Live-success?style=flat-square)](https://xeno-sde-internship-2025.vercel.app)

[🚀 Live Demo](https://xeno-sde-internship-2025.vercel.app) • [📊 API Docs](#api-endpoints) • [🛠️ Installation](#installation)

</div>

---

## ✨ Features

### 🎨 **Beautiful Modern UI**
- **Dark Theme**: Professionally designed dark interface with vibrant accent colors
- **Glass Morphism**: Translucent navigation with backdrop blur effects
- **Responsive Design**: Perfect experience across all devices and screen sizes
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions

### 🤖 **AI-Powered Audience Segmentation**
- **Natural Language Processing**: Describe audiences in plain English
- **Smart Rule Generation**: AI converts text to precise segmentation rules
- **Visual Rule Builder**: Intuitive drag-and-drop interface with real-time previews
- **Advanced Logic**: Support for AND/OR combinations with visual explanations

### 📊 **Campaign Management**
- **Real-time Analytics**: Beautiful dashboards with performance metrics
- **Message Personalization**: Dynamic content with customer data integration
- **Delivery Tracking**: Monitor campaign success rates and failures
- **Historical Analysis**: Comprehensive campaign history with visual trends

### 🔐 **Enterprise Security**
- **Google OAuth 2.0**: Secure authentication with Google Sign-In
- **Session Management**: Persistent sessions with MongoDB store
- **API Security**: Protected endpoints with authentication middleware

---

## 🏗️ Architecture

### **Frontend (Vercel)**
```
React 18 + Vite
├── Modern UI Components
├── Framer Motion Animations  
├── Responsive Dark Theme
└── Google OAuth Integration
```

### **Backend (Render)**
```
Node.js + Express
├── RESTful API
├── MongoDB Integration
├── Google OAuth Strategy
└── Session Management
```

### **Message Queue (Railway)**
```
RabbitMQ Consumer
├── Customer Ingestion
├── Order Processing
└── Campaign Delivery
```

### **Database**
```
MongoDB Atlas
├── User Management
├── Customer Data
├── Campaign Analytics
└── Communication Logs
```

---

## 🚀 Live Deployment

| Service | Platform | URL | Status |
|---------|----------|-----|--------|
| **Frontend** | Vercel | [xeno-sde-internship-2025.vercel.app](https://xeno-sde-internship-2025.vercel.app) | ✅ Live |
| **Backend API** | Render | [xeno-sde-internship-2025.onrender.com](https://xeno-sde-internship-2025.onrender.com) | ✅ Live |
| **Message Queue** | Railway | Internal Service | ✅ Live |
| **Database** | MongoDB Atlas | Cloud Database | ✅ Live |

---

## 📱 Screenshots

### 🏠 **Login & Welcome**
```
Beautiful glass-morphism login page with Google OAuth integration
```

### 👥 **Audience Builder**
```
AI-powered rule generation with visual form builders and real-time previews
```

### 📈 **Campaign History**
```
Comprehensive analytics dashboard with interactive tables and success metrics
```

---

## 🛠️ Installation

### **Prerequisites**
- Node.js 18+ and npm
- MongoDB database
- Google OAuth credentials
- RabbitMQ instance (CloudAMQP)

### **1. Clone Repository**
```bash
git clone https://github.com/yourusername/xeno-crm-project.git
cd xeno-crm-project
```

### **2. Backend Setup**
```bash
cd server
npm install

# Create .env file
cat > .env << EOF
MONGO_URI=
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
COOKIE_KEY=your-session-secret
GEMINI_API_KEY=your-gemini-api-key
CLOUDAMQP_URL=amqp://username:password@hostname
VITE_API_BASE_URL=http://localhost:8000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
PORT=8000
EOF

npm start
```

### **3. Frontend Setup**
```bash
cd client
npm install

# Create .env file
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:8000
EOF

npm run dev
```

### **4. Consumer Service Setup**
```bash
cd server
npm run consumer
```

---

## 🔌 API Endpoints

### **Authentication**
```http
GET  /api/auth/google          # Initiate Google OAuth
GET  /api/auth/google/callback # OAuth callback
GET  /api/auth/current_user    # Get current user
GET  /api/auth/logout          # Logout user
```

### **Campaign Management**
```http
GET  /api/campaigns           # Get all campaigns
POST /api/campaigns           # Create new campaign
POST /api/campaigns/delivery-receipt # Delivery status webhook
```

### **Audience Management**
```http
POST /api/audience/preview    # Preview audience size
```

### **AI Services**
```http
POST /api/ai/generate-rules   # Generate rules from natural language
```

### **Customer & Order Management**
```http
POST /api/customers          # Create customer (queue-based)
POST /api/orders            # Create order (queue-based)
```

---

## 🎨 Design System

### **Color Palette**
```css
--bg-primary: #0f0f14        /* Deep dark background */
--primary-500: #0080ff       /* Electric blue */
--accent-500: #9166ff        /* Purple accent */
--success-400: #4ade80       /* Vibrant green */
--warning-400: #fbbf24       /* Bright yellow */
--error-400: #f87171         /* Soft red */
```

### **Typography**
```css
Font Family: 'Inter', -apple-system, BlinkMacSystemFont
Weights: 400, 500, 600, 700
Scale: 0.75rem → 3rem
```

### **Components**
- **Cards**: Glass-morphism with hover effects
- **Buttons**: Gradient backgrounds with glow effects
- **Forms**: Dark inputs with vibrant focus states
- **Tables**: Enhanced with hover states and badges

---

## 🔧 Environment Variables

### **Frontend (.env)**
```bash
VITE_API_BASE_URL=https://xeno-sde-internship-2025.onrender.com
```

### **Backend (.env)**
```bash
# Database
MONGO_URI=mongodb+srv://...

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret

# Security
COOKIE_KEY=your-session-secret

# AI Services
GEMINI_API_KEY=your-gemini-key

# Message Queue
CLOUDAMQP_URL=amqp://...

# URLs
VITE_API_BASE_URL=https://your-backend-url.onrender.com
CLIENT_URL=https://your-frontend-url.vercel.app

# Environment
NODE_ENV=production
PORT=8000
```

---

## 🚦 Getting Started Guide

### **1. Quick Start (5 minutes)**
1. Visit [Live Demo](https://xeno-sde-internship-2025.vercel.app)
2. Click "Sign in with Google"
3. Create your first audience segment
4. Launch a campaign and see real-time analytics

### **2. Local Development**
1. Follow installation steps above
2. Configure environment variables
3. Start all services (backend, frontend, consumer)
4. Open http://localhost:5173

### **3. Production Deployment**
1. Deploy backend to Render
2. Deploy frontend to Vercel  
3. Deploy consumer to Railway
4. Configure production environment variables

---

## 🏆 Key Features Showcase

### **AI-Powered Segmentation**
```
"High-value customers who haven't visited in 30 days"
↓ AI Processing ↓
Rules: totalSpends > 5000 AND lastVisit > 30
```

### **Real-time Campaign Analytics**
- Success rates with visual progress bars
- Delivery status tracking
- Historical performance trends
- Customer engagement metrics

### **Professional UI/UX**
- Dark theme with vibrant accents
- Smooth animations and transitions
- Responsive design for all devices
- Accessibility-focused interactions

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### **Development Workflow**
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Built with ❤️ by Kaustubh Arora**


---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) for the amazing frontend framework
- [Framer Motion](https://www.framer.com/motion/) for beautiful animations
- [Lucide React](https://lucide.dev/) for the stunning icon library
- [MongoDB Atlas](https://www.mongodb.com/atlas) for reliable database hosting
- [Vercel](https://vercel.com/) & [Render](https://render.com/) for seamless deployment

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

[🚀 Live Demo](https://xeno-sde-internship-2025.vercel.app) • [📊 API Docs](#api-endpoints) • [🛠️ Installation](#installation)

</div>
