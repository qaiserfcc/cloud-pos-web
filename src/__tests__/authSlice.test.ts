import authReducer, { setToken, setUser, logout } from '../store/authSlice'

describe('auth slice', () => {
  it('should set token', () => {
    const state = authReducer(undefined as any, setToken('abc'))
    expect(state.token).toBe('abc')
  })

  it('should set user', () => {
    const user = { id: '1', name: 'Alice' }
    const state = authReducer(undefined as any, setUser(user))
    expect(state.user).toEqual(user)
  })

  it('should logout', () => {
    const initial = { token: 'x', user: { id: '1' } }
    const state = authReducer(initial as any, logout())
    expect(state.token).toBeNull()
    expect(state.user).toBeNull()
  })
})
