import { useState } from 'react'
import '@/components/home/home-colors.css'
import { Navbar } from '@/components/home/Navbar'
import { Hero } from '@/components/home/Hero'
import { Problems } from '@/components/home/Problems'
import { Features } from '@/components/home/Features'
import { HowItWorks } from '@/components/home/HowItWorks'
import { Games } from '@/components/home/Games'
import { Testimonials } from '@/components/home/Testimonials'
import { CTA } from '@/components/home/CTA'
import { Footer } from '@/components/home/Footer'
import { DemoModal } from '@/components/home/DemoModal'

export default function Homepage() {
  const [demoOpen, setDemoOpen] = useState(false)

  const openDemo = () => setDemoOpen(true)

  return (
    <div className="public-home min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main>
        <Hero onTryDemo={openDemo} />
        <Problems />
        <Features />
        <HowItWorks />
        <Games />
        <Testimonials />
        <CTA onTryDemo={openDemo} />
      </main>
      <Footer />

      <DemoModal open={demoOpen} onOpenChange={setDemoOpen} />
    </div>
  )
}
