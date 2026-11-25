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

function readUser(data: unknown): AuthUser {
  if (typeof data !== 'object' || data === null || !('user' in data)) {
    throw new AuthApiError('The authentication API returned an unsupported user response.')
  }

  const user: unknown = data.user
  if (
    typeof user !== 'object'
    || user === null
    || !('id' in user)
    || typeof user.id !== 'string'
    || user.id.length === 0
    || !('name' in user)
    || typeof user.name !== 'string'
    || user.name.length === 0
    || !('role' in user)
    || typeof user.role !== 'string'
    || !('permissions' in user)
    || !isStringArray(user.permissions)
  ) {
    throw new AuthApiError('The authentication API returned an unsupported user response.')
  }

  const email = 'email' in user && typeof user.email === 'string' ? user.email : undefined

  return {
    id: user.id,
    displayName: user.name,
    ...(email === undefined ? {} : { email }),
    roles: [user.role],
    permissions: user.permissions,
    branchIds: [],
  }
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string')
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
      } else if ('error' in responseData && typeof responseData.error === 'string') {
        responseMessage = responseData.error
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
      const response = await apiClient.post<unknown>('/auth/login', credentials)
      return readUser(response.data)
    })
  },

  logout(): Promise<void> {
    return request(async () => {
      const response = await apiClient.post<unknown>('/auth/logout')
      if (response.status !== 204) assertJsonResponse(response, 'logout')
    })
  },

  getCurrentUser(): Promise<AuthUser> {
    return request(async () => {
      const response = await apiClient.get<unknown>('/auth/me')
      return readUser(response.data)
    })
  },

  refreshToken(): Promise<AuthUser> {
    return Promise.reject(new AuthApiError('Session refresh is not available yet.'))
  },

  forgotPassword(_payload: ForgotPasswordRequest): Promise<void> {
    void _payload
    return Promise.reject(new AuthApiError('Password recovery is not available yet.'))
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
