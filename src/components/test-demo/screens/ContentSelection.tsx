import { useState } from 'react'
import { Check, Files, ImageIcon } from 'lucide-react'
import { ConnectionRequired, EmptyState, Panel, PanelHeader, ResourceStatus, ScreenHeading, StepActions } from '../DemoUI'
import { useYoutubeResource, type YouTubeController } from '../../../hooks/useYouTubeIntelligence'
import type { ScreenNavigation, Video } from '../types'

export function ContentSelection({ controller: c, navigate }: ScreenNavigation & { controller: YouTubeController }) {
  const [refresh, setRefresh] = useState(0)
  const resource = useYoutubeResource<{ videos: Video[] }>(
    c.channel ? '/videos?channel=' + encodeURIComponent(c.channel.id) : null,
    refresh
  )
  const videos = resource.data?.videos || []
  const allSelected = videos.length > 0 && videos.every(video => c.selection.includes(video.video_id))

  function toggle(id: string) {
    c.setSelection(current => (current.includes(id) ? current.filter(value => value !== id) : [...current, id]))
  }

  return (
    <section className="yi-content-library">
      <div className="td-heading-with-action">
        <ScreenHeading eyebrow="Video Library" title="Select monitored videos">
          Choose the YouTube videos LeadHive should track, analyze, and reply to.
        </ScreenHeading>
        {c.channel && (
          <div className="yi-library-selection">
            <label className="td-select-all">
              <input
                type="checkbox"
                disabled={!videos.length}
                checked={allSelected}
                onChange={() => c.setSelection(allSelected ? [] : videos.map(video => video.video_id))}
              />
              Select All
            </label>
            <span className="yi-selection-count">
              <strong>{c.selection.length}</strong> of {videos.length} selected
            </span>
          </div>
        )}
      </div>

      {!c.channel ? (
        <ConnectionRequired />
      ) : (
        <>
          <ResourceStatus loading={resource.loading} error={resource.error} retry={() => setRefresh(n => n + 1)} />

          <Panel className="yi-library-shell">
            <PanelHeader title="Channel uploads">
              {videos.length} {videos.length === 1 ? 'video' : 'videos'} available from {c.channel.title}
            </PanelHeader>

            {videos.length > 0 && (
              <div className="yi-video-grid">
                {videos.map(video => {
                  const selected = c.selection.includes(video.video_id)
                  return (
                    <label className={'yi-video-card ' + (selected ? 'is-selected' : '')} key={video.video_id}>
                      <input
                        className="yi-video-checkbox"
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggle(video.video_id)}
                        aria-label={'Select ' + video.title}
                      />
                      <span className="yi-video-thumbnail">
                        {video.thumbnail ? (
                          <img src={video.thumbnail} alt="" loading="lazy" />
                        ) : (
                          <span className="yi-thumbnail-empty">
                            <ImageIcon size={22} />
                            <small>No thumbnail</small>
                          </span>
                        )}
                        <span className="yi-video-selection-mark">
                          <Check size={14} />
                        </span>
                      </span>
                      <span className="yi-video-card-body">
                        <strong>{video.title}</strong>
                        <small>{selected ? 'Monitored' : 'Click to monitor'}</small>
                      </span>
                    </label>
                  )
                })}
              </div>
            )}

            {!videos.length && !resource.loading && !resource.error && (
              <EmptyState icon={<Files size={24} />} title="No channel content found.">
                Ensure your connected YouTube channel has public videos uploaded.
              </EmptyState>
            )}
          </Panel>

          <StepActions
            back={() => navigate('persona')}
            busy={c.busy}
            disabled={resource.loading || Boolean(resource.error)}
            next={async () => {
              if (await c.mutate('/selection', { video_ids: c.selection })) navigate('dashboard')
            }}
            label="Save & Open Dashboard"
          />
        </>
      )}
    </section>
  )
}
