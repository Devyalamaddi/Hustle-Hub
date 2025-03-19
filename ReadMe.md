# HustleHub

HustleHub is a freelancing platform designed to connect talented freelancers with clients seeking professional services. The platform facilitates secure transactions, project management, and communication between parties.

## Features

- User Authentication & Authorization
- Project Creation and Management
- Secure Payment Integration
- Real-time Messaging
- Review and Rating System
- Profile Management
- Project Bidding System

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Bcrypt for password hashing

### Frontend
- React
- Vite
- Material-UI
- TailwindCSS
- Three.js
- Framer Motion
- Zustand for state management

## Local Setup

### Prerequisites
- Node.js (v18 or higher)
- PNPM package manager
- MongoDB

### Installation Steps

1. Clone the repository
```bash
git clone https://github.com/yourusername/HustleHub.git
cd HustleHub
```

2. Backend Setup
```bash
cd backend
pnpm install
cp .env.example .env  # Create and configure your environment variables
pnpm run dev
```

3. Frontend Setup
```bash
cd frontend
pnpm install
pnpm run dev
```

4. Access the application
- Backend will run on `http://localhost:5000`
- Frontend will run on `http://localhost:5173`

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```


## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.