# Bloogy

A modern blog platform built with React, NestJS, and MongoDB.

## 🚀 Features

- User authentication and authorization
- Social media login (Google, Facebook)
- Blog post creation and management
- Responsive and modern UI
- Real-time notifications
- Email notifications
- Rate limiting for API protection

## 🛠️ Tech Stack

### Frontend

- React 19
- TypeScript
- Material-UI (MUI)
- Redux Toolkit
- React Router
- TailwindCSS
- Framer Motion
- Axios
- React Hot Toast

### Backend

- NestJS
- MongoDB with Mongoose
- JWT Authentication
- Passport.js for social authentication
- Nodemailer for email notifications
- Class Validator
- Rate Limiting

## 📦 Prerequisites

- Node.js (Latest LTS version recommended)
- MongoDB
- npm or yarn

## 🚀 Getting Started

### Clone the repository

```bash
git clone <repository-url>
cd bloogy
```

### Frontend Setup

```bash
cd client-side
npm install
npm run dev
```

### Backend Setup

```bash
cd server-side
npm install
npm run start:dev
```

## 🔧 Environment Variables

### Frontend (.env)

```
VITE_API_URL=http://localhost:3000
```

### Backend (.env)

```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_CLIENT_ID=your_facebook_client_id
FACEBOOK_CLIENT_SECRET=your_facebook_client_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

## 📝 Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend

- `npm run start:dev` - Start development server
- `npm run build` - Build the application
- `npm run start:prod` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:e2e` - Run end-to-end tests

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
