import React from 'react'
import './HomePage.css'
import Grid from '@mui/material/Grid'
import CurrentWeather from './components/CurrentWeather'
import FiveDayForecast from './components/FiveDayForecast'
import CitySearch from './components/CitySearch'

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <Grid container spacing={2}>
        <Grid size={6}>
          <CurrentWeather />
        </Grid>
        <Grid size={6}>
          <FiveDayForecast />
        </Grid>
        <Grid size={12}>
          <CitySearch />
        </Grid>
      </Grid>
    </div>
  )
}

export default HomePage
