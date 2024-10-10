import { User } from './user'

export interface AuthResponse {
  token: string
  user: User
}

export interface ErrorResponse {
  message: string
}
