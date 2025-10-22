import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import WeatherDetailsPage from './pages/WeatherDetailsPage'
import { LocationProvider } from './context/LocationContext'
import './App.css'

function App() {
  return (
    <LocationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/weather/:cityName/:lat/:lon" element={<WeatherDetailsPage />} />
        </Routes>
      </Router>
    </LocationProvider>
  )
}

export default App
