# Agrimind (AGRIMIND) 🌱 - Smart Farming IoT & AI Dashboard

Agrimind is an end-to-end Smart Agriculture System that bridges physical IoT hardware with a modern, AI-powered web dashboard. It enables farmers to monitor real-time environmental data, automate irrigation, analyze crop diseases using AI, and access critical chemical safety intelligence.

## 🏗️ System Architecture

The project is split into two core components that communicate seamlessly via Firebase Realtime Database:

- **Hardware (ESP32 Edge Device):** Collects sensor data and controls actuators in the field.
- **Web Dashboard (Next.js UI):** Provides a premium, interactive interface for monitoring, AI diagnostics, and chemical safety checks.

## 🔌 Hardware Configuration (ESP32)

The physical IoT system runs on an ESP32 microcontroller and is responsible for live environmental monitoring and physical automation.

**Components Used:**
- **Microcontroller:** ESP32
- **Sensors:** DHT11 (Temperature & Humidity), Soil Moisture Sensor
- **Actuators:**
  - **Relay Modules:** Controls water pumps for irrigation.
  - **Servo Motors:** Automates greenhouse ventilation or feeder mechanisms.
  - **Buzzer:** Provides local auditory alerts for critical conditions (e.g., extreme temperature).

**Hardware Features:**
- **Optimized Data Sync:** Bundles all sensor data into a single JSON object to minimize Firebase write requests.
- **Automated Actuation:** Triggers relays and servos based on environmental thresholds.
- **Fail-safes:** Built-in Firebase readiness checks and connection retries.

## 💻 Web Dashboard (AGRIMIND UI)

The frontend is a premium, responsive dashboard built to interpret the IoT data and augment it with AI tools.

**Software Stack:**
- **Framework:** Next.js 13+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Custom Glassmorphism UI
- **Animations:** Framer Motion
- **Database:** Firebase Realtime Database
- **Icons:** Lucide React

**Core Features:**
- **Live Sensor Dashboard:** Real-time visualization of the ESP32's Temperature, Humidity, and Irrigation status.
- **AI Leaf Scanner:** Upload photos of plant leaves for instant disease detection, root cause analysis, and actionable treatment recommendations.
- **Chemical Barcode Scanner:** Scan chemical labels to instantly pull up safety data sheets, toxicity profiles (Safe/Moderate/High), and eco-scores.
- **Chemical Intelligence & Interactions:** Cross-reference fertilizers and pesticides to prevent toxic combinations and find eco-friendly alternatives.

## 📁 Project Structure (Web)
```text
Galagrid/
├── src/
│   ├── app/                 # Next.js App Router (Pages & Layouts)
│   │   ├── dashboard/       # Main Dashboard, Scanners, Sensors, Chemicals
│   │   ├── login/           # Authentication Page
│   │   └── globals.css      # Tailwind & Custom CSS Variables
│   ├── components/          # Reusable UI Components
│   │   ├── effects/         # Framer Motion animations & visual effects
│   │   ├── layout/          # Sidebar, Topbar, and Page Layouts
│   │   └── ui/              # Base UI elements (Badges, Buttons, etc.)
│   ├── data/                # Mock data for demonstration purposes
│   ├── lib/                 # Core utilities (Firebase configuration)
│   ├── store/               # Zustand state management
│   └── types/               # TypeScript interfaces and type definitions
├── public/                  # Static assets
└── .env.local               # Environment variables (API Keys - DO NOT COMMIT)
```

## ⚙️ Setup & Installation

### 1. Web Dashboard Setup

Clone the repository:
```bash
git clone https://github.com/bipladipsaha/galagrid.git
cd galagrid
```
Install dependencies:
```bash
npm install
```
Configure Firebase: Create a `.env.local` file in the root directory and add your credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_DATABASE_URL="your-database-url"
```
Run the development server:
```bash
npm run dev
```

### 2. Hardware Setup (Arduino IDE)
- Open the ESP32 source code in Arduino IDE.
- Install required libraries:
  - `Firebase_ESP_Client` by Mobizt
  - `DHT sensor library` by Adafruit
  - `ESP32Servo`
- Update your WiFi credentials and Firebase API keys in the code.
- Flash the code to your ESP32 board.

## 🔒 Security Note
All sensitive API keys and database URLs for the web app are strictly kept in the `.env.local` file, which is deliberately excluded from version control via `.gitignore` to prevent unauthorized access. Ensure your ESP32 source code with hardcoded WiFi and API keys is also kept private!
