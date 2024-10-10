'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react'
import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import { baseUrl } from '@/utils/Endpoints'
import { User } from '@/interfaces/user'
import { RegisterData, LoginData } from '@/interfaces/auth-data'
import { ErrorResponse, AuthResponse } from '@/interfaces/auth-response'
import { useRouter } from 'next/navigation'

axios.defaults.baseURL = baseUrl

interface AuthContextType {
  user: User | null
  login: (loginData: LoginData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  register: (
    userData: RegisterData,
  ) => Promise<{ success: boolean; error?: string }>
  getToken: () => string | undefined
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = Cookies.get('token')
    if (token) {
      axios
        .post<{ user: User; token: string }>(
          '/auth/refresh',
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Access-Control-Allow-Origin': '*',
            },
          },
        )
        .then((response) => {
          setUser(response.data.user)
          Cookies.set('token', response.data.token, { expires: 7 })
        })
        .catch(() => {
          Cookies.remove('token')
          setUser(null)
          router.push('/auth/login')
        })
    }
  }, [router])

  const login = useCallback(
    async (
      loginData: LoginData,
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const response = await axios.post<AuthResponse>(
          '/auth/login',
          loginData,
        )
        const { token, user } = response.data
        Cookies.set('token', token, { expires: 7 })
        setUser(user)
        router.push('/filmes')
        return { success: true }
      } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        return {
          success: false,
          error: err.response?.data?.message || 'Login falhou!',
        }
      }
    },
    [router],
  )

  const logout = useCallback((): void => {
    Cookies.remove('token')
    setUser(null)
    router.push('/auth/login')
  }, [router])

  const register = useCallback(
    async (
      userData: RegisterData,
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const response = await axios.post<AuthResponse>(
          '/auth/register',
          userData,
        )
        const { token, user } = response.data
        Cookies.set('token', token, { expires: 7 })
        setUser(user)
        router.push('/filmes')

        return { success: true }
      } catch (error) {
        const err = error as AxiosError<ErrorResponse>
        return {
          success: false,
          error: err.response?.data?.message || 'Registro falhou!',
        }
      }
    },
    [router],
  )

  const getToken = () => Cookies.get('token')

  return (
    <AuthContext.Provider value={{ user, login, logout, register, getToken }}>
      {children}
    </AuthContext.Provider>
  )
}
