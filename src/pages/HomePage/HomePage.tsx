import React from 'react'
import './HomePage.css'
import Grid from '@mui/material/Grid'
import FiveDayForecast from './components/FiveDayForecast'
import CitySearch from './components/CitySearch/CitySearch'
import CurrentWeather from './components/CurrentWeather'

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <Grid container spacing={2}>
        <Grid size={12}>
          <CurrentWeather />
        </Grid>
        <Grid size={12}>
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
