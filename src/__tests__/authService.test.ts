// Mock the http client before importing the modules that use it
const mockHttp = { post: jest.fn() }
jest.mock('../services/httpClient', () => mockHttp)

const { login, logout } = require('../services/auth')

describe('auth service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('login stores token on success', async () => {
    const mockResponse = {
      success: true,
      data: {
        user: { id: '1', email: 'test@example.com' },
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        expiresIn: 3600
      }
    }
    mockHttp.post.mockResolvedValue({ data: mockResponse })
    const data = await login({ email: 'test@example.com', password: 'password' })
    expect(data.data.accessToken).toBe('access-token')
    expect(localStorage.getItem('token')).toBe('access-token')
    expect(localStorage.getItem('refreshToken')).toBe('refresh-token')
  })

  it('logout clears token', () => {
    localStorage.setItem('token', 'tk')
    localStorage.setItem('refreshToken', 'rt')
    logout()
    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('refreshToken')).toBeNull()
  })
})
