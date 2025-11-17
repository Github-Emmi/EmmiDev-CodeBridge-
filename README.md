┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   ███████╗███╗   ███╗███╗   ███╗██╗██████╗ ███████╗██╗   ██╗  │
│   ██╔════╝████╗ ████║████╗ ████║██║██╔══██╗██╔════╝██║   ██║  │
│   █████╗  ██╔████╔██║██╔████╔██║██║██║  ██║█████╗  ██║   ██║  │
│   ██╔══╝  ██║╚██╔╝██║██║╚██╔╝██║██║██║  ██║██╔══╝  ╚██╗ ██╔╝  │
│   ███████╗██║ ╚═╝ ██║██║ ╚═╝ ██║██║██████╔╝███████╗ ╚████╔╝   │
│   ╚══════╝╚═╝     ╚═╝╚═╝     ╚═╝╚═╝╚═════╝ ╚══════╝  ╚═══╝    │
│                                                                 │
│          C O D E B R I D G E   -  A.I POWERED                   │
│                    DEPLOYMENT READY 🚀                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘




# EmmiDev-CodeBridge 🎓

A comprehensive MERN learning platform connecting YouTube followers with verified tutors through live Zoom classes, AI-powered study recommendations, community features, and real-time collaboration.

## 🌟 Features

### Core Features
- **User Management**: Multi-role system (Student, Tutor, Admin, Superadmin)
- **Course Management**: Full CRUD with enrollment, ratings, and progress tracking
- **Live Classes**: Zoom API integration for scheduled video sessions
- **Assignment System**: Create, submit, grade with AI-assisted pre-grading
- **Test System**: Create tests with multiple question types and auto-grading
- **Payment Processing**: Paystack integration for course payments
- **Community Feed**: Social platform with posts, likes, comments, and media
- **Real-time Chat**: Socket.io powered group and direct messaging
- **Notifications**: In-app notification system with real-time updates
- **AI Recommendations**: OpenAI-powered study plans and resource suggestions

### AI-Powered Features
- Study recommendations based on progress
- Textbook and resource suggestions
- Performance analysis and insights
- Automated assignment pre-grading
- Personalized study plans
- Question answering assistant
- Video transcript summarization

### Real-time Features
- Live chat in course groups
- Direct messaging
- Typing indicators
- Real-time notifications
- WebRTC video calls support
- Community feed updates

## 🏗️ Architecture

```
emmidev-codebridge/
├── backend/                 # Node.js + Express API
│   ├── config/             # Database & service configs
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth, upload, rate limiting
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API endpoints
│   ├── services/           # Business logic (AI, Zoom, Socket)
│   ├── utils/              # Helper functions
│   ├── server.js           # Entry point
│   └── seed.js             # Database seeding
│
└── frontend/                # React + Redux + Tailwind
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── pages/          # Page components
    │   ├── redux/          # State management
    │   ├── services/       # API calls
    │   ├── utils/          # Helper functions
    │   ├── layouts/        # Layout components
    │   └── hooks/          # Custom React hooks
    └── public/             # Static assets
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **Real-time**: Socket.io
- **File Upload**: Multer + Cloudinary
- **Payments**: Paystack
- **Video**: Zoom API
- **AI**: OpenAI GPT-4
- **Email**: NodeMailer

### Frontend
- **Framework**: React 19
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **Styling**: TailwindCSS v4
- **Icons**: Heroicons
- **HTTP Client**: Axios
- **Real-time**: Socket.io-client

## 🚀 Getting Started

### Prerequisites
- Node.js >= 16.x
- MongoDB >= 5.x
- npm or yarn
- Zoom API account
- OpenAI API key
- Cloudinary account
- Paystack account

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd emmidev-codebridge
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

4. **Seed Database** (Optional)
```bash
cd backend
node seed.js
```

### Environment Variables

**Backend (.env)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/emmidev-codebridge
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
ZOOM_ACCOUNT_ID=your-zoom-account-id
ZOOM_CLIENT_ID=your-zoom-client-id
ZOOM_CLIENT_SECRET=your-zoom-client-secret
OPENAI_API_KEY=your-openai-api-key
PAYSTACK_SECRET_KEY=your-paystack-secret
FRONTEND_URL=http://localhost:3000
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_PAYSTACK_PUBLIC_KEY=your-paystack-public-key
```

## 📝 API Documentation

See [backend/README.md](./backend/README.md) for comprehensive API documentation.

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚢 Deployment

### Backend (Render/Railway)
1. Create new web service
2. Connect GitHub repository
3. Set environment variables
4. Deploy from main branch

### Frontend (Vercel)
1. Import GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables
5. Deploy

### Database (MongoDB Atlas)
1. Create cluster at mongodb.com
2. Get connection string
3. Add to MONGODB_URI
4. Whitelist IP addresses

## 📱 Sample Accounts (After Seeding)

- **Admin**: admin@emmidevcode.com / password123
- **Tutor**: emmidev@emmidevcode.com / password123
- **Student**: john@student.com / password123

## 📊 Database Models

- **User**: Authentication and profile management
- **Course**: Course information and enrollment
- **Assignment**: Assignment details and requirements
- **Submission**: Student assignment submissions
- **Test**: Test/quiz creation and management
- **TestResult**: Test attempt results
- **Post**: Community feed posts
- **Message**: Chat messages
- **ChatRoom**: Chat room management
- **Notification**: User notifications
- **Payment**: Payment transactions

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Rate limiting on API endpoints
- Input validation and sanitization
- Webhook signature verification
- CORS configuration
- XSS protection
- Environment variable protection

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Aghason Emmanuel Ibeabuchi** - Full Stack Developer & Educator
- YouTube: [@EmmiDevCodes](https://youtube.com/@EmmiDevCodes)
- Email: Aghason.emmanuel@gmail.com

## 🙏 Acknowledgments

- MongoDB for database
- Cloudinary for media storage
- Zoom for video conferencing  
- OpenAI for AI features
- Paystack for payment processing
- All open-source contributors

## 📞 Support

For support, email emmidev@emmidevcode.com or join our community Discord server.

---

**Built with ❤️ by EmmiDev for the learning community**
