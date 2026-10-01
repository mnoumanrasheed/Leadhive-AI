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
    return () => {
      document.title = previousTitle
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  // Auto-advance onboarding step upon successful OAuth return once workspace is restored
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const authState = searchParams.get('auth')

    if (authState === 'success' && !controller.isInitializing && controller.channel) {
      let nextScreen: DemoScreen = 'channel'
      if (!controller.profile.business_name) {
        nextScreen = 'persona'
      } else if (controller.selectedVideoIds.length === 0) {
        nextScreen = 'content'
      } else {
        nextScreen = 'command-center'
      }

      window.location.hash = nextScreen
      setScreen(nextScreen)

      // Clean temporary OAuth query parameters from browser URL
      const cleanUrl = window.location.pathname + window.location.hash
      window.history.replaceState(null, '', cleanUrl)
    } else if (authState === 'failed' && !controller.isInitializing) {
      window.location.hash = 'channel'
      setScreen('channel')

      const cleanUrl = window.location.pathname + window.location.hash
      window.history.replaceState(null, '', cleanUrl)
    }
  }, [controller.isInitializing, controller.channel, controller.profile.business_name, controller.selectedVideoIds.length])

  function navigate(target: DemoScreen) {
    window.location.hash = target
  }

  const props = { controller, navigate }

  function renderScreen() {
    switch (screen) {
      case 'platform':
        return <PlatformSelection {...props} />
      case 'channel':
        return <ChannelSetup {...props} />
      case 'persona':
        return <PersonaSetup {...props} />
      case 'content':
        return <ContentSelection {...props} />
      case 'dashboard':
        return <IntelligenceDashboard {...props} />
      case 'command-center':
        return <CommandCenter {...props} />
      case 'analytics':
        return <AnalyticsDashboard {...props} />
    }
  }

  return (
    <DemoShell screen={screen}>
      {/* Show initialization errors (e.g. backend unreachable) */}
      {controller.initError && (
        <ResourceStatus
          loading={false}
          error={controller.initError}
          retry={controller.reload}
        />
      )}
      {/* Show general errors from mutations */}
      {!controller.initError && controller.error && (
        <ResourceStatus
          loading={false}
          error={controller.error}
          retry={controller.reload}
        />
      )}
      {renderScreen()}
    </DemoShell>
  )
}
