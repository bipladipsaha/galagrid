import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';

// Load environment variables if running locally via Node
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:000:web:000',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Base realistic values for Murshidabad / Indian Agriculture
let currentTemp = 28.5; // °C
let currentHumidity = 65.0; // %
let currentSoilMoisture = 45.0; // %

// Fluctuation bounds
const TEMP_BOUNDS = { min: 22, max: 35 };
const HUM_BOUNDS = { min: 50, max: 85 };
const SOIL_BOUNDS = { min: 30, max: 60 };

function walkValue(current: number, bounds: { min: number, max: number }, maxStep: number): number {
  const step = (Math.random() * maxStep * 2) - maxStep;
  let next = current + step;
  
  // Soft boundaries - push back if getting too close to edges
  if (next > bounds.max - 2) next -= Math.abs(step) * 1.5;
  if (next < bounds.min + 2) next += Math.abs(step) * 1.5;
  
  return Number(Math.max(bounds.min, Math.min(bounds.max, next)).toFixed(1));
}

async function simulateSensors() {
  console.log('🌱 GaiaGrid IoT Simulator Started...');
  console.log(`📡 Target Project: ${firebaseConfig.projectId}`);
  
  if (firebaseConfig.apiKey === 'demo-api-key') {
    console.warn('⚠️ WARNING: Using demo Firebase config. Data will not be saved to a real cloud database.');
    console.warn('Please add your Firebase credentials to .env.local to stream to production.');
  }

  // Interval every 5 seconds
  setInterval(async () => {
    // Generate natural fluctuations
    currentTemp = walkValue(currentTemp, TEMP_BOUNDS, 0.3);
    currentHumidity = walkValue(currentHumidity, HUM_BOUNDS, 1.0);
    currentSoilMoisture = walkValue(currentSoilMoisture, SOIL_BOUNDS, 0.5);

    const payload = {
      temperature: currentTemp,
      humidity: currentHumidity,
      soilMoisture: currentSoilMoisture,
      timestamp: serverTimestamp(),
      sensorId: 'node-dht22-alpha',
      status: 'online'
    };

    try {
      // 1. Update the 'latest' document for instant dashboard reads
      await setDoc(doc(db, 'sensors', 'latest'), payload);

      // 2. Add to history collection for charts (keep it light, in production use TTL or time-series DB)
      await addDoc(collection(db, 'sensor_history'), {
        ...payload,
        timestamp: new Date() // Use local date for easier querying in demo
      });

      console.log(`[${new Date().toLocaleTimeString()}] Sent: T:${currentTemp}°C | H:${currentHumidity}% | SM:${currentSoilMoisture}%`);
    } catch (error) {
      console.error('❌ Failed to push sensor data:', (error as Error).message);
    }
  }, 5000);
}

simulateSensors();
