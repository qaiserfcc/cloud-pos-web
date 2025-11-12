"use client"

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  Users,
  Store,
  DollarSign,
  TrendingUp,
  Activity,
  Settings,
  Shield,
  Database,
  BarChart3,
  PieChart,
  LineChart,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Filter,
  Search,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalTenants: number
  activeTenants: number
  totalStores: number
  activeStores: number
  totalRevenue: number
  monthlyRevenue: number
  systemHealth: number
  activeSessions: number
}

interface User {
  id: string
  name: string
  email: string
  role: string
  tenant: string
  status: 'active' | 'inactive' | 'suspended'
  lastLogin: string
  createdAt: string
}

interface Tenant {
  id: string
  name: string
  admin: string
  stores: number
  users: number
  status: 'active' | 'inactive'
  revenue: number
  createdAt: string
}

interface SystemAlert {
  id: string
  type: 'error' | 'warning' | 'info'
  message: string
  timestamp: string
  resolved: boolean
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1247,
    activeUsers: 892,
    totalTenants: 45,
    activeTenants: 38,
    totalStores: 156,
    activeStores: 142,
    totalRevenue: 2456789,
    monthlyRevenue: 234567,
    systemHealth: 98.5,
    activeSessions: 234
  })

  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'SuperAdmin',
      tenant: 'System',
      status: 'active',
      lastLogin: '2024-01-15 10:30',
      createdAt: '2023-06-15'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@tenant1.com',
      role: 'Tenant Admin',
      tenant: 'Tenant 1',
      status: 'active',
      lastLogin: '2024-01-15 09:15',
      createdAt: '2023-08-20'
    },
    {
      id: '3',
      name: 'Bob Johnson',
      email: 'bob@store1.com',
      role: 'Store Manager',
      tenant: 'Tenant 1',
      status: 'active',
      lastLogin: '2024-01-14 16:45',
      createdAt: '2023-09-10'
    }
  ])

  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: '1',
      name: 'TechCorp Solutions',
      admin: 'John Doe',
      stores: 12,
      users: 45,
      status: 'active',
      revenue: 125000,
      createdAt: '2023-06-15'
    },
    {
      id: '2',
      name: 'RetailPlus',
      admin: 'Jane Smith',
      stores: 8,
      users: 32,
      status: 'active',
      revenue: 89000,
      createdAt: '2023-08-20'
    }
  ])

  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: '1',
      type: 'warning',
      message: 'High memory usage detected on server-2',
      timestamp: '2024-01-15 11:30',
      resolved: false
    },
    {
      id: '2',
      type: 'info',
      message: 'Scheduled maintenance completed successfully',
      timestamp: '2024-01-15 08:00',
      resolved: true
    }
  ])

  const [currentSection, setCurrentSection] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const scrollThrottleRef = useRef<number | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  const sections = [
    { id: 'overview', title: 'System Overview', icon: BarChart3 },
    { id: 'users', title: 'User Management', icon: Users },
    { id: 'tenants', title: 'Tenant Management', icon: Store },
    { id: 'analytics', title: 'Analytics & Reports', icon: TrendingUp },
    { id: 'system', title: 'System Health', icon: Activity },
    { id: 'settings', title: 'System Settings', icon: Settings }
  ]

  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      const sectionWidth = scrollContainerRef.current.offsetWidth / sections.length
      scrollContainerRef.current.scrollTo({
        left: sectionWidth * index,
        behavior: "smooth",
      })
      setCurrentSection(index)
    }
  }

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()

        if (!scrollContainerRef.current) return

        scrollContainerRef.current.scrollBy({
          left: e.deltaY,
          behavior: "instant",
        })

        const sectionWidth = scrollContainerRef.current.offsetWidth / sections.length
        const newSection = Math.round(scrollContainerRef.current.scrollLeft / sectionWidth)
        if (newSection !== currentSection) {
          setCurrentSection(newSection)
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel)
      }
    }
  }, [currentSection, sections.length])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollThrottleRef.current) return

      scrollThrottleRef.current = requestAnimationFrame(() => {
        if (!scrollContainerRef.current) {
          scrollThrottleRef.current = undefined
          return
        }

        const sectionWidth = scrollContainerRef.current.offsetWidth / sections.length
        const scrollLeft = scrollContainerRef.current.scrollLeft
        const newSection = Math.round(scrollLeft / sectionWidth)

        if (newSection !== currentSection && newSection >= 0 && newSection < sections.length) {
          setCurrentSection(newSection)
        }

        scrollThrottleRef.current = undefined
      })
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
      if (scrollThrottleRef.current) {
        cancelAnimationFrame(scrollThrottleRef.current)
      }
    }
  }, [currentSection, sections.length])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const StatCard = ({ title, value, change, icon: Icon, color }: {
    title: string
    value: string | number
    change?: string
    icon: any
    color: string
  }) => (
    <Card className="w-64 h-32 flex-shrink-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className="text-xs text-muted-foreground">
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  )

  const renderOverviewSection = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Cloud POS Admin Dashboard</h1>
        <p className="text-xl text-muted-foreground">System Overview & Management</p>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          change="+12% from last month"
          icon={Users}
          color="text-blue-600"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers.toLocaleString()}
          change="71.5% of total"
          icon={UserCheck}
          color="text-green-600"
        />
        <StatCard
          title="Total Tenants"
          value={stats.totalTenants}
          change="84.4% active"
          icon={Store}
          color="text-purple-600"
        />
        <StatCard
          title="Total Revenue"
          value={`$${(stats.totalRevenue / 1000).toFixed(0)}K`}
          change="+8.2% from last month"
          icon={DollarSign}
          color="text-yellow-600"
        />
        <StatCard
          title="System Health"
          value={`${stats.systemHealth}%`}
          change="Excellent"
          icon={Activity}
          color="text-green-600"
        />
        <StatCard
          title="Active Sessions"
          value={stats.activeSessions}
          change="Real-time"
          icon={Shield}
          color="text-orange-600"
        />
      </div>

      <div className="grid grid-cols-2 gap-8 w-full max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              User Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">SuperAdmins</span>
                <div className="flex items-center gap-2">
                  <Progress value={2} className="w-20" />
                  <span className="text-sm font-medium">2</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Tenant Admins</span>
                <div className="flex items-center gap-2">
                  <Progress value={15} className="w-20" />
                  <span className="text-sm font-medium">45</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Store Managers</span>
                <div className="flex items-center gap-2">
                  <Progress value={35} className="w-20" />
                  <span className="text-sm font-medium">156</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Regular Users</span>
                <div className="flex items-center gap-2">
                  <Progress value={48} className="w-20" />
                  <span className="text-sm font-medium">1044</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">This Month</span>
                <span className="font-medium">${(stats.monthlyRevenue / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Last Month</span>
                <span className="font-medium">$198K</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Growth</span>
                <Badge variant="secondary" className="text-green-600">+18.2%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Target</span>
                <span className="font-medium">$300K</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderUsersSection = () => (
    <div className="min-h-screen flex flex-col p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">User Management</h1>
        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="SuperAdmin">SuperAdmin</SelectItem>
              <SelectItem value="Tenant Admin">Tenant Admin</SelectItem>
              <SelectItem value="Store Manager">Store Manager</SelectItem>
              <SelectItem value="User">User</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage system users and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Tenant</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'SuperAdmin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.tenant}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === 'active' ? 'default' :
                        user.status === 'inactive' ? 'secondary' : 'destructive'
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )

  const renderTenantsSection = () => (
    <div className="min-h-screen flex flex-col p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Tenant Management</h1>
        <div className="flex gap-4 mb-6">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Tenant
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {tenants.map((tenant) => (
          <Card key={tenant.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {tenant.name}
                    <Badge variant={tenant.status === 'active' ? 'default' : 'secondary'}>
                      {tenant.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>Admin: {tenant.admin}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{tenant.stores}</div>
                  <div className="text-sm text-muted-foreground">Stores</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{tenant.users}</div>
                  <div className="text-sm text-muted-foreground">Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">${(tenant.revenue / 1000).toFixed(0)}K</div>
                  <div className="text-sm text-muted-foreground">Revenue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{tenant.createdAt}</div>
                  <div className="text-sm text-muted-foreground">Created</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderAnalyticsSection = () => (
    <div className="min-h-screen flex flex-col p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Analytics & Reports</h1>
        <div className="flex gap-4 mb-6">
          <Select defaultValue="30days">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="1year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="revenue" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$2.4M</div>
                <p className="text-sm text-muted-foreground">+12% from last period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$87.50</div>
                <p className="text-sm text-muted-foreground">+5% from last period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3.2%</div>
                <p className="text-sm text-muted-foreground">+0.8% from last period</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">892</div>
                <p className="text-sm text-muted-foreground">71.5% of total users</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>New Registrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">127</div>
                <p className="text-sm text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">84.3%</div>
                <p className="text-sm text-muted-foreground">30-day retention</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>CPU Usage</span>
                  <span>45%</span>
                </div>
                <Progress value={45} />
                <div className="flex justify-between">
                  <span>Memory Usage</span>
                  <span>67%</span>
                </div>
                <Progress value={67} />
                <div className="flex justify-between">
                  <span>Disk Usage</span>
                  <span>23%</span>
                </div>
                <Progress value={23} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>API Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Average Response Time</span>
                  <span>120ms</span>
                </div>
                <div className="flex justify-between">
                  <span>99th Percentile</span>
                  <span>450ms</span>
                </div>
                <div className="flex justify-between">
                  <span>Error Rate</span>
                  <span>0.02%</span>
                </div>
                <div className="flex justify-between">
                  <span>Requests/min</span>
                  <span>12,450</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Password Policy</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Two-Factor Auth</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Data Encryption</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Audit Logging</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Data Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>GDPR Compliance</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Data Retention</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span>User Consent</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex items-center justify-between">
                  <span>Privacy Policy</span>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderSystemSection = () => (
    <div className="min-h-screen flex flex-col p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">System Health & Monitoring</h1>
        <div className="flex gap-4 mb-6">
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            System Logs
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Overall Health</span>
              <Badge variant="secondary" className="text-green-600">Excellent</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Database</span>
              <Badge variant="secondary" className="text-green-600">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>API Services</span>
              <Badge variant="secondary" className="text-green-600">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Sync Services</span>
              <Badge variant="secondary" className="text-yellow-600">Warning</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Connections</span>
              <span>45/100</span>
            </div>
            <Progress value={45} />
            <div className="flex justify-between">
              <span>Query Performance</span>
              <span>98.5%</span>
            </div>
            <Progress value={98.5} />
            <div className="flex justify-between">
              <span>Storage Used</span>
              <span>2.4GB/10GB</span>
            </div>
            <Progress value={24} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Alerts</CardTitle>
          <CardDescription>Recent system notifications and issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Alert key={alert.id} className={
                alert.type === 'error' ? 'border-red-200' :
                alert.type === 'warning' ? 'border-yellow-200' : 'border-blue-200'
              }>
                <div className="flex items-center gap-2">
                  {alert.type === 'error' && <XCircle className="h-4 w-4 text-red-600" />}
                  {alert.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                  {alert.type === 'info' && <CheckCircle className="h-4 w-4 text-blue-600" />}
                  <AlertDescription className="flex-1">
                    {alert.message}
                  </AlertDescription>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{alert.timestamp}</span>
                    {!alert.resolved && (
                      <Button variant="ghost" size="sm">
                        Resolve
                      </Button>
                    )}
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderSettingsSection = () => (
    <div className="min-h-screen flex flex-col p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">System Settings</h1>
        <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic system configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="system-name">System Name</Label>
                  <Input id="system-name" defaultValue="Cloud POS" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time</SelectItem>
                      <SelectItem value="pst">Pacific Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">System Description</Label>
                <Input id="description" defaultValue="Multi-tenant Point of Sale system" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure authentication and security policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Password Policy</Label>
                    <p className="text-sm text-muted-foreground">Minimum 8 characters, special characters required</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">Auto-logout after 30 minutes of inactivity</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Third-party Integrations</CardTitle>
              <CardDescription>Connect with external services and APIs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Payment Gateway</Label>
                    <p className="text-sm text-muted-foreground">Stripe integration for payments</p>
                  </div>
                  <Badge variant="secondary">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Service</Label>
                    <p className="text-sm text-muted-foreground">SendGrid for notifications</p>
                  </div>
                  <Badge variant="secondary">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Analytics</Label>
                    <p className="text-sm text-muted-foreground">Google Analytics integration</p>
                  </div>
                  <Button variant="outline">Connect</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Settings</CardTitle>
              <CardDescription>System maintenance and backup configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Automatic Backups</Label>
                    <p className="text-sm text-muted-foreground">Daily backups at 2:00 AM</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Log Rotation</Label>
                    <p className="text-sm text-muted-foreground">Rotate logs weekly</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Cache Management</Label>
                    <p className="text-sm text-muted-foreground">Clear cache and restart services</p>
                  </div>
                  <Button variant="outline">Clear Cache</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 0: return renderOverviewSection()
      case 1: return renderUsersSection()
      case 2: return renderTenantsSection()
      case 3: return renderAnalyticsSection()
      case 4: return renderSystemSection()
      case 5: return renderSettingsSection()
      default: return renderOverviewSection()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">Cloud POS Admin</h1>
            <Badge variant="secondary">SuperAdmin</Badge>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="fixed left-0 top-20 bottom-0 w-64 bg-background/80 backdrop-blur-sm border-r p-4">
        <div className="space-y-2">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <Button
                key={section.id}
                variant={currentSection === index ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => scrollToSection(index)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {section.title}
              </Button>
            )
          })}
        </div>
      </nav>

      {/* Main Content */}
      <main
        ref={scrollContainerRef}
        className="ml-64 mt-20 overflow-x-auto overflow-y-hidden"
        style={{
          width: 'calc(100vw - 256px)',
          height: 'calc(100vh - 80px)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <div
          className="flex h-full"
          style={{
            width: `${sections.length * 100}vw`,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {sections.map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 h-full"
              style={{
                width: 'calc(100vw - 256px)',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              {renderCurrentSection()}
            </div>
          ))}
        </div>

        <style jsx>{`
          main::-webkit-scrollbar,
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </main>

      {/* Navigation Arrows */}
      <div className="fixed bottom-8 right-8 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => scrollToSection(Math.max(0, currentSection - 1))}
          disabled={currentSection === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => scrollToSection(Math.min(sections.length - 1, currentSection + 1))}
          disabled={currentSection === sections.length - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Section Indicator */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {sections.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentSection === index ? 'bg-primary' : 'bg-muted'
            }`}
            onClick={() => scrollToSection(index)}
            title={`Go to ${sections[index].title} section`}
          />
        ))}
      </div>
    </div>
  )
}