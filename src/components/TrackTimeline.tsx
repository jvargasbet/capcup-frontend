import type { TranscriptSegment } from '../api/client'

interface TrackTimelineProps {
  segments: TranscriptSegment[]
  duration: number
  currentTime: number
  isAudio: boolean
  onSeek: (time: number) => void
}

export default function TrackTimeline({
  segments,
  duration,
  currentTime,
  isAudio,
  onSeek,
}: TrackTimelineProps) {
  if (duration <= 0) {
    return null
  }

  const playheadPct = Math.min(100, (currentTime / duration) * 100)

  function handleTrackClick(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - rect.left) / rect.width
    onSeek(Math.max(0, Math.min(duration, ratio * duration)))
  }

  return (
    <div className="track-timeline">
      <div className="track-row" onClick={handleTrackClick}>
        <span className="track-label">{isAudio ? '🎵 Audio' : '🎬 Video'}</span>
        <div className="track-lane media-lane">
          <div className="media-clip" />
        </div>
      </div>

      <div className="track-row" onClick={handleTrackClick}>
        <span className="track-label">Tt Subtitulos</span>
        <div className="track-lane subtitle-lane">
          {segments.map((segment, index) => {
            const left = (segment.start / duration) * 100
            const width = ((segment.end - segment.start) / duration) * 100
            const isActive = currentTime >= segment.start && currentTime < segment.end
            return (
              <div
                key={`${segment.start}-${index}`}
                className={`subtitle-clip ${isActive ? 'active' : ''}`}
                style={{ left: `${left}%`, width: `${Math.max(width, 0.6)}%` }}
                title={segment.text}
              />
            )
          })}
        </div>
      </div>

      <div className="track-playhead" style={{ left: `${playheadPct}%` }} />
    </div>
  )
}
