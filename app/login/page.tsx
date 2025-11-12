"use client"

import { useState, useEffect, useRef } from "react"
import { Shader, ChromaFlow, Swirl } from "shaders/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, Eye, EyeOff, Shield, Building, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const shaderContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkShaderReady = () => {
      if (shaderContainerRef.current) {
        const canvas = shaderContainerRef.current.querySelector("canvas")
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          setIsLoaded(true)
          return true
        }
      }
      return false
    }

    if (checkShaderReady()) return

    const intervalId = setInterval(() => {
      if (checkShaderReady()) {
        clearInterval(intervalId)
      }
    }, 100)

    const fallbackTimer = setTimeout(() => {
      setIsLoaded(true)
    }, 1500)

    return () => {
      clearInterval(intervalId)
      clearTimeout(fallbackTimer)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate login - replace with actual authentication
      await new Promise(resolve => setTimeout(resolve, 1000))

      const validCredentials = [
        { email: "superadmin@cloudpos.com", password: "super123", redirect: "/admin", role: "Super Admin" },
        { email: "tenantadmin@cloudpos.com", password: "tenant123", redirect: "/dashboard", role: "Tenant Admin" },
        { email: "admin@cloudpos.com", password: "admin123", redirect: "/dashboard", role: "Admin Tenant" }
      ]

      const userCred = validCredentials.find(cred =>
        cred.email === email && cred.password === password
      )

      if (userCred) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${userCred.role}!`,
          variant: "success",
        })
        router.push(userCred.redirect)
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Please check your credentials and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An unexpected error occurred during login. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Shader Background */}
      <div
        ref={shaderContainerRef}
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      >
        <Shader className="h-full w-full">
          <Swirl
            colorA="#1275d8"
            colorB="#e19136"
            speed={0.8}
            detail={0.8}
            blend={50}
            coarseX={40}
            coarseY={40}
            mediumX={40}
            mediumY={40}
            fineX={40}
            fineY={40}
          />
          <ChromaFlow
            baseColor="#0066ff"
            upColor="#0066ff"
            downColor="#d1d1d1"
            leftColor="#e19136"
            rightColor="#e19136"
            intensity={0.9}
            radius={1.8}
            momentum={25}
            maskType="alpha"
            opacity={0.97}
          />
        </Shader>
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className={`relative z-10 flex min-h-screen items-center justify-center p-4 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
        <Card className="w-full max-w-md bg-card/95 backdrop-blur-md border-border/50">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 backdrop-blur-md">
                <Store className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome to Cloud POS</CardTitle>
            <CardDescription>
              Sign in to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@cloudpos.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50 backdrop-blur-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background/50 backdrop-blur-sm"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p className="font-medium mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs">
                <p><strong>Super Admin:</strong> superadmin@cloudpos.com / super123</p>
                <p><strong>Tenant Admin:</strong> tenantadmin@cloudpos.com / tenant123</p>
                <p><strong>Admin Tenant:</strong> admin@cloudpos.com / admin123</p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <p className="text-center text-sm font-medium text-foreground">Quick Login Options:</p>
              <div className="grid grid-cols-1 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEmail("superadmin@cloudpos.com")
                    setPassword("super123")
                  }}
                  className="flex items-center justify-center gap-2 bg-background/50 backdrop-blur-sm"
                >
                  <Shield className="h-4 w-4 text-primary" />
                  Super Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEmail("tenantadmin@cloudpos.com")
                    setPassword("tenant123")
                  }}
                  className="flex items-center justify-center gap-2 bg-background/50 backdrop-blur-sm"
                >
                  <Building className="h-4 w-4 text-primary" />
                  Tenant Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEmail("admin@cloudpos.com")
                    setPassword("admin123")
                  }}
                  className="flex items-center justify-center gap-2 bg-background/50 backdrop-blur-sm"
                >
                  <User className="h-4 w-4 text-primary" />
                  Admin Tenant
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button
                  onClick={() => router.push("/signup")}
                  className="text-primary hover:underline font-medium"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}