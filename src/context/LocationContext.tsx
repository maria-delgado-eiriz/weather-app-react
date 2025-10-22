import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode
} from 'react'
import { getUserLocation } from '../services/location.service'
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
    try {
      setLoading(true)
      setError(null)
      
      const locationData = await getUserLocation()
      setLocation(locationData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location')
    } finally {
      setLoading(false)
    }
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
