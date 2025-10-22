import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Typography,
  Container,
  Paper,
  Box,
  Button,
  CircularProgress,
  Alert
} from '@mui/material'
import { ArrowBack } from '@mui/icons-material'
import { fetchCurrentWeather } from '../../services/open-meteo.api'
import type { CurrentWeatherData } from '../../types/weather.types'
import './WeatherDetailsPage.css'

const WeatherDetailsPage: React.FC = () => {
  const params = useParams<{
    cityName: string
    lat: string
    lon: string
  }>()
  const navigate = useNavigate()

  const { cityName, lat, lon } = params

  const [weatherData, setWeatherData] = useState<CurrentWeatherData | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadWeatherData = async () => {
    if (!lat || !lon) {
      setError('Invalid coordinates')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const data = await fetchCurrentWeather(parseFloat(lat), parseFloat(lon))
      setWeatherData(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load weather data'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWeatherData()
  }, [lat, lon])

  const handleBackClick = () => {
    navigate('/home')
  }

  if (loading) {
    return (
      <div className="weather-details-page">
        <Container maxWidth="lg">
          <Box className="loading-container">
            <CircularProgress size={60} />
            <Typography className="loading-text">
              Loading weather details...
            </Typography>
          </Box>
        </Container>
      </div>
    )
  }

  if (error) {
    return (
      <div className="weather-details-page">
        <Container maxWidth="lg">
          <Paper className="weather-details-paper">
            <Button
              startIcon={<ArrowBack />}
              onClick={handleBackClick}
              className="back-button"
            >
              Back to Home
            </Button>
            <Alert severity="error" className="error-alert">
              {error}
            </Alert>
          </Paper>
        </Container>
      </div>
    )
  }

  if (!weatherData) {
    return (
      <div className="weather-details-page">
        <Container maxWidth="lg">
          <Paper className="weather-details-paper">
            <Button
              startIcon={<ArrowBack />}
              onClick={handleBackClick}
              className="back-button"
            >
              Back to Home
            </Button>
            <Alert severity="warning">No weather data available</Alert>
          </Paper>
        </Container>
      </div>
    )
  }

  return (
    <div className="weather-details-page">
      <Container maxWidth="lg">
        <Paper className="weather-details-paper">
          {/* Back Button */}
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBackClick}
            className="back-button"
          >
            Back to Home
          </Button>

          {/* Location Name - Large heading */}
          <Typography className="location-name">
            📍 {decodeURIComponent(cityName || 'Unknown Location')}
          </Typography>

          {/* Main Weather Content */}
          <Box className="weather-content">
            {/* Full-size Weather Icon */}
            <Box className="weather-icon-container">
              <span className="weather-icon-large">
                {weatherData.weatherIcon}
              </span>
            </Box>

            {/* Temperature - Large, centered */}
            <Typography className="temperature-large">
              {weatherData.temperature}°C
            </Typography>

            {/* Weather Condition */}
            <Typography className="weather-condition-large">
              {weatherData.condition}
            </Typography>

            {/* Additional Weather Details */}
            <Box className="weather-details-grid">
              <Box className="weather-detail-item">
                <Typography className="detail-label">💨 Wind Speed</Typography>
                <Typography className="detail-value">
                  {weatherData.windSpeed || 'N/A'} km/h
                </Typography>
              </Box>

              <Box className="weather-detail-item">
                <Typography className="detail-label">💧 Humidity</Typography>
                <Typography className="detail-value">
                  {weatherData.humidity || 'N/A'}%
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </div>
  )
}

export default WeatherDetailsPage
