import { useMemo } from 'react'
import type { TranscriptSegment } from '../api/client'
import { emojiFor, isEmphasized } from '../utils/captionStyle'

interface CaptionOverlayProps {
  segments: TranscriptSegment[]
  currentTime: number
}

function activeSegment(segments: TranscriptSegment[], time: number): TranscriptSegment | undefined {
  return segments.find((segment) => time >= segment.start && time < segment.end)
}

function activeWordIndex(segment: TranscriptSegment, words: string[], time: number): number {
  const duration = segment.end - segment.start
  if (duration <= 0 || words.length === 0) return -1
  const elapsed = time - segment.start
  const wordDuration = duration / words.length
  return Math.min(words.length - 1, Math.floor(elapsed / wordDuration))
}

export default function CaptionOverlay({ segments, currentTime }: CaptionOverlayProps) {
  const segment = activeSegment(segments, currentTime)
  const words = useMemo(() => (segment ? segment.text.trim().split(/\s+/) : []), [segment])

  if (!segment || words.length === 0) {
    return null
  }

  const highlightIndex = activeWordIndex(segment, words, currentTime)

  return (
    <div className="caption-overlay">
      <p className="caption-text">
        {words.map((word, index) => {
          const classes = ['caption-word']
          if (index === highlightIndex) classes.push('highlight')
          if (isEmphasized(word)) classes.push('emphasized')
          const emoji = emojiFor(word)

          return (
            <span key={`${word}-${index}`} className={classes.join(' ')}>
              {word.toUpperCase()}
              {emoji && <span className="caption-emoji">{emoji}</span>}
            </span>
          )
        })}
      </p>
    </div>
  )
}
