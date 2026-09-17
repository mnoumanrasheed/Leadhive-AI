import { useState } from 'react'
import { Check, Files, ImageIcon, LibraryBig } from 'lucide-react'
import { ConnectionRequired, EmptyState, ResourceStatus, ScreenHeading, StepActions } from '../DemoUI'
import { useYoutubeResource, type YouTubeController } from '../../../hooks/useYouTubeIntelligence'
import type { ScreenNavigation, Video } from '../types'

export function ContentSelection({ controller: c, navigate }: ScreenNavigation & { controller: YouTubeController }) {
  const [refresh, setRefresh] = useState(0)
  const resource = useYoutubeResource<{ videos: Video[] }>(c.channel ? '/videos?channel=' + encodeURIComponent(c.channel.id) : null, refresh)
  const videos = resource.data?.videos || []
  const allSelected = videos.length > 0 && videos.every(video => c.selection.includes(video.video_id))
  function toggle(id: string) { c.setSelection(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]) }
  return <section className="yi-content-library"><ScreenHeading eyebrow="Content workspace" title="Video library">Choose the videos LeadHive should monitor and analyze.</ScreenHeading>
    {!c.channel ? <ConnectionRequired /> : <>
      <ResourceStatus loading={resource.loading} error={resource.error} retry={() => setRefresh(n => n + 1)} />
      <div className="yi-library-shell"><div className="yi-library-toolbar"><div className="yi-library-title"><span><LibraryBig size={18} /></span><div><p className="td-eyebrow">Content inventory</p><h2>Your uploads</h2><small>{videos.length} {videos.length === 1 ? 'video' : 'videos'} available</small></div></div><div className="yi-library-selection"><span><strong>{c.selection.length}</strong> selected</span><label className="td-select-all"><input type="checkbox" disabled={!videos.length} checked={allSelected} onChange={() => c.setSelection(allSelected ? [] : videos.map(video => video.video_id))} />Select All</label></div></div>
        {videos.length > 0 && <div className="yi-video-grid">{videos.map(video => {
          const selected = c.selection.includes(video.video_id)
          return <label className={'yi-video-card ' + (selected ? 'is-selected' : '')} key={video.video_id}><input className="yi-video-checkbox" type="checkbox" checked={selected} onChange={() => toggle(video.video_id)} aria-label={'Select ' + video.title} /><span className="yi-video-thumbnail">{video.thumbnail ? <img src={video.thumbnail} alt="" loading="lazy" /> : <span className="yi-thumbnail-empty"><ImageIcon size={22} /><small>No thumbnail</small></span>}<span className="yi-video-selection-mark"><Check size={14} /></span></span><span className="yi-video-card-body"><span className="yi-video-state"><i />{selected ? 'Selected' : 'Available'}</span><strong>{video.title}</strong><small>YouTube video</small></span></label>
        })}</div>}
        {!videos.length && !resource.loading && !resource.error && <EmptyState icon={<Files size={24} />} title="No channel content available.">Your YouTube uploads will appear here.</EmptyState>}
      </div>
      <StepActions back={() => navigate('persona')} busy={c.busy} disabled={resource.loading || Boolean(resource.error)} next={async () => { if (await c.mutate('/selection', { video_ids: c.selection })) navigate('dashboard') }} label="Save & Open Dashboard" />
    </>}
  </section>
}
