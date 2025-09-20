const fs = require('fs');
const path = require('path');

// Create .env file for server
const envContent = `NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/
JWT_SECRET=af83194ae2c76592e65d89b8ed7bca30
GOOGLE_CLIENT_ID=193570323233-9a8acoaq9t2ctqt82q7c5vf96co90o5n.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
RAZORPAY_KEY_ID=rzp_test_RJlZuVIQgteL60
RAZORPAY_KEY_SECRET=66fGyI5vYZWg8Z7myjQZvSW6
COINGECKO_API_URL=CG-nt4e3XWzqWA5VF8wsTEfnAdb
CLIENT_URL=http://localhost:3000`;

const envPath = path.join(__dirname, 'server', '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created server/.env file');
} else {
  console.log('⚠️  server/.env file already exists');
}

console.log(`
🚀 Crypto Tracker Setup Complete!

Next steps:
1. Install dependencies: npm run install-all
2. Update server/.env with your API keys:
   - Google OAuth credentials
   - Razorpay keys
   - MongoDB connection string
3. Start development: npm run dev

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

`);
