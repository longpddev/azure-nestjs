const BASE_URL = 'http://localhost:8888/'
import axios from 'axios'
const client = axios.create({
  baseURL: BASE_URL
})

export default client