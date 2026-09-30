import { SiteHeader } from '@/components/landing/site-header'
import { LandingShell } from '@/components/landing/landing-shell'
import { Hero } from '@/components/landing/hero'
import { Marquee } from '@/components/landing/marquee'
import { Services } from '@/components/landing/services'
import { VideoShowcase } from '@/components/landing/video-showcase'
import { Process } from '@/components/landing/process'
import { Pricing } from '@/components/landing/pricing'
import { CtaFooter } from '@/components/landing/cta-footer'

export default function HomePage() {
  return (
    <LandingShell>
      <SiteHeader />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <VideoShowcase />
        <Process />
        <Pricing />
        <CtaFooter />
      </main>
    </LandingShell>
  )
}