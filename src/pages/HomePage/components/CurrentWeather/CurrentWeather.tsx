import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCurrentWeather } from '../../../../services/open-meteo.api'
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button
} from '@mui/material'
import { Visibility } from '@mui/icons-material'
import './CurrentWeather.css'
import { type CurrentWeatherData } from '../../../../types/weather.types'
import { useLocation } from '../../../../context/LocationContext'

const CurrentWeather: React.FC = () => {
  const navigate = useNavigate()
  const { location, loading: locationLoading } = useLocation()

  const [weatherData, setWeatherData] = useState<CurrentWeatherData | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadWeatherData = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await fetchCurrentWeather(
        location!.latitude,
        location!.longitude
      )

      setWeatherData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log(location)
    if (location) loadWeatherData()
  }, [location])

  if (loading || locationLoading) {
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

  const handleViewDetails = () => {
    if (location) {
      const cityName = encodeURIComponent(`${location.city}, ${location.country}`)
      navigate(`/weather/${cityName}/${location.latitude}/${location.longitude}`)
    }
  }

  return (
    <Card className="current-weather-card">
      <CardContent className="current-weather-content">
        <Typography className="current-weather-title">
          {weatherData.weatherIcon} Current Weather
        </Typography>
        <Box className="weather-info-container">
          <Typography className="weather-location">
            📍 {location ? location.city : 'Unknown'},
            {location ? location.country : 'Unknown'}
          </Typography>

          <Typography className="weather-temperature">
            🌡️ {weatherData.temperature}°C
          </Typography>

          <Typography className="weather-condition">
            {weatherData.condition}
          </Typography>

          <Button
            variant="outlined"
            startIcon={<Visibility />}
            onClick={handleViewDetails}
            className="view-details-button"
            fullWidth
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CurrentWeather
