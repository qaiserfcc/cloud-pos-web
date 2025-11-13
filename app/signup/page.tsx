"use client"

import { Shader, ChromaFlow, Swirl } from "shaders/react"
import { GrainOverlay } from "@/components/grain-overlay"
import { MagneticButton } from "@/components/magnetic-button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Store, Mail, Lock, User, Phone, Building2, AlertCircle, Loader2 } from "lucide-react"
import { authService } from "@/services/auth.service"
import { roleService } from '@/services/role.service'
import Link from "next/link"

interface RoleRecord { id: string; name: string }

interface SignupFormState {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone: string
  tenantId: string
  roleId: string // stores the selected role id
}

export default function SignupPage() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const [formData, setFormData] = useState<SignupFormState>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    tenantId: "",
    roleId: ""
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [roles, setRoles] = useState<RoleRecord[]>([])
  const [rolesLoading, setRolesLoading] = useState(true)
  const [rolesError, setRolesError] = useState<string | null>(null)

  const roleDescriptions: Record<string, string> = {
    'Super Admin': 'Global access without tenant association',
    'Tenant Admin': 'Manage a specific tenant and stores'
  }

  useEffect(() => {
    // Fetch available roles from backend and filter to the two allowed display roles
    let mounted = true
    ;(async () => {
      try {
        const fetched = await roleService.getRoles()
        // Keep only roles with display names we care about
        const allowed = fetched.filter(r => ['Super Admin', 'Tenant Admin'].includes(r.name))
        if (mounted) {
          if (allowed.length > 0) setRoles(allowed)
          else setRoles([
            { id: 'superadmin', name: 'Super Admin' },
            { id: 'tenantadmin', name: 'Tenant Admin' }
          ])
        }
      } catch (err: any) {
        console.error('Failed to fetch roles, falling back to defaults', err)
        if (mounted) {
          setRoles([
            { id: 'superadmin', name: 'Super Admin' },
            { id: 'tenantadmin', name: 'Tenant Admin' }
          ])
          setRolesError(err?.message || 'Failed to load roles')
        }
      } finally {
        if (mounted) setRolesLoading(false)
      }
    })()

    // Check if already authenticated
    if (authService.isAuthenticated()) {
      router.push('/dashboard')
      return
    }

    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleRoleChange = (roleId: string) => {
    const roleObj = roles.find(r => r.id === roleId)
    const roleName = roleObj?.name ?? ''
    setFormData(prev => ({
      ...prev,
      roleId,
      tenantId: roleName === 'Super Admin' ? '' : prev.tenantId
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Validate inputs
      if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
        setError("Please fill in all required fields")
        setIsLoading(false)
        return
      }

      const isRoleValid = roles.some(r => r.id === formData.roleId)
      if (!formData.roleId || !isRoleValid) {
        setError("Please select a valid role")
        setIsLoading(false)
        return
      }
      const selectedRole = roles.find(r => r.id === formData.roleId)
      if (selectedRole?.name === "Tenant Admin" && !formData.tenantId.trim()) {
        setError("Tenant ID is required for tenant administrators")
        setIsLoading(false)
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        setIsLoading(false)
        return
      }

      const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
      if (!passwordPolicy.test(formData.password)) {
        setError("Password must be at least 8 characters long and include uppercase, lowercase, and a number")
        setIsLoading(false)
        return
      }

      // Call register API
      await authService.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        roleId: formData.roleId || undefined,
        tenantId: selectedRole?.name === "Tenant Admin" ? formData.tenantId : undefined
      })

      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err.message || 'Registration failed. Please try again.')
      setIsLoading(false)
    }
  }

  const selectedRole = roles.find(r => r.id === formData.roleId)

  return (
    <main className="relative min-h-screen w-full overflow-auto bg-background">
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
      <div
        className={`relative z-10 flex min-h-screen items-center justify-center px-4 py-12 transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
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

          {/* Signup Form */}
          <div className="rounded-2xl border border-foreground/10 bg-foreground/5 p-8 backdrop-blur-md">
            <div className="mb-6 text-center">
              <h1 className="mb-2 text-3xl font-light tracking-tight text-foreground">Create Account</h1>
              <p className="text-foreground/70">Get started with Cloud POS today</p>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <span className="mb-2 block text-sm font-medium text-foreground/80">Select Role *</span>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {rolesLoading ? (
                    <div className="col-span-2 flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-foreground/70" />
                    </div>
                  ) : (
                    roles.map(role => {
                      const isActive = formData.roleId === role.id
                      return (
                        <label
                          key={role.id}
                          className={`block cursor-pointer rounded-lg border p-4 transition-colors ${
                            isActive
                              ? "border-foreground bg-foreground/10"
                              : "border-foreground/20 bg-foreground/5 hover:border-foreground/40"
                          }`}
                        >
                          <input
                            type="radio"
                            name="role"
                            value={role.id}
                            checked={isActive}
                            onChange={() => handleRoleChange(role.id)}
                            className="sr-only"
                            aria-label={role.name}
                          />
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-foreground">{role.name}</p>
                              <p className="mt-1 text-xs text-foreground/60">{roleDescriptions[role.name]}</p>
                            </div>
                            <span
                              aria-hidden="true"
                              className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                                isActive
                                  ? "border-foreground bg-foreground"
                                  : "border-foreground/30"
                              }`}
                            >
                              {isActive && <span className="block h-2 w-2 rounded-full bg-background" />}
                            </span>
                          </div>
                        </label>
                      )
                    })
                  )}
                </div>
                {rolesError && (
                  <p className="mt-2 text-xs text-yellow-400">Failed to load roles: {rolesError}</p>
                )}
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-foreground/80">
                    First Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/50" />
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      disabled={isLoading}
                      className="w-full rounded-lg border border-foreground/20 bg-foreground/5 py-3 pl-10 pr-4 text-foreground placeholder-foreground/50 backdrop-blur-sm transition-colors focus:border-foreground/40 focus:outline-none disabled:opacity-50"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-foreground/80">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    disabled={isLoading}
                    className="w-full rounded-lg border border-foreground/20 bg-foreground/5 py-3 px-4 text-foreground placeholder-foreground/50 backdrop-blur-sm transition-colors focus:border-foreground/40 focus:outline-none disabled:opacity-50"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground/80">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/50" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="user@example.com"
                    disabled={isLoading}
                    className="w-full rounded-lg border border-foreground/20 bg-foreground/5 py-3 pl-10 pr-4 text-foreground placeholder-foreground/50 backdrop-blur-sm transition-colors focus:border-foreground/40 focus:outline-none disabled:opacity-50"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-foreground/80">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/50" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    disabled={isLoading}
                    className="w-full rounded-lg border border-foreground/20 bg-foreground/5 py-3 pl-10 pr-4 text-foreground placeholder-foreground/50 backdrop-blur-sm transition-colors focus:border-foreground/40 focus:outline-none disabled:opacity-50"
                    autoComplete="tel"
                  />
                </div>
              </div>

              {/* Tenant Name Field */}
              {selectedRole?.name === "Tenant Admin" && (
                <div>
                  <label htmlFor="tenantId" className="mb-2 block text-sm font-medium text-foreground/80">
                    Tenant ID *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/50" />
                    <input
                      id="tenantId"
                      name="tenantId"
                      type="text"
                      value={formData.tenantId}
                      onChange={handleChange}
                      placeholder="00000000-0000-0000-0000-000000000000"
                      disabled={isLoading}
                      className="w-full rounded-lg border border-foreground/20 bg-foreground/5 py-3 pl-10 pr-4 text-foreground placeholder-foreground/50 backdrop-blur-sm transition-colors focus:border-foreground/40 focus:outline-none disabled:opacity-50"
                      required={selectedRole?.name === "Tenant Admin"}
                    />
                  </div>
                </div>
              )}

              {/* Password Fields */}
              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground/80">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/50" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="w-full rounded-lg border border-foreground/20 bg-foreground/5 py-3 pl-10 pr-4 text-foreground placeholder-foreground/50 backdrop-blur-sm transition-colors focus:border-foreground/40 focus:outline-none disabled:opacity-50"
                    autoComplete="new-password"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-foreground/50">Must be at least 8 characters</p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-foreground/80">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground/50" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="w-full rounded-lg border border-foreground/20 bg-foreground/5 py-3 pl-10 pr-4 text-foreground placeholder-foreground/50 backdrop-blur-sm transition-colors focus:border-foreground/40 focus:outline-none disabled:opacity-50"
                    autoComplete="new-password"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <MagneticButton
                type="submit"
                variant="primary"
                size="lg"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </MagneticButton>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center text-sm text-foreground/70">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-foreground transition-colors hover:underline">
                Sign in
              </Link>
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
