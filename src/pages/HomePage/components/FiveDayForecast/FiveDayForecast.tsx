import React, { useEffect, useState } from 'react'
import {
  fetchFiveDayForecast,
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
import './FiveDayForecast.css'
import type { FiveDayForecastData } from '../../../../types/weather.types'

const FiveDayForecast: React.FC = () => {
  const [forecastData, setForecastData] = useState<FiveDayForecastData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadForecastData = async () => {
    try {
      setLoading(true)
      setError(null)

      const userLocationInfo = await getUserLocationByIP()

      const data = await fetchFiveDayForecast(
        userLocationInfo.latitude,
        userLocationInfo.longitude
      )

      setForecastData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadForecastData()
  }, [])

  if (loading) {
    return (
      <Card className="forecast-card">
        <CardContent className="forecast-content">
          <Box className="loading-container">
            <CircularProgress />
            <Typography>Loading forecast...</Typography>
          </Box>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="forecast-card">
        <CardContent className="forecast-content">
          <Alert severity="error" className="error-alert">
            {error}
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!forecastData) {
    return (
      <Card className="forecast-card">
        <CardContent className="forecast-content">
          <Alert severity="warning">No forecast data</Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="forecast-card">
      <CardContent className="forecast-content">
        <Typography className="forecast-title">
          📅 5-Day Forecast
        </Typography>
        
        <Box className="forecast-container">
          {forecastData.forecast.map((day, index) => (
            <Box key={index} className="forecast-day">
              <Typography className="forecast-date">
                {day.date}
              </Typography>
              
              <Typography className="forecast-icon">
                {day.weatherIcon}
              </Typography>
              
              <Typography className="forecast-condition">
                {day.condition}
              </Typography>
              
              <Box className="forecast-temps">
                <Typography className="forecast-high">
                  {day.highTemp}°
                </Typography>
                <Typography className="forecast-low">
                  {day.lowTemp}°
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  )
}

export default FiveDayForecast
