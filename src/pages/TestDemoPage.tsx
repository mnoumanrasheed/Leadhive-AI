import { useEffect, useState } from 'react'
import { DemoShell } from '../components/test-demo/DemoShell'
import { ResourceStatus } from '../components/test-demo/DemoUI'
import { PlatformSelection } from '../components/test-demo/screens/PlatformSelection'
import { ChannelSetup } from '../components/test-demo/screens/ChannelSetup'
import { PersonaSetup } from '../components/test-demo/screens/PersonaSetup'
import { ContentSelection } from '../components/test-demo/screens/ContentSelection'
import { CommandCenter } from '../components/test-demo/screens/CommandCenter'
import { AnalyticsDashboard } from '../components/test-demo/screens/AnalyticsDashboard'
import { IntelligenceDashboard } from '../components/test-demo/screens/IntelligenceDashboard'
import { useYouTubeIntelligence } from '../hooks/useYouTubeIntelligence'
import { screenFromHash, type DemoScreen } from '../components/test-demo/types'
import '../styles/test-demo.css'
import '../styles/youtube-intelligence.css'
import '../styles/premium-white-demo.css'

export function TestDemoPage() {
  const [screen, setScreen] = useState(screenFromHash)
  const controller = useYouTubeIntelligence()
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'YouTube Intelligence | LeadHive AI'
    const onHashChange = () => setScreen(screenFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => { document.title = previousTitle; window.removeEventListener('hashchange', onHashChange) }
  }, [])
  function navigate(screen: DemoScreen) { window.location.hash = screen }
  const props = { controller, navigate }
  function renderScreen() {
    switch (screen) {
      case 'platform': return <PlatformSelection navigate={navigate} />
      case 'channel': return <ChannelSetup {...props} />
      case 'persona': return <PersonaSetup {...props} />
      case 'content': return <ContentSelection {...props} />
      case 'dashboard': return <IntelligenceDashboard {...props} />
      case 'command-center': return <CommandCenter {...props} />
      case 'analytics': return <AnalyticsDashboard {...props} />
    }
  }
  return <DemoShell screen={screen}><ResourceStatus loading={controller.loading} error={controller.error} retry={controller.reload} />{renderScreen()}</DemoShell>
}
