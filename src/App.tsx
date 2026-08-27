import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { ProblemSection } from './sections/ProblemSection'
import { ProductSection } from './sections/ProductSection'
import { WorkflowSection } from './sections/WorkflowSection'
import { ScaleSection } from './sections/ScaleSection'
import { Channels } from './components/Channels'
import { MobileExperience } from './components/MobileExperience'
import { WhyLeadHive } from './sections/WhyLeadHive'
import { CTA } from './components/CTA'
import { Footer } from './components/Footer'
import { TrustSection } from './sections/TrustSection'
import { LegalPage } from './pages/LegalPage'

export default function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'

  if (path === '/privacy' || path === '/terms') {
    return <LegalPage type={path === '/privacy' ? 'privacy' : 'terms'} />
  }

  return (
    <div className="site-shell">
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <ProductSection />
        <TrustSection />
        <WorkflowSection />
        <ScaleSection />
        <Channels />
        <MobileExperience />
        <WhyLeadHive />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
