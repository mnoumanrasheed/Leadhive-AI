import { ArrowRight, Check, Link2 } from 'lucide-react'
import { ConnectButton, EmptyState, Panel, PanelHeader, ScreenHeading, StatusBadge, StepActions } from '../DemoUI'
import type { ScreenNavigation } from '../types'
import type { YouTubeController } from '../../../hooks/useYouTubeIntelligence'

export function ChannelSetup({ controller: c, navigate }: ScreenNavigation & { controller: YouTubeController }) {
  const channels = c.session?.channels || []
  const connectionFailed = new URLSearchParams(window.location.search).has('connection')

  return (
    <section className="yi-channel-setup">
      <div className="td-heading-with-action">
        <ScreenHeading eyebrow="Channel Setup" title="Your YouTube channel">
          Select the connected YouTube channel LeadHive should manage.
        </ScreenHeading>
        {channels.length > 0 && (
          <a href="/api/youtube/auth/login" className="td-button td-button-secondary yi-connect-another">
            <Link2 size={15} /> Connect another account
          </a>
        )}
      </div>

      {connectionFailed && (
        <p className="td-error" role="alert">
          The connection could not be completed. Try connecting again.
        </p>
      )}

      <Panel className="yi-channel-panel">
        <PanelHeader title="Connected channels">
          {channels.length ? `${channels.length} ${channels.length === 1 ? 'channel' : 'channels'} available` : 'Connect a channel to begin'}
        </PanelHeader>
        <div className="yi-account-list">
          {channels.length ? (
            channels.map(channel => {
              const selected = c.session?.selected === channel.id
              return (
                <article className={'yi-channel-row ' + (selected ? 'is-selected' : '')} key={channel.id}>
                  <div className="yi-account-avatar">
                    {channel.thumbnail ? (
                      <img className="yi-channel-avatar" src={channel.thumbnail} alt="" />
                    ) : (
                      <Link2 size={20} />
                    )}
                  </div>
                  <div className="yi-account-details">
                    <StatusBadge tone={selected ? 'accent' : 'success'}>
                      {selected ? 'Selected channel' : 'Connected'}
                    </StatusBadge>
                    <h3>{channel.title}</h3>
                    <p>YouTube channel</p>
                  </div>
                  {selected && (
                    <span className="yi-row-check" aria-label="Selected">
                      <Check size={16} />
                    </span>
                  )}
                  <button
                    disabled={c.busy}
                    className="td-button td-button-secondary yi-account-select"
                    onClick={async () => {
                      if (await c.chooseChannel(channel.id)) navigate('persona')
                    }}
                  >
                    Select <ArrowRight size={15} />
                  </button>
                </article>
              )
            })
          ) : (
            <EmptyState icon={<Link2 size={24} />} title="No channel connected yet." action={<ConnectButton />}>
              Your connected channels will appear here after authentication.
            </EmptyState>
          )}
        </div>
      </Panel>

      <StepActions
        back={() => navigate('platform')}
        next={() => navigate('persona')}
        disabled={!c.channel}
      />
    </section>
  )
}