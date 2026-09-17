import { ArrowRight, Link2 } from 'lucide-react'
import { ConnectButton, EmptyState, ScreenHeading, StepActions } from '../DemoUI'
import type { ScreenNavigation } from '../types'
import type { YouTubeController } from '../../../hooks/useYouTubeIntelligence'

export function ChannelSetup({ controller: c, navigate }: ScreenNavigation & { controller: YouTubeController }) {
  const channels = c.session?.channels || []
  const connectionFailed = new URLSearchParams(window.location.search).has('connection')
  return <section className="yi-channel-setup"><ScreenHeading eyebrow="Connected accounts" title="Your YouTube channel">Connect securely with Google, then select the channel you want to manage.</ScreenHeading>
    {connectionFailed && <p className="yi-error" role="alert">The connection could not be completed. Try connecting again.</p>}
    <div className="td-account-layout yi-account-layout"><aside className="td-account-context yi-account-context"><span className="yi-account-platform-icon"><Link2 size={20} /></span><p className="td-eyebrow">YouTube connection</p><h2 className="yi-side-title">Built around your channel.</h2><p>Choose your content, configure your business voice, and manage engagement from one connected LeadHive workspace.</p><div className="yi-account-security"><i /><span>Google-secured account connection</span></div></aside>
      <section className="td-account-area yi-account-area"><div className="yi-account-area-heading"><div><span className="yi-panel-kicker">Account directory</span><h2>Connected channels</h2><p>{channels.length ? `${channels.length} ${channels.length === 1 ? 'channel' : 'channels'} available` : 'Connect a channel to begin'}</p></div>{channels.length > 0 && <a href="/api/youtube/auth/login" className="td-button td-button-secondary yi-connect-another"><Link2 size={15} /> Connect another account</a>}</div>
        <div className="yi-account-list">{channels.length ? channels.map(channel => {
          const selected = c.session?.selected === channel.id
          return <article className={'yi-account-card ' + (selected ? 'is-selected' : '')} key={channel.id}>
            <div className="yi-account-avatar">{channel.thumbnail ? <img className="yi-channel-avatar" src={channel.thumbnail} alt="" /> : <Link2 size={20} />}</div>
            <div className="yi-account-details"><span className={'yi-account-status ' + (selected ? 'is-selected' : '')}><i />{selected ? 'Selected channel' : 'Connected with Google'}</span><h3>{channel.title}</h3><p>YouTube channel</p></div>
            <button disabled={c.busy} className="td-button td-button-secondary yi-account-select" onClick={async () => { if (await c.chooseChannel(channel.id)) navigate('persona') }}>Select <ArrowRight size={16} /></button>
          </article>
        }) : <EmptyState icon={<Link2 size={24} />} title="No channel connected yet." action={<ConnectButton />}>Your connected channels will appear here.</EmptyState>}</div>
      </section>
    </div><StepActions back={() => navigate('platform')} next={() => navigate('persona')} disabled={!c.channel} />
  </section>
}