# Crypto Tracker

A comprehensive cryptocurrency tracking and management platform built with React.js, Node.js, Express.js, and MongoDB.

## Features

- **Real-time Cryptocurrency Tracking**: Live price updates using CoinGecko API
- **Portfolio Management**: Track your investments and calculate profits/losses
- **Price Alerts**: Get notified when cryptocurrencies hit target prices
- **Secure Payments**: Integrated Razorpay UPI for wallet top-ups and payments
- **User Authentication**: JWT-based auth with Google OAuth support
- **Dark/Light Mode**: Customizable theme preferences
- **Currency Conversion**: Support for multiple currencies (USD, INR, EUR, GBP)
- **Responsive Design**: Modern UI that works on all devices

## Tech Stack

### Frontend
- React.js 18
- React Router DOM
- Tailwind CSS
- Lucide React (Icons)
- React Hot Toast (Notifications)
- Axios (HTTP Client)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Passport.js (Google OAuth)
- Express Validator
- Helmet (Security)
- CORS
- Rate Limiting

### APIs & Integrations
- CoinGecko API (Cryptocurrency data)
- Razorpay (Payment processing)
- Google OAuth (Authentication)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Google OAuth credentials
- Razorpay account (for payments)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crypto-tracker
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   
   Create a `.env` file in the `server` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/crypto-tracker
   JWT_SECRET=your-super-secret-jwt-key-here
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret
   COINGECKO_API_URL=https://api.coingecko.com/api/v3
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

### API Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/preferences` - Update user preferences

#### Cryptocurrency
- `GET /api/crypto/prices` - Get cryptocurrency prices
- `GET /api/crypto/coin/:id` - Get specific coin details
- `GET /api/crypto/search` - Search cryptocurrencies
- `GET /api/crypto/trending` - Get trending cryptocurrencies
- `GET /api/crypto/global` - Get global market data

#### Portfolio
- `GET /api/portfolio` - Get user portfolio
- `POST /api/portfolio` - Add coin to portfolio
- `PUT /api/portfolio/:coinId` - Update portfolio item
- `DELETE /api/portfolio/:coinId` - Remove coin from portfolio

#### Alerts
- `GET /api/alerts` - Get user alerts
- `POST /api/alerts` - Create price alert
- `PUT /api/alerts/:alertId` - Update alert
- `DELETE /api/alerts/:alertId` - Delete alert

#### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/wallet` - Get wallet balance
- `POST /api/payments/withdraw` - Withdraw funds

## Project Structure

```
crypto-tracker/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React contexts
│   │   ├── pages/          # Page components
│   │   └── App.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Configuration files
│   ├── middleware/         # Express middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── index.js          # Server entry point
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

## Features in Detail

### Portfolio Management
- Add/remove cryptocurrency holdings
- Track buy prices and current values
- Calculate profit/loss automatically
- Real-time portfolio value updates

### Price Alerts
- Set target prices for any cryptocurrency
- Choose "above" or "below" conditions
- Email and push notifications
- Manage active/inactive alerts

### Payment Integration
- Secure wallet system
- Razorpay UPI integration
- Support for INR and USD
- Top-up and withdrawal functionality

### User Experience
- Dark/light mode switching
- Responsive design
- Real-time data updates
- Intuitive navigation
- Toast notifications

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation
- Secure payment processing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@cryptotracker.com or create an issue in the repository.

---

Generated With the help of ChatGPT

Built with ❤️ for crypto enthusiasts
