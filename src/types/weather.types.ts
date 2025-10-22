export interface CurrentWeatherData {
  temperature: number
  condition: string
  weatherIcon: string
}

export interface Coordinates {
  latitude: number
  longitude: number
}

export interface UserLocationInfo {
  latitude: number
  longitude: number
  city: string
  country: string
}

export interface LocationInfo {
  city: string
  country: string
  fullLocation: string
}

export interface FiveDayForecastItem {
  date: string
  highTemp: number
  lowTemp: number
  condition: string
  weatherIcon: string
  weatherCode: number
}

export interface FiveDayForecastData {
  forecast: FiveDayForecastItem[]
}

export interface SearchResult {
  id: number
  name: string
  country: string
  latitude: number
  longitude: number
  admin1?: string // State/Region
  population?: number
}

export interface CitySearchData {
  results: SearchResult[]
  generationtime_ms: number
}

export const WEATHER_CONDITION_MAP: { [key: number]: string } = {
  0: '☀️ Clear sky',
  1: '🌤️ Mainly clear',
  2: '⛅ Partly cloudy',
  3: '☁️ Overcast',
  45: '🌫️ Fog',
  48: '🌫️ Depositing rime fog',
  51: '🌦️ Light drizzle',
  53: '🌦️ Moderate drizzle',
  55: '🌦️ Dense drizzle',
  56: '🌦️ Freezing Drizzle Light',
  57: '🌦️ Freezing Drizzle Dense',
  61: '🌧️ Slight rain',
  63: '🌧️ Moderate rain',
  65: '🌧️ Heavy rain',
  66: '🌧️ Freezing Rain Light',
  67: '🌧️ Freezing Rain Dense',
  71: '🌨️ Slight snow fall',
  73: '🌨️ Moderate snow fall',
  75: '🌨️ Heavy snow fall',
  77: '🌨️ Snow grains',
  80: '🌨️ Rain showers: Slight',
  81: '🌨️ Rain showers: Moderate',
  82: '🌨️ Rain showers: Violent',
  85: '🌨️ Snow showers slight',
  86: '🌨️ Snow showers heavy',
  95: '⛈️ Thunderstorm',
  96: '⛈️ Thunderstorm with slight hail',
  99: '⛈️ Thunderstorm with heavy hail'
}

export const GEOLOCATION_BY_IP_URL = 'https://ipapi.co/json/'
export const OPEN_METEO_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
export const OPEN_METEO_GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
