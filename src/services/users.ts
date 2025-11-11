import http from './httpClient'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  roleId: string
  tenantId?: string
  storeId?: string
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateUserRequest {
  email: string
  firstName: string
  lastName: string
  roleId: string
  tenantId?: string
  storeId?: string
  password: string
}

export interface UpdateUserRequest {
  email?: string
  firstName?: string
  lastName?: string
  roleId?: string
  tenantId?: string
  storeId?: string
  isActive?: boolean
}

export async function getUsers(): Promise<User[]> {
  const res = await http.get('/users')
  return res.data.data || res.data
}

export async function getUser(id: string): Promise<User> {
  const res = await http.get(`/users/${id}`)
  return res.data.data || res.data
}

export async function createUser(data: CreateUserRequest): Promise<User> {
  const res = await http.post('/users', data)
  return res.data.data || res.data
}

export async function updateUser(id: string, data: UpdateUserRequest): Promise<User> {
  const res = await http.put(`/users/${id}`, data)
  return res.data.data || res.data
}

export async function deleteUser(id: string): Promise<void> {
  await http.delete(`/users/${id}`)
}

export default { getUsers, getUser, createUser, updateUser, deleteUser }