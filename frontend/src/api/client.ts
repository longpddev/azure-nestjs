
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? location.origin
import axios from 'axios'
const client = axios.create({
  baseURL: BASE_URL
})

export default client