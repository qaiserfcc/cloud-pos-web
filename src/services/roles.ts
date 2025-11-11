import http from './httpClient'

export interface Permission {
  id: string
  name: string
  description?: string
  resource: string
  action: string
}

export interface Role {
  id: string
  name: string
  description?: string
  tenantId?: string
  permissions: Permission[]
  isSystem: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateRoleRequest {
  name: string
  description?: string
  permissionIds: string[]
}

export interface UpdateRoleRequest {
  name?: string
  description?: string
  permissionIds?: string[]
}

export async function getRoles(): Promise<Role[]> {
  const res = await http.get('/roles')
  return res.data.data || res.data
}

export async function getRole(id: string): Promise<Role> {
  const res = await http.get(`/roles/${id}`)
  return res.data.data || res.data
}

export async function createRole(data: CreateRoleRequest): Promise<Role> {
  const res = await http.post('/roles', data)
  return res.data.data || res.data
}

export async function updateRole(id: string, data: UpdateRoleRequest): Promise<Role> {
  const res = await http.put(`/roles/${id}`, data)
  return res.data.data || res.data
}

export async function deleteRole(id: string): Promise<void> {
  await http.delete(`/roles/${id}`)
}

export async function getPermissions(): Promise<Permission[]> {
  const res = await http.get('/permissions')
  return res.data.data || res.data
}

export default { getRoles, getRole, createRole, updateRole, deleteRole, getPermissions }