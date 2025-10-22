import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode
} from 'react'
import type { UserLocationInfo } from '../types/weather.types'

interface LocationContextType {
  location: UserLocationInfo | null
  loading: boolean
  error: string | null
  refreshLocation: () => Promise<void>
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
)

interface LocationProviderProps {
  children: ReactNode
}

export const LocationProvider: React.FC<LocationProviderProps> = ({
  children
}) => {
  const [location, setLocation] = useState<UserLocationInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshLocation = async () => {
    setLoading(true)

    navigator.geolocation.getCurrentPosition(async position => {
      const { latitude, longitude } = position.coords

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        )
        const data = await res.json()
        const city =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          'Unknown'
        const country = data.address.country || 'Unknown'

        setLocation({ latitude, longitude, city, country })
        setLoading(false)
      } catch (err: any) {
        setError(err.message)
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    refreshLocation()
  }, [])

  const value: LocationContextType = {
    location,
    loading,
    error,
    refreshLocation
  }

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  )
}

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext)
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}

export default LocationContext
