import React, { useState, useCallback, useRef } from 'react'
import {
  searchCities,
  fetchCurrentWeather
} from '../../../../services/open-meteo.api'
import {
  Card,
  CardContent,
  TextField,
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material'
import { Search, LocationOn, People } from '@mui/icons-material'
import './CitySearch.css'
import type { SearchResult, CurrentWeatherData } from '../../../../types/weather.types'

const CitySearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedCity, setSelectedCity] = useState<SearchResult | null>(null)
  const [weatherData, setWeatherData] = useState<CurrentWeatherData | null>(null)
  const searchTimeoutRef = useRef<number | null>(null)

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const data = await searchCities(query)
      setSearchResults(data.results)
      setShowDropdown(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed')
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const debouncedSearch = useCallback((query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    searchTimeoutRef.current = window.setTimeout(() => {
      handleSearch(query)
    }, 500) // 500ms delay
  }, [handleSearch])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchQuery(value)
    debouncedSearch(value)
  }

  const handleCitySelect = async (city: SearchResult) => {
    setSelectedCity(city)
    setSearchQuery(`${city.name}, ${city.country}`)
    setShowDropdown(false)
    
    try {
      setLoading(true)
      const weather = await fetchCurrentWeather(city.latitude, city.longitude)
      setWeatherData(weather)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather')
    } finally {
      setLoading(false)
    }
  }

  const handleInputFocus = () => {
    if (searchResults.length > 0) {
      setShowDropdown(true)
    }
  }

  const handleInputBlur = () => {
    // Delay hiding dropdown to allow for clicks
    window.setTimeout(() => setShowDropdown(false), 200)
  }

  const formatPopulation = (population?: number) => {
    if (!population) return ''
    if (population >= 1000000) {
      return `${(population / 1000000).toFixed(1)}M`
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(0)}K`
    }
    return population.toString()
  }

  return (
    <Card className="city-search-card">
      <CardContent className="city-search-content">
        <Typography className="city-search-title">
          🔍 Search Cities
        </Typography>
        
        <Box className="search-container">
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            className="search-input"
            InputProps={{
              startAdornment: <Search className="search-icon" />,
              endAdornment: loading && <CircularProgress size={20} />
            }}
          />
          
          {showDropdown && searchResults.length > 0 && (
            <Card className="dropdown-card">
              <List className="dropdown-list">
                {searchResults.map((city) => (
                  <ListItem key={city.id} disablePadding>
                    <ListItemButton 
                      onClick={() => handleCitySelect(city)}
                      className="dropdown-item"
                    >
                      <ListItemText
                        primary={
                          <Box className="city-primary-info">
                            <Typography className="city-name">
                              {city.name}
                            </Typography>
                            <Box className="city-chips">
                              <Chip 
                                size="small" 
                                label={city.country} 
                                className="country-chip"
                              />
                              {city.admin1 && (
                                <Chip 
                                  size="small" 
                                  label={city.admin1} 
                                  className="state-chip"
                                />
                              )}
                            </Box>
                          </Box>
                        }
                        secondary={
                          <Box className="city-secondary-info">
                            <Typography className="coordinates">
                              <LocationOn className="location-icon" />
                              {city.latitude.toFixed(2)}, {city.longitude.toFixed(2)}
                            </Typography>
                            {city.population && (
                              <Typography className="population">
                                <People className="people-icon" />
                                {formatPopulation(city.population)}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Card>
          )}
        </Box>

        {error && (
          <Alert severity="error" className="search-error">
            {error}
          </Alert>
        )}

        {selectedCity && weatherData && (
          <Card className="selected-city-weather">
            <CardContent>
              <Typography className="selected-city-title">
                🌤️ Weather in {selectedCity.name}
              </Typography>
              <Box className="weather-summary">
                <Typography className="weather-temp">
                  {weatherData.weatherIcon} {weatherData.temperature}°C
                </Typography>
                <Typography className="weather-condition">
                  {weatherData.condition}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}

export default CitySearch
