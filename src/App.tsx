import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Box,
  ThemeProvider,
  createTheme
} from '@mui/material'
import { Home, CloudQueue } from '@mui/icons-material'
import HomePage from './pages/HomePage'
import WeatherDetails from './pages/WeatherDetailsPage'
import './App.css'

type Screen = 'home' | 'details'

const theme = createTheme({
  palette: {
    primary: {
      main: '#0984e3'
    },
    secondary: {
      main: '#74b9ff'
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: 'rgba(255, 255, 255, 0.8)',
          fontWeight: 500,
          fontSize: '1rem',
          textTransform: 'none',
          '&.Mui-selected': {
            color: '#ffffff',
            fontWeight: 600
          }
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: '#ffffff',
          height: 3,
          borderRadius: '2px'
        }
      }
    }
  }
})

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home')

  const handleTabChange = (_event: React.SyntheticEvent, newValue: Screen) => {
    setCurrentScreen(newValue)
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <HomePage />
      case 'details':
        return <WeatherDetails />
      default:
        return <HomePage />
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box className="app-container">
        <AppBar position="sticky" elevation={0}>
          <Toolbar>
            <Box className="toolbar-container">
              <Tabs
                value={currentScreen}
                onChange={handleTabChange}
                centered
                className="tabs-container"
              >
                <Tab
                  icon={<Home />}
                  label="Home"
                  value="home"
                  iconPosition="start"
                  className="tab-item"
                />
                <Tab
                  icon={<CloudQueue />}
                  label="Weather Details"
                  value="details"
                  iconPosition="start"
                  className="tab-item"
                />
              </Tabs>
            </Box>
          </Toolbar>
        </AppBar>

        <Box component="main" className="main-content">
          {renderScreen()}
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
