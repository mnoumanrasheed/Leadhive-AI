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

export default function App() {
  return (
    <div className="site-shell">
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <ProductSection />
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
