import React, { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import {
  searchCities
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
import type { SearchResult } from '../../../../types/weather.types'

const CitySearch: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number; width: number } | null>(null)
  const searchTimeoutRef = useRef<number | null>(null)
  const searchInputRef = useRef<HTMLDivElement>(null)

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
    setSearchQuery(`${city.name}, ${city.country}`)
    setShowDropdown(false)
    
    // Navigate to weather details page
    const cityName = encodeURIComponent(`${city.name}, ${city.country}`)
    navigate(`/weather/${cityName}/${city.latitude}/${city.longitude}`)
  }

  const handleInputFocus = () => {
    if (searchResults.length > 0) {
      setShowDropdown(true)
      updateDropdownPosition()
    }
  }

  const updateDropdownPosition = () => {
    if (searchInputRef.current) {
      const rect = searchInputRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      })
    }
  }

  useEffect(() => {
    if (showDropdown && searchResults.length > 0) {
      updateDropdownPosition()
    }
  }, [showDropdown, searchResults])

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
            ref={searchInputRef}
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
          
          {showDropdown && searchResults.length > 0 && dropdownPosition && createPortal(
            <Card 
              className="dropdown-card"
              style={{
                position: 'absolute',
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                zIndex: 9999
              }}
            >
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
            </Card>,
            document.body
          )}
        </Box>

        {error && (
          <Alert severity="error" className="search-error">
            {error}
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

export default CitySearch
