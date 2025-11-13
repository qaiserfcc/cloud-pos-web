"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { useDashboardData } from "@/hooks/use-dashboard"
import { useTenantStoreSelection } from "@/hooks/use-tenant-store"
import { ProtectedRoute } from "@/components/protected-route"
import {
  Store,
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Building2,
  MapPin,
  RefreshCw
} from "lucide-react"
import { MagneticButton } from "@/components/magnetic-button"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isLoading, logout } = useAuth()
  const { data: dashboardData, loading: dashboardLoading, error: dashboardError, refetch: refetchDashboard } = useDashboardData()
  const {
    tenants,
    stores,
    selectedTenantId,
    selectedStoreId,
    selectTenant,
    selectStore,
    refreshData: refreshTenantStore,
    isSuperadmin
  } = useTenantStoreSelection()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    // If not authenticated, redirect will be handled by middleware
    // But we can add additional checks here if needed
  }, [user])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const handleRefresh = () => {
    refetchDashboard()
    refreshTenantStore()
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-foreground/20 border-t-foreground mx-auto" />
          <p className="text-foreground/70">Loading...</p>
        </div>
      </div>
    )
  }

  // Tenant/Store Selection Component
  const TenantStoreSelector = () => {
    if (!isSuperadmin && !selectedTenantId) {
      return (
        <div className="mb-6 rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="font-medium text-yellow-700 dark:text-yellow-400">Tenant Selection Required</p>
              <p className="text-sm text-yellow-600 dark:text-yellow-500">Please select a tenant to continue</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="mb-6 flex flex-wrap gap-4">
        {isSuperadmin && (
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-foreground/60" />
            <select
              value={selectedTenantId || ''}
              onChange={(e) => selectTenant(e.target.value)}
              className="rounded-lg border border-foreground/20 bg-foreground/5 px-3 py-2 text-sm focus:border-foreground/40 focus:outline-none"
            >
              <option value="">Select Tenant</option>
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {selectedTenantId && (
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-foreground/60" />
            <select
              value={selectedStoreId || ''}
              onChange={(e) => selectStore(e.target.value || null)}
              className="rounded-lg border border-foreground/20 bg-foreground/5 px-3 py-2 text-sm focus:border-foreground/40 focus:outline-none"
            >
              <option value="">All Stores</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 rounded-lg border border-foreground/20 bg-foreground/5 px-3 py-2 text-sm hover:bg-foreground/10 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>
    )
  }

  // Stats data from API or fallback to mock
  const stats = dashboardData ? [
    {
      label: 'Total Sales',
      value: `$${dashboardData.salesStats.totalRevenue.toLocaleString()}`,
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-400'
    },
    {
      label: 'Orders Today',
      value: dashboardData.salesStats.totalSales.toString(),
      change: '+8.2%',
      icon: ShoppingCart,
      color: 'text-blue-400'
    },
    {
      label: 'Avg Order Value',
      value: `$${dashboardData.salesStats.averageOrderValue.toFixed(2)}`,
      change: '+5.1%',
      icon: TrendingUp,
      color: 'text-purple-400'
    },
    {
      label: 'Top Products',
      value: dashboardData.salesStats.topProducts.length.toString(),
      change: '+2.1%',
      icon: Package,
      color: 'text-orange-400'
    }
  ] : [
    { label: 'Total Sales', value: '$12,456', change: '+12.5%', icon: DollarSign, color: 'text-green-400' },
    { label: 'Orders Today', value: '48', change: '+8.2%', icon: ShoppingCart, color: 'text-blue-400' },
    { label: 'Products', value: '324', change: '+2.1%', icon: Package, color: 'text-purple-400' },
    { label: 'Customers', value: '892', change: '+15.3%', icon: Users, color: 'text-orange-400' }
  ]

  // Recent activity from API or fallback to mock
  const recentActivity = dashboardData?.recentActivity.length ? dashboardData.recentActivity.map(activity => ({
    action: activity.type,
    description: activity.description,
    time: new Date(activity.timestamp).toLocaleString()
  })) : [
    { action: 'New order', description: 'Order #1234 placed', time: '2 min ago' },
    { action: 'Product added', description: 'Added "Wireless Mouse"', time: '15 min ago' },
    { action: 'Payment received', description: '$450 from Order #1233', time: '1 hour ago' },
    { action: 'New customer', description: 'John Doe registered', time: '2 hours ago' }
  ]

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-foreground/10 bg-foreground/5 backdrop-blur-md transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center justify-between border-b border-foreground/10 px-6">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground/15">
                  <Store className="h-5 w-5 text-foreground" />
                </div>
                <span className="text-lg font-semibold text-foreground">Cloud POS</span>
              </Link>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-foreground/70 hover:text-foreground lg:hidden"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 overflow-y-auto p-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-3 rounded-lg bg-foreground/10 px-4 py-3 text-foreground transition-colors"
              >
                <BarChart3 className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/dashboard/sales"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Sales</span>
              </Link>
              <Link
                href="/dashboard/products"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                <Package className="h-5 w-5" />
                <span>Products</span>
              </Link>
              <Link
                href="/dashboard/customers"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                <Users className="h-5 w-5" />
                <span>Customers</span>
              </Link>
              <Link
                href="/dashboard/reports"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                <TrendingUp className="h-5 w-5" />
                <span>Reports</span>
              </Link>
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Link>
            </nav>

            {/* User Profile */}
            <div className="border-t border-foreground/10 p-4">
              <div className="flex items-center gap-3 rounded-lg bg-foreground/5 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/15 text-sm font-semibold text-foreground">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="truncate text-xs text-foreground/60">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-2 flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-foreground/70 transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <header className="sticky top-0 z-40 border-b border-foreground/10 bg-foreground/5 backdrop-blur-md">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="text-foreground/70 hover:text-foreground lg:hidden"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
                  <p className="text-sm text-foreground/60">Welcome back, {user?.firstName}!</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  className="relative rounded-lg p-2 text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                  title="Notifications"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                </button>
                <button
                  className="rounded-lg p-2 text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                  title="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-6 space-y-6">
            {/* Tenant/Store Selector */}
            <TenantStoreSelector />

            {/* Error Display */}
            {dashboardError && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-red-500/20 flex items-center justify-center">
                    <span className="text-xs text-red-500">!</span>
                  </div>
                  <div>
                    <p className="font-medium text-red-700 dark:text-red-400">Failed to load dashboard data</p>
                    <p className="text-sm text-red-600 dark:text-red-500">{dashboardError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, i) => (
                <div key={i} className="rounded-lg border border-foreground/10 bg-foreground/5 p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground/60">{stat.label}</p>
                      <p className="mt-2 text-3xl font-light text-foreground">{stat.value}</p>
                      <p className={`mt-2 text-sm ${stat.color}`}>{stat.change}</p>
                    </div>
                    <div className={`rounded-full bg-foreground/10 p-3 ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Sales Chart */}
              <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6 backdrop-blur-sm">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Sales Overview</h2>
                <div className="flex h-64 items-end justify-around gap-2">
                  {[40, 65, 45, 80, 55, 70, 60].map((height, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center">
                      <div
                        className={`w-full rounded-t bg-gradient-to-t from-blue-500/50 to-blue-500/80 transition-all hover:from-blue-500/70 hover:to-blue-500`}
                        style={{ height: `${height}%` }}
                      />
                      <span className="mt-2 text-xs text-foreground/60">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6 backdrop-blur-sm">
                <h2 className="mb-4 text-lg font-semibold text-foreground">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{activity.action}</p>
                        <p className="text-xs text-foreground/60">{activity.description}</p>
                      </div>
                      <span className="text-xs text-foreground/50">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-6 backdrop-blur-sm">
              <h2 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <MagneticButton variant="secondary" className="w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  New Sale
                </MagneticButton>
                <MagneticButton variant="secondary" className="w-full">
                  <Package className="mr-2 h-4 w-4" />
                  Add Product
                </MagneticButton>
                <MagneticButton variant="secondary" className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  New Customer
                </MagneticButton>
                <MagneticButton variant="secondary" className="w-full">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Reports
                </MagneticButton>
              </div>
            </div>
          </div>
        </main>

        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  )
}
