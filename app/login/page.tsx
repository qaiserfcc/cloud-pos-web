"use client"

import { Shader, ChromaFlow, Swirl } from "shaders/react"
import { GrainOverlay } from "@/components/grain-overlay"
import { Store } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { logger } from "@/utils/logger"
import { toastService } from "@/providers/toast-provider"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const { user, isLoading, login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})

  useEffect(() => {
    logger.info("Login page loaded", { url: window.location.href })
  }, [])

  // Handle successful authentication
  useEffect(() => {
    const handleAuthSuccess = async () => {
      if (user && !isLoading) {
        logger.info("User authenticated successfully, redirecting to dashboard", {
          userId: user.id,
          tenantId: user.tenantId
        })

        // Redirect to dashboard
        router.push('/dashboard')
      }
    }

    handleAuthSuccess()
  }, [user, isLoading, router])

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!password.trim()) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      logger.userAction("Login form submitted", { email })

      await login(email.trim(), password)

      logger.authEvent("Login successful", { email })

    } catch (error: any) {
      logger.error("Login failed", { email, error: error.message })

      const errorMessage = error.message || "Login failed. Please check your credentials and try again."

      setErrors({ general: errorMessage })
      toastService.error("Login Failed", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <main className="relative h-screen w-full overflow-hidden bg-background">
        <GrainOverlay />
        <div className="fixed inset-0 z-0">
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

        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground mx-auto mb-4"></div>
            <p className="text-foreground/70">Loading...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <GrainOverlay />

      {/* Shader Background */}
      <div className="fixed inset-0 z-0">
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

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-foreground/15 backdrop-blur-md">
                <Store className="h-7 w-7 text-foreground" />
              </div>
              <span className="text-2xl font-semibold tracking-tight text-foreground">Cloud POS</span>
            </Link>
          </div>

          {/* Login Form */}
          <div className="rounded-2xl border border-foreground/10 bg-foreground/5 p-8 backdrop-blur-md">
            <div className="mb-6 text-center">
              <h1 className="mb-2 text-3xl font-light tracking-tight text-foreground">Welcome Back</h1>
              <p className="text-foreground/70">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* General Error */}
              {errors.general && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
                  {errors.general}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`h-11 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                  disabled={isSubmitting}
                  autoComplete="email"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`h-11 pr-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                    disabled={isSubmitting}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground transition-colors"
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Fill Superadmin Details Button */}
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEmail("qaiserfcc@gmail.com")
                    setPassword("12345678")
                    setErrors({})
                  }}
                  className="text-xs text-foreground/60 hover:text-foreground/80"
                  disabled={isSubmitting}
                >
                  Fill Superadmin Details
                </Button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center space-y-2">
              <Link
                href="/forgot-password"
                className="text-sm text-foreground/70 hover:text-foreground transition-colors"
              >
                Forgot your password?
              </Link>
              <div className="text-sm text-foreground/50">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-foreground hover:text-foreground/80 transition-colors font-medium"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-foreground/50">
            © 2025 Cloud POS. All rights reserved.
          </div>
        </div>
      </div>
    </main>
  )
}
