import http from './httpClient'

export interface Store {
  id: string
  name: string
  tenantId: string
  address?: string
  phone?: string
  email?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateStoreRequest {
  name: string
  address?: string
  phone?: string
  email?: string
}

export interface UpdateStoreRequest {
  name?: string
  address?: string
  phone?: string
  email?: string
  isActive?: boolean
}

export async function getStores(): Promise<Store[]> {
  const res = await http.get('/stores')
  return res.data.data || res.data
}

export async function getStore(id: string): Promise<Store> {
  const res = await http.get(`/stores/${id}`)
  return res.data.data || res.data
}

export async function createStore(data: CreateStoreRequest): Promise<Store> {
  const res = await http.post('/stores', data)
  return res.data.data || res.data
}

export async function updateStore(id: string, data: UpdateStoreRequest): Promise<Store> {
  const res = await http.put(`/stores/${id}`, data)
  return res.data.data || res.data
}

export async function deleteStore(id: string): Promise<void> {
  await http.delete(`/stores/${id}`)
}

export default { getStores, getStore, createStore, updateStore, deleteStore }