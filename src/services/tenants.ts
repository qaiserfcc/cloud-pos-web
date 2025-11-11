import http from './httpClient'

export interface Tenant {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTenantRequest {
  name: string
  description?: string
}

export interface UpdateTenantRequest {
  name?: string
  description?: string
}

export async function getTenants(): Promise<Tenant[]> {
  const res = await http.get('/tenants')
  return res.data.data || res.data
}

export async function getTenant(id: string): Promise<Tenant> {
  const res = await http.get(`/tenants/${id}`)
  return res.data.data || res.data
}

export async function createTenant(data: CreateTenantRequest): Promise<Tenant> {
  const res = await http.post('/tenants', data)
  return res.data.data || res.data
}

export async function updateTenant(id: string, data: UpdateTenantRequest): Promise<Tenant> {
  const res = await http.put(`/tenants/${id}`, data)
  return res.data.data || res.data
}

export async function deleteTenant(id: string): Promise<void> {
  await http.delete(`/tenants/${id}`)
}

export default { getTenants, getTenant, createTenant, updateTenant, deleteTenant }