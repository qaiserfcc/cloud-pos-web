"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Store,
  Users,
  ShoppingCart,
  BarChart3,
  Package,
  Settings,
  LogOut,
  Plus,
  TrendingUp,
  DollarSign,
  ShoppingBag
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  const handleLogout = () => {
    router.push("/")
  }

  const stats = [
    {
      title: "Total Sales",
      value: "$12,345",
      change: "+12.5%",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Orders Today",
      value: "156",
      change: "+8.2%",
      icon: ShoppingCart,
      trend: "up"
    },
    {
      title: "Active Customers",
      value: "2,847",
      change: "+5.1%",
      icon: Users,
      trend: "up"
    },
    {
      title: "Low Stock Items",
      value: "23",
      change: "-2.4%",
      icon: Package,
      trend: "down"
    }
  ]

  const recentOrders = [
    { id: "#1234", customer: "John Doe", amount: "$45.99", status: "completed", time: "2 min ago" },
    { id: "#1235", customer: "Jane Smith", amount: "$78.50", status: "processing", time: "5 min ago" },
    { id: "#1236", customer: "Bob Johnson", amount: "$23.99", status: "completed", time: "12 min ago" },
    { id: "#1237", customer: "Alice Brown", amount: "$156.00", status: "pending", time: "18 min ago" }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
              <Store className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-xl font-semibold">Cloud POS Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card/30 p-6">
          <nav className="space-y-2">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "pos", label: "Point of Sale", icon: ShoppingBag },
              { id: "inventory", label: "Inventory", icon: Package },
              { id: "customers", label: "Customers", icon: Users },
              { id: "settings", label: "Settings", icon: Settings }
            ].map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className={`text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change} from last month
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Orders */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                  <CardDescription>Latest transactions from your store</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{order.customer}</p>
                          <p className="text-xs text-muted-foreground">{order.id} • {order.time}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{order.amount}</span>
                          <Badge variant={order.status === 'completed' ? 'default' : order.status === 'processing' ? 'secondary' : 'outline'}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks to get you started</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="mr-2 h-4 w-4" />
                      New Sale
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Package className="mr-2 h-4 w-4" />
                      Add Product
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="mr-2 h-4 w-4" />
                      Add Customer
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance</CardTitle>
                    <CardDescription>Your store's performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Conversion Rate</p>
                        <p className="text-2xl font-bold">3.2%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab !== "overview" && (
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{activeTab} Module</CardTitle>
                <CardDescription>
                  This module is under development. Check back soon for full functionality.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The {activeTab} feature will be available in the next update. For now, you can explore the overview dashboard.
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}