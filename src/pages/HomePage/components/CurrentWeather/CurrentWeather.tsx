import React, { useEffect, useState } from 'react'
import {
  fetchCurrentWeather,
  getUserLocationByIP
} from '../../../../services/open-meteo.api'
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material'
import './CurrentWeather.css'
import {
  type UserLocationInfo,
  type CurrentWeatherData
} from '../../../../types/weather.types'

const CurrentWeather: React.FC = () => {
  const [currentLocationData, setCurrentLocationData] =
    useState<UserLocationInfo>()

  const [weatherData, setWeatherData] = useState<CurrentWeatherData | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadWeatherData = async () => {
    try {
      setLoading(true)
      setError(null)

      const userLocationInfo = await getUserLocationByIP()

      setCurrentLocationData(userLocationInfo)

      const data = await fetchCurrentWeather(
        userLocationInfo.latitude,
        userLocationInfo.longitude
      )

      setWeatherData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWeatherData()
  }, [])

  if (loading) {
    return (
      <Card className="current-weather-card">
        <CardContent className="current-weather-content">
          <Box className="loading-container">
            <CircularProgress />
            <Typography>Loading...</Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="current-weather-card">
        <CardContent className="current-weather-content">
          <Alert severity="error" className="error-alert">
            {error}
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!weatherData) {
    return (
      <Card className="current-weather-card">
        <CardContent className="current-weather-content">
          <Alert severity="warning">No data</Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="current-weather-card">
      <CardContent className="current-weather-content">
        <Typography className="current-weather-title">
          {weatherData.weatherIcon} Current Weather
        </Typography>
        <Box className="weather-info-container">
          {}
          <Typography className="weather-location">
            📍 {currentLocationData ? currentLocationData.city : 'Unknown'},
            {currentLocationData ? currentLocationData.country : 'Unknown'}
          </Typography>

          <Typography className="weather-temperature">
            🌡️ {weatherData.temperature}°C
          </Typography>

          <Typography className="weather-condition">
            {weatherData.condition}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CurrentWeather
