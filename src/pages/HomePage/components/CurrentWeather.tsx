import React, { useEffect } from 'react'
import { fetchCurrentWeather } from '../../../services/open-mateo.api'

const CurrentWeather: React.FC = () => {
  const prueba = async () => {
    console.log('aqui')
    await fetchCurrentWeather()
  }
  useEffect(() => {
    prueba()
  }, [])
  return <></>
}

export default CurrentWeather
