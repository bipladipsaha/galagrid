// src/lib/weather.ts

export interface CurrentWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  condition: string;
  isDay: boolean;
}

export interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  precipitationProb: number;
  condition: string;
}

export interface WeatherData {
  current: CurrentWeather;
  forecast: DailyForecast[];
  location: string;
}

// Target: Murshidabad, West Bengal (Agricultural Region)
const LAT = 24.18;
const LON = 88.28;
const LOCATION_NAME = 'Murshidabad, WB';

// WMO Weather interpretation codes
export function getWeatherCondition(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code === 1 || code === 2 || code === 3) return 'Partly Cloudy';
  if (code === 45 || code === 48) return 'Fog';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code >= 71 && code <= 75) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain Showers';
  if (code >= 95) return 'Thunderstorm';
  return 'Unknown';
}

export async function fetchWeatherData(): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,is_day,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

  try {
    const res = await fetch(url, { next: { revalidate: 600 } }); // Cache for 10 mins
    if (!res.ok) throw new Error('Failed to fetch weather data');
    const data = await res.json();

    const current: CurrentWeather = {
      temperature: Math.round(data.current.temperature_2m),
      humidity: Math.round(data.current.relative_humidity_2m),
      windSpeed: Math.round(data.current.wind_speed_10m),
      weatherCode: data.current.weather_code,
      condition: getWeatherCondition(data.current.weather_code),
      isDay: data.current.is_day === 1,
    };

    const forecast: DailyForecast[] = data.daily.time.map((time: string, index: number) => {
      const date = new Date(time);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      return {
        date: index === 0 ? 'Today' : dayName,
        maxTemp: Math.round(data.daily.temperature_2m_max[index]),
        minTemp: Math.round(data.daily.temperature_2m_min[index]),
        weatherCode: data.daily.weather_code[index],
        precipitationProb: data.daily.precipitation_probability_max[index],
        condition: getWeatherCondition(data.daily.weather_code[index]),
      };
    }).slice(0, 7); // 7 day forecast

    return {
      current,
      forecast,
      location: LOCATION_NAME,
    };
  } catch (error) {
    console.error('Weather fetch error:', error);
    // Return safe fallback if network fails
    return {
      current: { temperature: 30, humidity: 60, windSpeed: 10, weatherCode: 0, condition: 'Clear Sky', isDay: true },
      forecast: Array(7).fill({ date: 'Day', maxTemp: 32, minTemp: 24, weatherCode: 0, precipitationProb: 0, condition: 'Clear Sky' }),
      location: LOCATION_NAME,
    };
  }
}
