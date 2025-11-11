"use client"

import { Shader, ChromaFlow, Swirl } from "shaders/react"
import { useRef, useEffect, useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Store, Users, BarChart3, Shield, Zap, Smartphone } from "lucide-react"

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)
  const shaderContainerRef = useRef<HTMLDivElement>(null)
  const scrollThrottleRef = useRef<number | undefined>()

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
        if (deltaY > 0 && currentSection < 4) {
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

        if (newSection !== currentSection && newSection >= 0 && newSection <= 4) {
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

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      {/* Shader Background */}
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

      {/* Navigation */}
      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-6 transition-opacity duration-700 md:px-12 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 backdrop-blur-md">
            <Store className="h-5 w-5 text-primary" />
          </div>
          <span className="font-sans text-xl font-semibold tracking-tight text-foreground">Cloud POS</span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          {["Home", "Features", "Solutions", "About", "Contact"].map((item, index) => (
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

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button onClick={() => scrollToSection(4)}>
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </nav>

      <div
        ref={scrollContainerRef}
        data-scroll-container
        className={`relative z-10 flex h-screen overflow-x-auto overflow-y-hidden transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Hero Section */}
        <section className="flex min-h-screen w-screen shrink-0 flex-col justify-center px-6 pt-24 md:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <Badge variant="secondary" className="mb-6 animate-in fade-in slide-in-from-bottom-4 rounded-full border-primary/20 bg-primary/15 px-4 py-1.5 backdrop-blur-md duration-700">
              <Zap className="mr-2 h-3 w-3" />
              Next-Gen Point of Sale
            </Badge>

            <h1 className="mb-6 animate-in fade-in slide-in-from-bottom-8 font-sans text-5xl font-light leading-[1.1] tracking-tight text-foreground duration-1000 md:text-6xl lg:text-7xl">
              <span className="text-balance">
                Modern POS Solutions
                <br />
                for Every Business
              </span>
            </h1>

            <p className="mb-8 mx-auto max-w-2xl animate-in fade-in slide-in-from-bottom-4 text-lg leading-relaxed text-foreground/90 duration-1000 delay-200 md:text-xl">
              <span className="text-pretty">
                Streamline your operations with our cloud-based POS system. Multi-tenant architecture,
                real-time synchronization, and comprehensive reporting for retail, restaurants, and services.
              </span>
            </p>

            <div className="flex animate-in fade-in slide-in-from-bottom-4 flex-col gap-4 duration-1000 delay-300 sm:flex-row sm:justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollToSection(1)} className="text-lg px-8 py-6">
                View Features
              </Button>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-in fade-in duration-1000 delay-500">
            <div className="flex items-center gap-2">
              <p className="font-mono text-xs text-foreground/80">Swipe to explore</p>
              <div className="flex h-6 w-12 items-center justify-center rounded-full border border-foreground/20 bg-foreground/15 backdrop-blur-md">
                <div className="h-2 w-2 animate-pulse rounded-full bg-foreground/80" />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="flex min-h-screen w-screen shrink-0 flex-col justify-center bg-background/80 backdrop-blur-sm px-6 py-24 md:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-sans text-4xl font-light tracking-tight text-foreground md:text-5xl">
                Powerful Features
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-foreground/80">
                Everything you need to manage your business efficiently with modern cloud technology.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Store,
                  title: "Multi-Store Management",
                  description: "Manage multiple locations with centralized control and real-time inventory sync."
                },
                {
                  icon: Users,
                  title: "User & Role Management",
                  description: "Flexible user permissions and role-based access control for your team."
                },
                {
                  icon: BarChart3,
                  title: "Advanced Analytics",
                  description: "Comprehensive reporting and insights to optimize your business performance."
                },
                {
                  icon: Shield,
                  title: "Enterprise Security",
                  description: "Bank-level security with audit logs and compliance features."
                },
                {
                  icon: Zap,
                  title: "Real-time Sync",
                  description: "Offline-capable with automatic synchronization when online."
                },
                {
                  icon: Smartphone,
                  title: "Mobile Optimized",
                  description: "Responsive design that works perfectly on all devices and screen sizes."
                }
              ].map((feature, index) => (
                <Card key={index} className="group border-0 bg-card/50 backdrop-blur-sm transition-all hover:bg-card/80 hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/15 transition-colors group-hover:bg-primary/25">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section className="flex min-h-screen w-screen shrink-0 flex-col justify-center px-6 py-24 md:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-sans text-4xl font-light tracking-tight text-foreground md:text-5xl">
                Perfect for Every Industry
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-foreground/80">
                Tailored solutions for retail stores, restaurants, cafes, and service businesses.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {[
                {
                  title: "Retail & E-commerce",
                  features: ["Inventory Management", "Barcode Scanning", "Customer Loyalty", "Multi-location Sync"],
                  gradient: "from-blue-500 to-purple-600"
                },
                {
                  title: "Restaurants & Food Service",
                  features: ["Table Management", "Kitchen Display", "Order Tracking", "Menu Customization"],
                  gradient: "from-orange-500 to-red-600"
                },
                {
                  title: "Cafes & Quick Service",
                  features: ["Fast Checkout", "Mobile Orders", "Loyalty Programs", "Staff Management"],
                  gradient: "from-green-500 to-teal-600"
                },
                {
                  title: "Service Businesses",
                  features: ["Appointment Booking", "Time Tracking", "Invoice Generation", "Client Management"],
                  gradient: "from-purple-500 to-pink-600"
                }
              ].map((solution, index) => (
                <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm transition-all hover:shadow-xl">
                  <div className={`absolute inset-0 bg-gradient-to-br ${solution.gradient} opacity-0 transition-opacity group-hover:opacity-5`} />
                  <CardHeader>
                    <CardTitle className="text-2xl text-foreground">{solution.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {solution.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-foreground/80">
                          <div className="mr-3 h-1.5 w-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="flex min-h-screen w-screen shrink-0 flex-col justify-center bg-background/80 backdrop-blur-sm px-6 py-24 md:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-8 font-sans text-4xl font-light tracking-tight text-foreground md:text-5xl">
              Built for the Future
            </h2>
            <p className="mb-12 text-lg leading-relaxed text-foreground/80 md:text-xl">
              Cloud POS combines cutting-edge technology with intuitive design to deliver
              a point-of-sale system that grows with your business. From small boutiques to
              enterprise chains, we provide the tools you need to succeed.
            </p>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-4 text-3xl font-bold text-primary">99.9%</div>
                <div className="text-foreground/80">Uptime</div>
              </div>
              <div className="text-center">
                <div className="mb-4 text-3xl font-bold text-primary">10k+</div>
                <div className="text-foreground/80">Businesses</div>
              </div>
              <div className="text-center">
                <div className="mb-4 text-3xl font-bold text-primary">24/7</div>
                <div className="text-foreground/80">Support</div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="flex min-h-screen w-screen shrink-0 flex-col justify-center px-6 py-24 md:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-8 font-sans text-4xl font-light tracking-tight text-foreground md:text-5xl">
              Ready to Get Started?
            </h2>
            <p className="mb-12 text-lg text-foreground/80">
              Join thousands of businesses already using Cloud POS to streamline their operations.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Schedule Demo
              </Button>
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
