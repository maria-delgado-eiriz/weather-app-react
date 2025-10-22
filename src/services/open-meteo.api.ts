import { fetchWeatherApi } from 'openmeteo'
import {
  OPEN_METEO_FORECAST_URL,
  OPEN_METEO_GEOCODING_URL,
  WEATHER_CONDITION_MAP,
  type CurrentWeatherData,
  type FiveDayForecastData,
  type FiveDayForecastItem,
  type CitySearchData
} from '../types/weather.types'
import { getWeatherIcon } from '../utils/weather.utils'

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
