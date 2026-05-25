# GaiaGrid (Agrimind AI) 🌱

GaiaGrid is a next-generation Smart Farming and AI Agricultural Dashboard built with Next.js, React, and Firebase. It provides real-time sensor monitoring, AI-driven crop disease detection, and chemical intelligence for precision agriculture.

## 🚀 Features

- **Real-time IoT Sensor Dashboard**: Monitor Temperature, Humidity, Soil Moisture, and Irrigation statuses synced instantly via Firebase Realtime Database.
- **AI Crop & Leaf Scanner**: Upload photos of plant leaves for instant disease detection, root cause analysis, and actionable treatment recommendations.
- **Chemical Intelligence System**: A dedicated barcode scanner and chemical database to cross-reference toxicity levels, eco-scores, and safe chemical combinations.
- **Automated Alerts**: Live notification system for critical crop and weather conditions.
- **Responsive & Modern UI**: Built with Framer Motion, Lucide Icons, and custom Glassmorphism components for a premium user experience.

## 📁 Project Structure

```text
amity/
├── src/
│   ├── app/                 # Next.js 13+ App Router (Pages & Layouts)
│   │   ├── dashboard/       # Main Dashboard, Scanner, Sensors, Chemicals
│   │   ├── login/           # Authentication Page
│   │   └── globals.css      # Tailwind & Custom CSS Variables
│   ├── components/          # Reusable UI Components
│   │   ├── effects/         # Framer Motion animations & visual effects
│   │   ├── layout/          # Sidebar, Topbar, and Page Layouts
│   │   └── ui/              # Base UI elements (Badges, Buttons, etc.)
│   ├── data/                # Mock data for demonstration purposes
│   ├── lib/                 # Core utilities (Firebase configuration)
│   ├── store/               # Zustand state management (Auth, Scans, etc.)
│   └── types/               # TypeScript interfaces and type definitions
├── public/                  # Static assets (Images, Icons)
└── .env.local               # Environment variables (API Keys - DO NOT COMMIT)
```

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Tailwind CSS + Custom Vanilla CSS
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Database**: [Firebase Realtime Database](https://firebase.google.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## ⚙️ Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/bipladipsaha/galagrid.git
   cd galagrid
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase Environment Variables:**
   Create a `.env.local` file in the root directory and add your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
   NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
   NEXT_PUBLIC_FIREBASE_DATABASE_URL="your-database-url"
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔒 Security Note
All sensitive API keys and database URLs are strictly kept in the `.env.local` file, which is deliberately excluded from version control via `.gitignore` to prevent unauthorized access.
