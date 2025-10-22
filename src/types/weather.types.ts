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
  61: '🌧️ Slight rain',
  63: '🌧️ Moderate rain',
  65: '🌧️ Heavy rain',
  71: '🌨️ Slight snow fall',
  73: '🌨️ Moderate snow fall',
  75: '🌨️ Heavy snow fall',
  95: '⛈️ Thunderstorm'
}
export const WEATHER_ICON_MAP = new Map([
  [0, '☀️'],
  [1, '🌤️'],
  [2, '⛅'],
  [3, '☁️'],
  [45, '🌫️'],
  [48, '🌫️'],
  [51, '🌦️'],
  [53, '🌦️'],
  [55, '🌦️'],
  [61, '🌧️'],
  [63, '🌧️'],
  [65, '🌧️'],
  [71, '🌨️'],
  [73, '🌨️'],
  [75, '🌨️'],
  [95, '⛈️']
])

export const GEOLOCATION_BY_IP_URL = 'https://ipapi.co/json/'
export const OPEN_METEO__CURRENT_WEATHER_URL =
  'https://api.open-meteo.com/v1/forecast'
