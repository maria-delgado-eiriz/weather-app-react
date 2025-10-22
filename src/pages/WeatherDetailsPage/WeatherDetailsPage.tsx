import React from 'react'
import { Typography, Container, Paper } from '@mui/material'
import './WeatherDetailsPage.css'

const WeatherDetailsPage: React.FC = () => {
  return (
    <div className="weather-details-page">
      <Container maxWidth="md">
        <Paper 
          elevation={0}
          className="weather-details-paper"
        >
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            className="weather-details-title"
          >
            ☁️ Weather Details
          </Typography>
          <Typography 
            variant="h6" 
            className="weather-details-subtitle"
          >
            Detailed forecast information
          </Typography>
          <Typography 
            variant="body1" 
            className="weather-details-body"
          >
            Details page - Content to be implemented
          </Typography>
        </Paper>
      </Container>
    </div>
  )
}

export default WeatherDetailsPage
