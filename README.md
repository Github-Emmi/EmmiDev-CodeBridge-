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

**EmmiDev-CodeBridge** is a next-generation, AI-powered learning platform designed to bridge the gap between learners and expert tutors. Built for scale and real-time collaboration, it empowers students, tutors, and administrators with a seamless educational experience—combining live classes, intelligent study assistance, and a vibrant learning community.

---

## Live Deployment:
https://emmidev-codebridge.vercel.app/


## 🌟 Features

### Core Features
- **Multi-Role User Management:** Robust authentication and authorization for Students, Tutors, Admins, and Superadmins.
- **Course Management:** Create, update, enroll, and track progress with ratings and analytics.
- **Live Classes:** Integrated Zoom video sessions for real-time learning.
- **Assignments & Tests:** Full assignment lifecycle with AI-assisted pre-grading and auto-graded tests.
- **Payments:** Secure Paystack integration for course purchases.
- **Community Feed:** Social platform for posts, comments, likes, and media sharing.
- **Real-Time Chat & Notifications:** Group and direct messaging, typing indicators, and instant alerts.

### AI-Powered Features
- **AI Study Assistant:** Multi-model support (OpenRouter, Kwaipilot, Grok) for coding help, study recommendations, and general Q&A.
- **Personalized Study Plans:** Adaptive recommendations based on user progress and goals.
- **Resource Suggestions:** Intelligent textbook and material recommendations.
- **Performance Insights:** Automated analysis and feedback on assignments and tests.
- **Assignment Pre-Grading:** AI-powered feedback before tutor review.
- **Video Transcript Summarization:** Quick insights from class recordings.

### Real-time Features
- **Live Group Chat:** Socket.io-powered messaging in courses and direct messages.
- **Instant Notifications:** Real-time updates for assignments, classes, and community activity.
- **WebRTC Video Calls:** Seamless video communication for classes and meetings.
- **Dynamic Community Feed:** Live updates for posts, comments, and interactions.

---

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
