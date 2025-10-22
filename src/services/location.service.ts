import type { UserLocationInfo } from '../types/weather.types'

// Get user location using browser geolocation with IP fallback
export const getUserLocation = async (): Promise<UserLocationInfo> => {
  // Try browser geolocation first
  try {
    return getBrowserLocation()
  } catch (error) {
    console.warn('Browser geolocation failed, trying IP fallback:', error)
    return getIPLocation()
  }
}

// Get location using browser's geolocation API
const getBrowserLocation = async (): Promise<UserLocationInfo> => {
  if (!navigator.geolocation) {
    throw new Error('Your browser does not support geolocation')
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      async position => {
        const { latitude, longitude } = position.coords

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
          const data = await res.json()
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            'Unknown'
          const country = data.address?.country || 'Unknown'

          resolve({ latitude, longitude, city, country })
        } catch (err) {
          reject(
            new Error(
              'Error getting address: ' +
                (err instanceof Error ? err.message : 'Unknown error')
            )
          )
        }
      },
      error => {
        reject(new Error('Geolocation error: ' + error.message))
      },
      { timeout: 10000, enableHighAccuracy: false }
    )
  })
}

// Get location using IP-based geolocation as fallback
const getIPLocation = async (): Promise<UserLocationInfo> => {
  try {
    // Try ipapi.co first
    const res = await fetch('https://ipapi.co/json/')
    const data = await res.json()

    if (data.latitude && data.longitude) {
      return {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city || 'Unknown',
        country: data.country_name || 'Unknown'
      }
    }

    throw new Error('Invalid response from IP service')
  } catch (error) {
    // Try ipgeolocation.io as secondary fallback
    try {
      const res = await fetch('https://api.ipgeolocation.io/ipgeo?apiKey=demo')
      const data = await res.json()

      if (data.latitude && data.longitude) {
        return {
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          city: data.city || 'Unknown',
          country: data.country_name || 'Unknown'
        }
      }

      throw new Error('Invalid response from secondary IP service')
    } catch (secondaryError) {
      // Final fallback to a default location (London)
      console.warn('All location services failed, using default location')
      return {
        latitude: 51.5074,
        longitude: -0.1278,
        city: 'London',
        country: 'United Kingdom'
      }
    }
  }
}
