import { useState } from 'react'
import { ArrowLeft, ChartNoAxesColumn, ExternalLink, RefreshCw } from 'lucide-react'
import { ConnectionRequired, EmptyState, Panel, PanelHeader, ResourceStatus, ScreenHeading } from '../DemoUI'
import { useYoutubeResource, type YouTubeController } from '../../../hooks/useYouTubeIntelligence'
import type { ScreenNavigation, VideoMetrics } from '../types'

export function AnalyticsDashboard({ controller: c, navigate }: ScreenNavigation & { controller: YouTubeController }) {
  const [refresh, setRefresh] = useState(0)
  const resource = useYoutubeResource<{ videos: VideoMetrics[] }>(
    c.channel ? '/analytics?channel=' + encodeURIComponent(c.channel.id) : null,
    refresh
  )
  const videos = resource.data?.videos || []

  return (
    <section className="yi-analytics-dashboard">
      <div className="td-heading-with-action">
        <ScreenHeading eyebrow="Analytics & Insights" title="Monitored video insights">
          Real-time view counts, comments, and community engagement metrics verified from YouTube.
        </ScreenHeading>
        <div className="yi-analytics-actions">
          <button className="td-button td-button-secondary" onClick={() => setRefresh(n => n + 1)}>
            <RefreshCw size={14} className={resource.loading ? 'td-spin' : ''} /> Refresh Data
          </button>
          <button className="td-button td-button-secondary" onClick={() => navigate('dashboard')}>
            <ArrowLeft size={15} /> Back to Overview
          </button>
        </div>
      </div>

      {!c.channel ? (
        <ConnectionRequired />
      ) : (
        <>
          <ResourceStatus loading={resource.loading} error={resource.error} retry={() => setRefresh(n => n + 1)} />

          <Panel className="td-table-frame">
            <PanelHeader
              title="Monitored content performance"
              action={<span className="yi-video-count-badge">{videos.length} videos tracked</span>}
            >
              Real metrics reported directly via the YouTube Data API.
            </PanelHeader>

            <div className="td-table-wrapper">
              <table className="td-table td-analytics-table">
                <caption className="td-sr-only">YouTube video engagement metrics</caption>
                <thead>
                  <tr>
                    <th scope="col">Content</th>
                    <th scope="col" className="td-col-num">Views</th>
                    <th scope="col" className="td-col-num">Comments</th>
                    <th scope="col" className="td-col-num">Likes</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map(video => (
                    <tr key={video.video_id}>
                      <td>
                        <a
                          className="yi-video-row"
                          href={'https://www.youtube.com/watch?v=' + encodeURIComponent(video.video_id)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {video.thumbnail && <img src={video.thumbnail} alt="" loading="lazy" />}
                          <span className="yi-video-row-title">{video.title}</span>
                          <ExternalLink size={13} className="yi-video-ext" />
                        </a>
                      </td>
                      <td className="td-col-num yi-cell">{video.views.toLocaleString()}</td>
                      <td className="td-col-num yi-cell">{video.comments.toLocaleString()}</td>
                      <td className="td-col-num yi-cell">{video.likes.toLocaleString()}</td>
                    </tr>
                  ))}
                  {!videos.length && !resource.loading && !resource.error && (
                    <tr>
                      <td colSpan={4}>
                        <EmptyState icon={<ChartNoAxesColumn size={24} />} title="No analytics available yet.">
                          Select videos from your library to load their live performance statistics.
                        </EmptyState>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Panel>
        </>
      )}
    </section>
  )
}
