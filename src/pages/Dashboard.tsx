import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../store/authSlice'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import {
  CreditCard,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  BarChart3,
  PieChart,
  Calendar,
  Search,
  Filter,
  Download,
  Plus,
  Bell,
  Settings,
  LogOut,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Clock,
  AlertTriangle,
  CheckCircle,
  Zap,
  Bug,
  Activity,
  Target
} from 'lucide-react'
import type { RootState, AppDispatch } from '../store'

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    setMounted(true)
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken')
    if (!authToken) {
      navigate('/login')
    }

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [navigate])

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
    localStorage.removeItem('roles')
    localStorage.removeItem('permissions')
    navigate('/login')
  }

  if (!mounted) {
    return null
  }

  const stats = [
    {
      title: "Today's Revenue",
      value: "$2,847.50",
      change: "+12.3%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Total Transactions",
      value: "1,247",
      change: "+8.1%",
      trend: "up",
      icon: CreditCard,
      color: "text-blue-600"
    },
    {
      title: "Products Sold",
      value: "892",
      change: "+15.2%",
      trend: "up",
      icon: Package,
      color: "text-purple-600"
    },
    {
      title: "Active Customers",
      value: "3,456",
      change: "+5.7%",
      trend: "up",
      icon: Users,
      color: "text-orange-600"
    }
  ]

  const topProducts = [
    { name: "Premium Coffee Beans", sales: 89, revenue: 1247.50, trend: "up" },
    { name: "Wireless Headphones", sales: 67, revenue: 3345.00, trend: "up" },
    { name: "Organic Tea Set", sales: 45, revenue: 675.00, trend: "down" },
    { name: "Smart Watch", sales: 34, revenue: 6799.00, trend: "up" },
    { name: "Bluetooth Speaker", sales: 28, revenue: 1399.00, trend: "up" }
  ]

  const quickActions = [
    { icon: Users, label: "Manage Users", color: "bg-blue-600 text-white", action: () => navigate('/users') },
    { icon: Package, label: "Manage Stores", color: "bg-green-600 text-white", action: () => navigate('/stores') },
    { icon: CreditCard, label: "Manage Tenants", color: "bg-purple-600 text-white", action: () => navigate('/tenants') },
    { icon: Settings, label: "Manage Roles", color: "bg-orange-600 text-white", action: () => navigate('/roles') },
    { icon: BarChart3, label: "View Reports", color: "bg-indigo-600 text-white", action: () => {} }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <CreditCard className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Cloud POS</span>
            </div>

            <div className="hidden md:flex items-center space-x-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{currentTime.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 w-64 text-sm bg-muted/50 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>

            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Here's what's happening with your business today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                    {stat.change}
                  </span>
                  {' '}from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={action.action}
                className={`h-20 flex flex-col items-center justify-center space-y-2 ${action.color}`}
                variant="default"
              >
                <action.icon className="h-6 w-6" />
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>
                Your best-selling products this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.sales} sales • ${product.revenue.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {product.trend === 'up' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest transactions and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sale completed</p>
                    <p className="text-xs text-muted-foreground">
                      Transaction #12345 • $127.50
                    </p>
                    <p className="text-xs text-muted-foreground">2 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New customer registered</p>
                    <p className="text-xs text-muted-foreground">
                      john.doe@example.com
                    </p>
                    <p className="text-xs text-muted-foreground">15 minutes ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Low stock alert</p>
                    <p className="text-xs text-muted-foreground">
                      Premium Coffee Beans (5 remaining)
                    </p>
                    <p className="text-xs text-muted-foreground">1 hour ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
