import { useState } from 'react'
import { ArrowLeft, ChartNoAxesColumn, ExternalLink } from 'lucide-react'
import { ConnectionRequired, EmptyState, ResourceStatus, ScreenHeading } from '../DemoUI'
import { useYoutubeResource, type YouTubeController } from '../../../hooks/useYouTubeIntelligence'
import type { ScreenNavigation, VideoMetrics } from '../types'

export function AnalyticsDashboard({ controller: c, navigate }: ScreenNavigation & { controller: YouTubeController }) {
  const [refresh, setRefresh] = useState(0)
  const resource = useYoutubeResource<{ videos: VideoMetrics[] }>(c.channel ? '/analytics?channel=' + encodeURIComponent(c.channel.id) : null, refresh)
  const videos = resource.data?.videos || []
  return <section><div className="td-heading-with-action"><ScreenHeading eyebrow="Performance" title="Video insights">Reported performance across your monitored YouTube content.</ScreenHeading><button className="td-button td-button-secondary" onClick={() => navigate('dashboard')}><ArrowLeft size={16} /> Back to Overview</button></div>
    {!c.channel ? <ConnectionRequired /> : <>
      <ResourceStatus loading={resource.loading} error={resource.error} retry={() => setRefresh(n => n + 1)} />
      <div className="td-section-heading td-analytics-heading"><h2>Content performance</h2><button className="td-text-action" onClick={() => setRefresh(n => n + 1)}>Refresh data</button></div>
      <div className="td-table-frame"><table className="td-table td-analytics-table"><caption className="td-sr-only">YouTube video statistics</caption><thead><tr><th scope="col">Content</th><th scope="col">Views</th><th scope="col">Comments</th><th scope="col">Likes</th></tr></thead><tbody>
        {videos.map(video => <tr key={video.video_id}><td><a className="yi-video-row" href={'https://www.youtube.com/watch?v=' + encodeURIComponent(video.video_id)} target="_blank" rel="noreferrer">{video.thumbnail && <img src={video.thumbnail} alt="" loading="lazy" />}<span>{video.title}</span><ExternalLink size={14} /></a></td><td className="yi-cell">{video.views.toLocaleString()}</td><td className="yi-cell">{video.comments.toLocaleString()}</td><td className="yi-cell">{video.likes.toLocaleString()}</td></tr>)}
        {!videos.length && !resource.loading && !resource.error && <tr><td colSpan={4}><EmptyState icon={<ChartNoAxesColumn size={24} />} title="No analytics available yet.">Select videos from your channel to load their performance.</EmptyState></td></tr>}
      </tbody></table></div>
    </>}
  </section>
}
