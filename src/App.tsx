import HomePage from './pages/HomePage'
import './App.css'
import { LocationProvider } from './context/LocationContext'

function App() {
  return (
    <LocationProvider>
      <HomePage />
    </LocationProvider>
  )
}

export default App
