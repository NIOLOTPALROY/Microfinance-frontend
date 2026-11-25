import axios from 'axios'
import type { AxiosResponse } from 'axios'
import apiClient from '../../../services/apiClient'
import type { AuthUser, ForgotPasswordRequest, LoginCredentials } from '../types'

export class AuthApiError extends Error {
  readonly status?: number
  readonly code?: string

  constructor(
    message: string,
    status?: number,
    code?: string,
  ) {
    super(message)
    this.name = 'AuthApiError'
    this.status = status
    this.code = code
  }
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
}

function isAuthUser(value: unknown): value is AuthUser {
  if (typeof value !== 'object' || value === null) return false
  if (!('id' in value) || typeof value.id !== 'string' || value.id.length === 0) return false
  if (!('displayName' in value) || typeof value.displayName !== 'string' || value.displayName.length === 0) return false
  if (!('roles' in value) || !isStringArray(value.roles)) return false
  if (!('permissions' in value) || !isStringArray(value.permissions)) return false
  if (!('branchIds' in value) || !isStringArray(value.branchIds)) return false
  if ('email' in value && value.email !== undefined && typeof value.email !== 'string') return false
  if ('mobile' in value && value.mobile !== undefined && typeof value.mobile !== 'string') return false
  if ('lastLoginAt' in value && value.lastLoginAt !== undefined && typeof value.lastLoginAt !== 'string') return false
  return true
}

function readUser(data: unknown): AuthUser {
  if (
    typeof data === 'object'
    && data !== null
    && 'user' in data
    && isAuthUser(data.user)
  ) {
    return data.user
  }

  throw new AuthApiError('The authentication API returned an unsupported user response. Check VITE_API_BASE_URL and the approved response contract.')
}

function assertJsonResponse(response: AxiosResponse<unknown>, operation: string) {
  const contentType = response.headers['content-type']
  if (typeof contentType !== 'string' || !contentType.toLowerCase().includes('application/json')) {
    throw new AuthApiError(`The authentication API returned an unsupported ${operation} response.`)
  }
}

function normalizeError(error: unknown): AuthApiError {
  if (error instanceof AuthApiError) return error

  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const responseData: unknown = error.response?.data
    let responseMessage: string | undefined
    let responseCode: string | undefined

    if (typeof responseData === 'object' && responseData !== null) {
      if ('message' in responseData && typeof responseData.message === 'string') {
        responseMessage = responseData.message
      }
      if ('code' in responseData && typeof responseData.code === 'string') {
        responseCode = responseData.code
      }
    }

    if (status === 401) {
      return new AuthApiError(responseMessage ?? 'The sign-in details were not accepted.', status, responseCode)
    }
    if (status === 403) {
      return new AuthApiError(responseMessage ?? 'Your account does not have access to this action.', status, responseCode)
    }
    if (status === 429) {
      return new AuthApiError(responseMessage ?? 'Too many attempts. Please wait and try again.', status, responseCode)
    }
    if (status === 404) {
      return new AuthApiError('The authentication endpoint was not found. Confirm the API base URL and approved endpoint path.', status, responseCode)
    }
    if (status !== undefined && status >= 500) {
      return new AuthApiError('The authentication service is unavailable. Please try again later.', status, responseCode)
    }
    if (status === undefined) {
      return new AuthApiError('Unable to contact the authentication service. Check your connection and try again.', undefined, error.code)
    }

    return new AuthApiError(responseMessage ?? 'The authentication request could not be completed.', status, responseCode)
  }

  return new AuthApiError('An unexpected authentication error occurred.')
}

async function request<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    throw normalizeError(error)
  }
}

const authService = {
  login(credentials: LoginCredentials): Promise<AuthUser> {
    return request(async () => {
      const response = await apiClient.post<unknown>('/api/auth/login', credentials)
      return readUser(response.data)
    })
  },

  logout(): Promise<void> {
    return request(async () => {
      const response = await apiClient.post<unknown>('/api/auth/logout')
      if (response.status !== 204) assertJsonResponse(response, 'logout')
    })
  },

  getCurrentUser(): Promise<AuthUser> {
    return request(async () => {
      const response = await apiClient.get<unknown>('/api/auth/me')
      return readUser(response.data)
    })
  },

  refreshToken(): Promise<AuthUser> {
    return request(async () => {
      const response = await apiClient.post<unknown>('/api/auth/refresh')
      return readUser(response.data)
    })
  },

  forgotPassword(payload: ForgotPasswordRequest): Promise<void> {
    return request(async () => {
      const response = await apiClient.post<unknown>('/api/auth/forgot-password', payload)
      assertJsonResponse(response, 'password recovery')
      if (
        typeof response.data !== 'object'
        || response.data === null
        || !('message' in response.data)
        || typeof response.data.message !== 'string'
      ) {
        throw new AuthApiError('The authentication API returned an unsupported password recovery response.')
      }
    })
  },
}

export function isUnauthorizedAuthError(error: unknown): boolean {
  return error instanceof AuthApiError && error.status === 401
}

export function getAuthErrorMessage(error: unknown): string {
  return error instanceof AuthApiError
    ? error.message
    : 'An unexpected authentication error occurred.'
}

export default authService
