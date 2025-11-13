"use client"

import { Shader, ChromaFlow, Swirl } from "shaders/react"
import { GrainOverlay } from "@/components/grain-overlay"
import { MagneticButton } from "@/components/magnetic-button"
import { useRef, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Store, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Cloud, 
  Shield, 
  Zap,
  Package,
  CreditCard,
  TrendingUp,
  Lock,
  CheckCircle2,
  ArrowRight
} from "lucide-react"

export default function Home() {
  const router = useRouter()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)
  const shaderContainerRef = useRef<HTMLDivElement>(null)
  const scrollThrottleRef = useRef<number>()

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

  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      const sectionWidth = scrollContainerRef.current.offsetWidth
      scrollContainerRef.current.scrollTo({
        left: sectionWidth * index,
        behavior: "smooth",
      })
      setCurrentSection(index)
    }
  }

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (Math.abs(e.touches[0].clientY - touchStartY.current) > 10) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      const touchEndX = e.changedTouches[0].clientX
      const deltaY = touchStartY.current - touchEndY
      const deltaX = touchStartX.current - touchEndX

      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (deltaY > 0 && currentSection < 5) {
          scrollToSection(currentSection + 1)
        } else if (deltaY < 0 && currentSection > 0) {
          scrollToSection(currentSection - 1)
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true })
      container.addEventListener("touchmove", handleTouchMove, { passive: false })
      container.addEventListener("touchend", handleTouchEnd, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart)
        container.removeEventListener("touchmove", handleTouchMove)
        container.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [currentSection])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()

        if (!scrollContainerRef.current) return

        scrollContainerRef.current.scrollBy({
          left: e.deltaY,
          behavior: "instant",
        })

        const sectionWidth = scrollContainerRef.current.offsetWidth
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
  }, [currentSection])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollThrottleRef.current) return

      scrollThrottleRef.current = requestAnimationFrame(() => {
        if (!scrollContainerRef.current) {
          scrollThrottleRef.current = undefined
          return
        }

        const sectionWidth = scrollContainerRef.current.offsetWidth
        const scrollLeft = scrollContainerRef.current.scrollLeft
        const newSection = Math.round(scrollLeft / sectionWidth)

        if (newSection !== currentSection && newSection >= 0 && newSection <= 5) {
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
  }, [currentSection])

  const features = [
    {
      icon: <Store className="h-8 w-8" />,
      title: "Multi-Tenant Architecture",
      description: "Hierarchical tenant → store structure with role-based access control"
    },
    {
      icon: <ShoppingCart className="h-8 w-8" />,
      title: "Complete POS System",
      description: "Sales, payments, returns, and real-time inventory management"
    },
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "Cloud & Offline Sync",
      description: "Work offline with desktop SQLite, sync when connected"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Dynamic RBAC",
      description: "Flexible roles and permissions with superadmin override"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Advanced Analytics",
      description: "Sales, inventory, CRM reports with dynamic dashboards"
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Audit Logging",
      description: "Complete audit trail with change queue for sync"
    }
  ]

  const capabilities = [
    "Multi-store management with tenant isolation",
    "Real-time inventory tracking and low-stock alerts",
    "Customer loyalty and CRM integration",
    "Flexible payment processing with multiple methods",
    "Comprehensive reporting and data export (CSV/Excel)",
    "JWT authentication with refresh token flow",
    "Responsive design for desktop, tablet, and mobile",
    "Change queue for conflict-free offline sync"
  ]

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <GrainOverlay />

      <div
        ref={shaderContainerRef}
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ contain: "strict" }}
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

      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-6 transition-opacity duration-700 md:px-12 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/15 backdrop-blur-md">
            <Store className="h-6 w-6 text-foreground" />
          </div>
          <span className="font-sans text-xl font-semibold tracking-tight text-foreground">Cloud POS</span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          {["Home", "Features", "Capabilities", "Tech Stack", "CTA", "Footer"].map((item, index) => (
            <button
              key={item}
              onClick={() => scrollToSection(index)}
              className={`group relative font-sans text-sm font-medium transition-colors ${
                currentSection === index ? "text-foreground" : "text-foreground/80 hover:text-foreground"
              }`}
            >
              {item}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-foreground transition-all duration-300 ${
                  currentSection === index ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <MagneticButton variant="ghost" onClick={() => router.push('/login')}>
            Sign In
          </MagneticButton>
          <MagneticButton variant="primary" onClick={() => router.push('/signup')}>
            Get Started
          </MagneticButton>
        </div>
      </nav>

      <div
        ref={scrollContainerRef}
        data-scroll-container
        className={`relative z-10 flex h-screen overflow-x-auto overflow-y-hidden transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {/* Hero Section */}
        <section className="flex min-h-screen w-screen shrink-0 snap-start flex-col justify-end px-6 pb-16 pt-24 md:px-12 md:pb-24">
          <div className="max-w-3xl">
            <div className="mb-4 inline-block animate-in fade-in slide-in-from-bottom-4 rounded-full border border-foreground/20 bg-foreground/15 px-4 py-1.5 backdrop-blur-md duration-700">
              <p className="font-mono text-xs text-foreground/90">Enterprise Point of Sale Solution</p>
            </div>
            
            <h1 className="mb-6 animate-in fade-in slide-in-from-bottom-8 font-sans text-6xl font-light leading-[1.1] tracking-tight text-foreground duration-1000 md:text-7xl lg:text-8xl">
              <span className="text-balance">
                Modern POS
                <br />
                for Modern Business
              </span>
            </h1>
            
            <p className="mb-8 max-w-xl animate-in fade-in slide-in-from-bottom-4 text-lg leading-relaxed text-foreground/90 duration-1000 delay-200 md:text-xl">
              <span className="text-pretty">
                Enterprise-grade Point of Sale system with multi-tenant architecture, 
                offline capabilities, and comprehensive business management tools.
              </span>
            </p>
            
            <div className="flex animate-in fade-in slide-in-from-bottom-4 flex-col gap-4 duration-1000 delay-300 sm:flex-row sm:items-center">
              <MagneticButton size="lg" variant="primary" onClick={() => router.push('/signup')}>
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </MagneticButton>
              <MagneticButton size="lg" variant="secondary" onClick={() => router.push('/login')}>
                Sign In
              </MagneticButton>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
              {[
                { label: 'Tenants', value: '∞', icon: <Users className="h-5 w-5" /> },
                { label: 'Stores', value: '∞', icon: <Store className="h-5 w-5" /> },
                { label: 'Products', value: '∞', icon: <Package className="h-5 w-5" /> },
                { label: 'Transactions', value: 'Real-time', icon: <TrendingUp className="h-5 w-5" /> }
              ].map((stat, i) => (
                <div
                  key={i}
                  className="animate-in fade-in slide-in-from-bottom-4 rounded-lg border border-foreground/10 bg-foreground/5 p-4 backdrop-blur-md duration-1000"
                  style={{ animationDelay: `${400 + i * 100}ms` }}
                >
                  <div className="mb-2 text-foreground/70">{stat.icon}</div>
                  <div className="mb-1 text-2xl font-light text-foreground">{stat.value}</div>
                  <div className="font-mono text-xs text-foreground/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-in fade-in duration-1000 delay-500">
            <div className="flex items-center gap-2">
              <p className="font-mono text-xs text-foreground/80">Scroll to explore</p>
              <div className="flex h-6 w-12 items-center justify-center rounded-full border border-foreground/20 bg-foreground/15 backdrop-blur-md">
                <div className="h-2 w-2 animate-pulse rounded-full bg-foreground/80" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-12">
              <div className="mb-4 inline-block rounded-full border border-foreground/20 bg-foreground/15 px-4 py-1.5 backdrop-blur-md">
                <p className="font-mono text-xs text-foreground/90">Core Features</p>
              </div>
              <h2 className="mb-6 font-sans text-4xl font-light tracking-tight text-foreground md:text-5xl">
                Everything You Need
                <br />
                <span className="text-foreground/40">in One Platform</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="group rounded-lg border border-foreground/10 bg-foreground/5 p-6 backdrop-blur-md transition-all hover:bg-foreground/10 hover:scale-105"
                >
                  <div className="mb-4 text-foreground/80">{feature.icon}</div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-foreground/70">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16">
          <div className="mx-auto w-full max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
              <div>
                <div className="mb-4 inline-block rounded-full border border-foreground/20 bg-foreground/15 px-4 py-1.5 backdrop-blur-md">
                  <p className="font-mono text-xs text-foreground/90">Platform Capabilities</p>
                </div>
                <h2 className="mb-6 font-sans text-4xl font-light tracking-tight text-foreground md:text-5xl">
                  Production-Ready
                  <br />
                  Features
                </h2>
                <p className="mb-8 text-lg leading-relaxed text-foreground/80">
                  Cloud POS is built to scale from single stores to enterprise chains, 
                  with security, reliability, and performance at its core.
                </p>
                <MagneticButton size="lg" variant="primary" onClick={() => router.push('/signup')}>
                  Start Building
                  <TrendingUp className="ml-2 h-5 w-5" />
                </MagneticButton>
              </div>

              <div className="space-y-4">
                {capabilities.map((capability, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-green-400" />
                    <span className="text-lg text-foreground/90">{capability}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16">
          <div className="mx-auto w-full max-w-7xl">
            <div className="mb-12 text-center">
              <div className="mb-4 inline-block rounded-full border border-foreground/20 bg-foreground/15 px-4 py-1.5 backdrop-blur-md">
                <p className="font-mono text-xs text-foreground/90">Technology Stack</p>
              </div>
              <h2 className="font-sans text-4xl font-light tracking-tight text-foreground md:text-5xl">
                Built with Modern
                <br />
                <span className="text-foreground/40">Technologies</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-8 backdrop-blur-md">
                <Zap className="mb-4 h-10 w-10 text-foreground/80" />
                <h3 className="mb-3 text-2xl font-semibold text-foreground">Frontend</h3>
                <ul className="space-y-2 text-foreground/70">
                  <li>• Next.js 15 with App Router</li>
                  <li>• React 19 + TypeScript</li>
                  <li>• Tailwind CSS + Radix UI</li>
                  <li>• React Hook Form + Zod</li>
                </ul>
              </div>

              <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-8 backdrop-blur-md">
                <Shield className="mb-4 h-10 w-10 text-foreground/80" />
                <h3 className="mb-3 text-2xl font-semibold text-foreground">Backend</h3>
                <ul className="space-y-2 text-foreground/70">
                  <li>• RESTful API with JWT</li>
                  <li>• PostgreSQL Database</li>
                  <li>• Multi-tenant Architecture</li>
                  <li>• Offline SQLite Sync</li>
                </ul>
              </div>

              <div className="rounded-lg border border-foreground/10 bg-foreground/5 p-8 backdrop-blur-md">
                <Cloud className="mb-4 h-10 w-10 text-foreground/80" />
                <h3 className="mb-3 text-2xl font-semibold text-foreground">Deployment</h3>
                <ul className="space-y-2 text-foreground/70">
                  <li>• Docker Containers</li>
                  <li>• CI/CD Pipeline</li>
                  <li>• Cloud-Native Design</li>
                  <li>• Auto-scaling Ready</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16">
          <div className="mx-auto w-full max-w-4xl text-center">
            <div className="mb-4 inline-block rounded-full border border-foreground/20 bg-foreground/15 px-4 py-1.5 backdrop-blur-md">
              <p className="font-mono text-xs text-foreground/90">Get Started Today</p>
            </div>

            <h2 className="mb-6 font-sans text-5xl font-light leading-[1.1] tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Ready to Transform
              <br />
              Your Business?
            </h2>

            <p className="mb-10 text-xl leading-relaxed text-foreground/80">
              Join thousands of businesses already using Cloud POS to streamline their operations.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
              <MagneticButton size="lg" variant="primary" onClick={() => router.push('/signup')}>
                Create Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </MagneticButton>
              <MagneticButton size="lg" variant="secondary" onClick={() => router.push('/login')}>
                Sign In
              </MagneticButton>
            </div>

            <div className="mt-12 text-sm text-foreground/60">
              No credit card required • Free 14-day trial • Cancel anytime
            </div>
          </div>
        </section>

        {/* Footer Section */}
        <section className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16">
          <div className="mx-auto w-full max-w-7xl">
            <div className="border-t border-foreground/10 pt-12">
              <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-foreground/15 backdrop-blur-md">
                    <Store className="h-6 w-6 text-foreground" />
                  </div>
                  <span className="font-sans text-xl font-semibold tracking-tight text-foreground">Cloud POS</span>
                </div>

                <div className="flex gap-8 text-sm text-foreground/70">
                  <a href="#" className="hover:text-foreground">Privacy</a>
                  <a href="#" className="hover:text-foreground">Terms</a>
                  <a href="#" className="hover:text-foreground">Contact</a>
                  <a href="#" className="hover:text-foreground">Docs</a>
                </div>

                <p className="text-sm text-foreground/60">
                  © 2025 Cloud POS. All rights reserved.
                </p>
              </div>

              <div className="mt-12 text-center">
                <p className="text-xs text-foreground/50">
                  Enterprise Point of Sale Solution • Multi-tenant Architecture • Cloud & Offline Sync
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  )
}
