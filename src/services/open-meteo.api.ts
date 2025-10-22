import { fetchWeatherApi } from 'openmeteo'
import {
  OPEN_METEO_FORECAST_URL,
  OPEN_METEO_GEOCODING_URL,
  WEATHER_CONDITION_MAP,
  type CurrentWeatherData,
  type FiveDayForecastData,
  type FiveDayForecastItem,
  type LocationInfo,
  type CitySearchData
} from '../types/weather.types'

const getWeatherIcon = (code: number): string => {
  if (code === 0) return '☀️'
  if (code === 1) return '🌤️'
  if (code === 2) return '⛅'
  if (code === 3) return '☁️'
  if ([45, 48].includes(code)) return '🌫️'
  if ([51, 53, 55, 56, 57].includes(code)) return '🌦️'
  if ([61, 63, 65, 66, 67].includes(code)) return '🌧️'
  if ([71, 73, 75, 77, 80, 81, 82].includes(code)) return '🌨️'
  if ([85, 86].includes(code)) return '❄️'
  if ([95, 96, 99].includes(code)) return '⛈️'
  return '❓' // Default for unknown codes
}

export const getLocationInfo = async (
  latitude: number,
  longitude: number
): Promise<LocationInfo> => {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`

    const response = await fetch(url)
    const data = await response.json()

    if (data.results && data.results.length > 0) {
      const result = data.results[0]
      const city = result.name || 'Unknown city'
      const country = result.country || 'Unknown country'

      return {
        city,
        country,
        fullLocation: `${city}, ${country}`
      }
    }

    return {
      city: 'Location',
      country: 'Unknown',
      fullLocation: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
    }
  } catch (error) {
    console.error('Geocoding error:', error)
    return {
      city: 'Location',
      country: 'Unknown',
      fullLocation: `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
    }
  }
}

export const fetchCurrentWeather = async (
  latitude: number = 40.4168,
  longitude: number = -3.7038
): Promise<CurrentWeatherData> => {
  try {
    const params = {
      latitude: [latitude],
      longitude: [longitude],
      current: [
        'temperature_2m', 
        'weather_code', 
        'wind_speed_10m', 
        'relative_humidity_2m'
      ],
      timezone: 'auto'
    }

    const responses = await fetchWeatherApi(OPEN_METEO_FORECAST_URL, params)

    if (!responses || responses.length === 0) {
      throw new Error('Could not fetch weather data')
    }

    const response = responses[0]
    const current = response.current()

    if (!current) {
      throw new Error('No current data available')
    }
    
    const weatherCode = current.variables(1)?.value() || 0
    
    return {
      temperature: Math.round(current.variables(0)?.value() || 0),
      condition: WEATHER_CONDITION_MAP[weatherCode],
      weatherIcon: getWeatherIcon(weatherCode),
      windSpeed: Math.round(current.variables(2)?.value() || 0),
      humidity: Math.round(current.variables(3)?.value() || 0)
    }
  } catch (error) {
    console.error('Error fetching weather data:', error)
    throw error
  }
}

export const fetchFiveDayForecast = async (
  latitude: number = 40.4168,
  longitude: number = -3.7038
): Promise<FiveDayForecastData> => {
  try {
    const params = {
      latitude: [latitude],
      longitude: [longitude],
      daily: ['weather_code', 'temperature_2m_max', 'temperature_2m_min'],
      timezone: 'auto',
      forecast_days: 5
    }

    const responses = await fetchWeatherApi(OPEN_METEO_FORECAST_URL, params)

    if (!responses || responses.length === 0) {
      throw new Error('Could not fetch forecast data')
    }

    const response = responses[0]
    const daily = response.daily()

    if (!daily) {
      throw new Error('No daily forecast data available')
    }

    const utcOffsetSeconds = response.utcOffsetSeconds()
    const forecast: FiveDayForecastItem[] = []

    for (let i = 0; i < 5; i++) {
      const date = new Date(
        (Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000
      )
      const weatherCode = daily.variables(0)?.valuesArray()?.[i] || 0
      const maxTemp = daily.variables(1)?.valuesArray()?.[i] || 0
      const minTemp = daily.variables(2)?.valuesArray()?.[i] || 0

      forecast.push({
        date: date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }),
        highTemp: Math.round(maxTemp),
        lowTemp: Math.round(minTemp),
        condition: WEATHER_CONDITION_MAP[weatherCode] || 'Unknown',
        weatherIcon: getWeatherIcon(weatherCode),
        weatherCode
      })
    }

    return { forecast }
  } catch (error) {
    console.error('Error fetching forecast data:', error)
    throw error
  }
}

export const searchCities = async (query: string): Promise<CitySearchData> => {
  try {
    if (!query.trim()) {
      return { results: [], generationtime_ms: 0 }
    }

    const url = `${OPEN_METEO_GEOCODING_URL}?name=${encodeURIComponent(
      query
    )}&count=10&language=en&format=json`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    return {
      results: data.results || [],
      generationtime_ms: data.generationtime_ms || 0
    }
  } catch (error) {
    console.error('Error searching cities:', error)
    throw error
  }
}
