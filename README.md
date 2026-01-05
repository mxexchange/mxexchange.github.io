# MX Exchange

This is a Next.js application for exchanging sweeps coins to USD.

## Getting Started

To run this project, you'll need to set up your environment variables.

### 1. Create a `.env` file

In the root of your project, create a new file named `.env`.

### 2. Add Environment Variables

You'll need to add your Firebase project configuration and your Gemini API key to the `.env` file. You can find your Firebase config in your project's settings in the Firebase console.

Copy the following into your `.env` file and replace the placeholder values with your actual credentials:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"

# Google AI Configuration
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

### 3. Install Dependencies & Run

Once your `.env` file is set up, install the necessary packages and start the development server.

```bash
npm install
npm run dev
```

Your application should now be running at `http://localhost:9002`.
