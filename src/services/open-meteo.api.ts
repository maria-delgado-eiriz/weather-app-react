import { fetchWeatherApi } from 'openmeteo'
import {
  GEOLOCATION_BY_IP_URL,
  OPEN_METEO__CURRENT_WEATHER_URL,
  WEATHER_CONDITION_MAP,
  WEATHER_ICON_MAP,
  type CurrentWeatherData,
  type LocationInfo,
  type UserLocationInfo
} from '../types/weather.types'

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
        'relative_humidity_2m',
        'weather_code',
        'wind_speed_10m'
      ],
      timezone: 'auto'
    }

    const responses = await fetchWeatherApi(
      OPEN_METEO__CURRENT_WEATHER_URL,
      params
    )

    if (!responses || responses.length === 0) {
      throw new Error('Could not fetch weather data')
    }

    const response = responses[0]
    const current = response.current()

    if (!current) {
      throw new Error('No current data available')
    }

    return {
      temperature: Math.round(current.variables(0)?.value() || 0),
      condition: WEATHER_CONDITION_MAP[current.variables(2)?.value() || 0],
      weatherIcon:
        WEATHER_ICON_MAP.get(current.variables(2)?.value() || 0) ?? '❓'
    }
  } catch (error) {
    console.error('Error fetching weather data:', error)
    throw error
  }
}

export const getUserLocationByIP = async (): Promise<UserLocationInfo> => {
  try {
    const response = await fetch(GEOLOCATION_BY_IP_URL)
    const data = await response.json()
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
      country: data.country
    }
  } catch (error) {
    console.error('IP geolocation error:', error)
    throw error
  }
}
