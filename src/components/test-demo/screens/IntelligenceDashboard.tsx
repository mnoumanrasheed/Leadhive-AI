import { useEffect, useState } from 'react'
import { animate, motion, useReducedMotion } from 'motion/react'
import { ArrowRight, ChartNoAxesColumn, Eye, MessageSquare, TrendingUp, Users } from 'lucide-react'
import { ConnectionRequired, EmptyState, ResourceStatus, ScreenHeading } from '../DemoUI'
import { useYoutubeResource, type YouTubeController } from '../../../hooks/useYouTubeIntelligence'
import type { ScreenNavigation, VideoMetrics } from '../types'

function Counter({ value }: { value: number | null }) {
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(value ?? 0)
  useEffect(() => {
    if (value === null) return
    if (reduced) { setDisplay(value); return }
    const control = animate(0, value, { duration: .7, onUpdate: current => setDisplay(Math.round(current)) })
    return () => control.stop()
  }, [value, reduced])
  return <strong>{value === null ? <span aria-label="Not available">—</span> : display.toLocaleString()}</strong>
}

export function IntelligenceDashboard({ controller: c, navigate }: ScreenNavigation & { controller: YouTubeController }) {
  const [refresh, setRefresh] = useState(0)
  const resource = useYoutubeResource<{ videos: VideoMetrics[] }>(c.channel ? '/analytics?channel=' + encodeURIComponent(c.channel.id) : null, refresh)
  const videos = resource.data?.videos || []
  const sum = (field: 'views' | 'comments' | 'likes') => videos.length ? videos.reduce((total, video) => total + video[field], 0) : null
  const subscribers = c.channel?.subscribers == null ? null : Number(c.channel.subscribers)
  const metrics = [
    { label: 'Channel subscribers', value: subscribers, icon: Users },
    { label: 'Monitored views', value: sum('views'), icon: Eye },
    { label: 'Monitored comments', value: sum('comments'), icon: MessageSquare },
    { label: 'Monitored likes', value: sum('likes'), icon: TrendingUp },
  ]
  const ranked = [...videos].sort((a, b) => b.views - a.views).slice(0, 5)
  const max = Math.max(...ranked.map(video => video.views), 1)
  const reduced = useReducedMotion()

  return <section className="yi-intelligence-dashboard">
    <div className="td-heading-with-action yi-dashboard-heading"><ScreenHeading eyebrow="YouTube Intelligence" title="Your channel, understood.">A connected view of performance, content, and engagement.</ScreenHeading><button className="td-button td-button-primary yi-dashboard-cta" onClick={() => navigate('command-center')}>Open AI Command Center <ArrowRight size={17} aria-hidden="true" /></button></div>
    <ResourceStatus loading={resource.loading} error={resource.error} retry={() => setRefresh(n => n + 1)} />

    <div className="yi-metrics" aria-label="Channel key performance indicators">{metrics.map(({ label, value, icon: Icon }, index) => <article className="yi-metric" key={label} data-accent={index}>
      <div className="yi-metric-head"><span>{label}</span><span className="yi-metric-icon"><Icon size={17} /></span></div>
      <Counter value={value} />
      <div className="yi-metric-meta"><i aria-hidden="true" /><small>{value === null ? 'Awaiting connected data' : 'YouTube reported data'}</small></div>
    </article>)}</div>

    <div className="yi-dashboard-primary">
      <article className="yi-panel yi-performance">
        <div className="yi-dashboard-panel-header"><div><span className="yi-panel-kicker">Content performance</span><h2>Video performance</h2><p>Your most viewed monitored videos.</p></div><button className="td-button td-button-secondary yi-dashboard-insights" onClick={() => navigate('analytics')}>Explore Insights <ArrowRight size={15} aria-hidden="true" /></button></div>
        {ranked.length ? <div className="yi-bars" role="img" aria-label="Most viewed monitored videos">{ranked.map((video, index) => <div className="yi-performance-row" key={video.video_id}>
          <span className="yi-performance-rank">{String(index + 1).padStart(2, '0')}</span>
          <div className="yi-performance-data"><div className="yi-bar-label"><span>{video.title}</span><strong>{video.views.toLocaleString()} <small>views</small></strong></div><div className="yi-bar-track"><motion.div initial={false} animate={{ width: (video.views / max * 100) + '%' }} transition={{ duration: reduced ? 0 : .6 }} /></div></div>
        </div>)}</div> : <EmptyState icon={<ChartNoAxesColumn size={25} />} title="Your performance view starts here.">Select channel videos to see their views, comments, and likes.</EmptyState>}
      </article>

      <article className="yi-panel yi-channel-panel">
        <div className="yi-dashboard-panel-header"><div><span className="yi-panel-kicker">Connected source</span><h2>Channel analysis</h2></div></div>
        {c.channel ? <div className="yi-channel-summary"><div className="yi-channel-identity">{c.channel.thumbnail ? <img src={c.channel.thumbnail} alt="" /> : <span className="yi-channel-fallback"><Users size={18} /></span>}<div><span className="yi-connected-label"><i /> Connected</span><h2>{c.channel.title}</h2></div></div><dl><div><dt>Channel views</dt><dd>{c.channel.views == null ? 'Not available' : Number(c.channel.views).toLocaleString()}</dd></div><div><dt>Published videos</dt><dd>{c.channel.videos == null ? 'Not available' : Number(c.channel.videos).toLocaleString()}</dd></div><div><dt>Connection</dt><dd>Connected</dd></div></dl><button className="td-button td-button-secondary yi-dashboard-manage" onClick={() => navigate('channel')}>Manage connection <ArrowRight size={15} aria-hidden="true" /></button></div> : <ConnectionRequired />}
      </article>
    </div>

  </section>
}
