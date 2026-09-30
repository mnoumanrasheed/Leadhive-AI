import { Check, Files, ImageIcon } from 'lucide-react'
import { ConnectionRequired, EmptyState, Panel, PanelHeader, ResourceStatus, ScreenHeading, StepActions } from '../DemoUI'
import { type YouTubeController } from '../../../hooks/useYouTubeIntelligence'
import type { ScreenNavigation } from '../types'

export function ContentSelection({ controller: c, navigate }: ScreenNavigation & { controller: YouTubeController }) {
  const videos = c.videos
  const allSelected = videos.length > 0 && videos.every(video => c.selectedVideoIds.includes(video.video_id))

  function toggle(id: string) {
    c.setSelectedVideoIds(current =>
      current.includes(id) ? current.filter(value => value !== id) : [...current, id]
    )
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
                onChange={() => c.setSelectedVideoIds(allSelected ? [] : videos.map(video => video.video_id))}
              />
              Select All
            </label>
            <span className="yi-selection-count">
              <strong>{c.selectedVideoIds.length}</strong> of {videos.length} selected
            </span>
          </div>
        )}
      </div>

      {!c.channel ? (
        <ConnectionRequired />
      ) : (
        <>
          <ResourceStatus loading={c.isLoadingVideos} error={c.error} retry={c.reload} />

          <Panel className="yi-library-shell">
            <PanelHeader title="Channel uploads">
              {videos.length} {videos.length === 1 ? 'video' : 'videos'} available from {c.channel.title}
            </PanelHeader>

            {videos.length > 0 && (
              <div className="yi-video-grid">
                {videos.map(video => {
                  const selected = c.selectedVideoIds.includes(video.video_id)
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

            {!videos.length && !c.isLoadingVideos && !c.error && (
              <EmptyState icon={<Files size={24} />} title="No channel content found.">
                Ensure your connected YouTube channel has public videos uploaded.
              </EmptyState>
            )}
          </Panel>

          <StepActions
            back={() => navigate('persona')}
            busy={c.isSavingSelection}
            disabled={c.isLoadingVideos || Boolean(c.error)}
            next={async () => {
              if (await c.saveSelection(c.selectedVideoIds)) navigate('dashboard')
            }}
            label="Save & Open Dashboard"
          />
        </>
      )}
    </section>
  )
}
