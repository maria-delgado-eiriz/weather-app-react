export const getWeatherIcon = (code: number): string => {
  if (code === 0) return '☀️'
  if (code === 1) return '🌤️'
  if (code === 2) return '⛅'
  if (code === 3) return '☁️'
  if ([45, 48].includes(code)) return '🌫️'
  if ([51, 53, 55, 56, 57].includes(code)) return '🌦️'
  if ([61, 63, 65, 66, 67].includes(code)) return '🌧️'
  if ([71, 73, 75, 77, 80, 81, 82].includes(code)) return '🌨️'
  if ([85, 86].includes(code)) return '❄️'
  if ([95, 96, 99].includes(code)) return '⛈️'
  return '❓' // Default for unknown codes
}
