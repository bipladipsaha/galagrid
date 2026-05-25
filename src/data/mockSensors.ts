import type { SensorConfig, SensorReading } from '@/types';

export const SENSOR_CONFIGS: SensorConfig[] = [
  {
    type: 'temperature',
    label: 'Temperature',
    unit: '°C',
    icon: 'Thermometer',
    min: -10,
    max: 50,
    optimalMin: 18,
    optimalMax: 32,
    color: '#ffab00',
  },
  {
    type: 'humidity',
    label: 'Humidity',
    unit: '%',
    icon: 'CloudRain',
    min: 0,
    max: 100,
    optimalMin: 50,
    optimalMax: 80,
    color: '#00e5ff',
  },
  {
    type: 'soil_moisture',
    label: 'Soil Moisture',
    unit: '%',
    icon: 'Droplets',
    min: 0,
    max: 100,
    optimalMin: 40,
    optimalMax: 70,
    color: '#00ff88',
  }
];

function getStatus(value: number, config: SensorConfig): 'normal' | 'warning' | 'critical' {
  if (value >= config.optimalMin && value <= config.optimalMax) return 'normal';
  const range = config.max - config.min;
  const distFromOptimal = Math.min(
    Math.abs(value - config.optimalMin),
    Math.abs(value - config.optimalMax)
  );
  if (distFromOptimal / range > 0.3) return 'critical';
  return 'warning';
}

export function generateSensorReading(config: SensorConfig, farmId = 'farm-1'): SensorReading {
  // Bias toward optimal range for realistic data
  const optimalMid = (config.optimalMin + config.optimalMax) / 2;
  const optimalRange = config.optimalMax - config.optimalMin;
  const value = parseFloat(
    (optimalMid + (Math.random() - 0.5) * optimalRange * 1.8).toFixed(1)
  );
  const clampedValue = Math.max(config.min, Math.min(config.max, value));

  return {
    id: `sensor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    farmId,
    type: config.type,
    value: clampedValue,
    unit: config.unit,
    timestamp: new Date(),
    status: getStatus(clampedValue, config),
  };
}

export function generateSensorHistory(
  config: SensorConfig,
  hours = 24,
  farmId = 'farm-1'
): SensorReading[] {
  const readings: SensorReading[] = [];
  const now = Date.now();
  const optimalMid = (config.optimalMin + config.optimalMax) / 2;
  const optimalRange = config.optimalMax - config.optimalMin;

  let currentValue = optimalMid;

  for (let i = hours; i >= 0; i--) {
    // Random walk with mean reversion
    const drift = (optimalMid - currentValue) * 0.05;
    const noise = (Math.random() - 0.5) * optimalRange * 0.15;
    currentValue = Math.max(
      config.min,
      Math.min(config.max, currentValue + drift + noise)
    );

    readings.push({
      id: `sensor-hist-${i}`,
      farmId,
      type: config.type,
      value: parseFloat(currentValue.toFixed(1)),
      unit: config.unit,
      timestamp: new Date(now - i * 3600000),
      status: getStatus(currentValue, config),
    });
  }

  return readings;
}

export function generateSparklineData(config: SensorConfig, points = 20): number[] {
  const data: number[] = [];
  const mid = (config.optimalMin + config.optimalMax) / 2;
  const range = config.optimalMax - config.optimalMin;
  let val = mid;

  for (let i = 0; i < points; i++) {
    val += (Math.random() - 0.5) * range * 0.2;
    val = Math.max(config.min, Math.min(config.max, val));
    data.push(parseFloat(val.toFixed(1)));
  }

  return data;
}
