import qs from 'qs'
import { useLocation } from 'react-router-dom'

const tryParseInt = value => {
  const result = parseInt(value)
  return isNaN(result) ? value : result
}

const parseObjectValues = (obj = {}) => {
  Object.keys(obj).forEach(k => {
    obj[k] = tryParseInt(obj[k])
  })

  return obj
}

const useQuery = () => {
  const location = useLocation()
  const value = parseObjectValues(
    qs.parse(location.search, { ignoreQueryPrefix: true }) || {}
  )

  return value
}

export default useQuery