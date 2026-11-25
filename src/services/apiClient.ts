import axios from 'axios'

export const AUTH_SESSION_EXPIRED_EVENT = 'doortodoor:auth-session-expired'

const endpointsWithoutSessionExpirySignal = [
  '/auth/login',
  '/auth/me',
  '/auth/forgot-password',
]

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || undefined,
  withCredentials: true,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const requestUrl = error.config?.url ?? ''
      const shouldSignalExpiry = !endpointsWithoutSessionExpirySignal.some((endpoint) => requestUrl.includes(endpoint))
      if (shouldSignalExpiry && typeof window !== 'undefined') {
        window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT))
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
