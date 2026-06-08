import api from './axiosInstance'
import type { ApiResponse } from '@/lib/types/api'
import type { LoginResponse } from '@/lib/types/auth'
import type { LoginValues, RegisterValues } from '@/lib/validations/authSchema'

export const authApi = {
  login: (data: LoginValues) =>
    api.post<ApiResponse<LoginResponse>>('/auth/login', data),

  register: (data: RegisterValues) =>
    api.post<ApiResponse<unknown>>('/auth/register', {
      username: data.username,
      password: data.password,
      confirmPassword: data.confirmPassword,
      email: data.email || undefined,
    }),

  createManager: (data: { username: string; password: string; email?: string }) =>
    api.post('/auth/create-manager', data),
}
