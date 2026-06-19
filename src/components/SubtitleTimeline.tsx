import { useState } from 'react'
import type { TranscriptSegment } from '../api/client'

interface SubtitleTimelineProps {
  segments: TranscriptSegment[]
  currentTime: number
  onSeek: (time: number) => void
  onEditText?: (index: number, text: string) => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function SubtitleTimeline({
  segments,
  currentTime,
  onSeek,
  onEditText,
}: SubtitleTimelineProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [draftText, setDraftText] = useState('')

  if (segments.length === 0) {
    return <p className="subtitle-empty">Aun no hay transcripcion. Sube un video y transcribelo.</p>
  }

  function startEditing(index: number, text: string) {
    setEditingIndex(index)
    setDraftText(text)
  }

  function commitEdit(index: number) {
    const trimmed = draftText.trim()
    if (trimmed && trimmed !== segments[index].text && onEditText) {
      onEditText(index, trimmed)
    }
    setEditingIndex(null)
  }

  return (
    <ul className="subtitle-list">
      {segments.map((segment, index) => {
        const isActive = currentTime >= segment.start && currentTime < segment.end
        const isEditing = editingIndex === index

        return (
          <li
            key={`${segment.start}-${index}`}
            className={isActive ? 'subtitle-item active' : 'subtitle-item'}
          >
            <span className="subtitle-time" onClick={() => onSeek(segment.start)}>
              {formatTime(segment.start)} - {formatTime(segment.end)}
            </span>

            {isEditing ? (
              <input
                className="subtitle-edit-input"
                autoFocus
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                onBlur={() => commitEdit(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitEdit(index)
                  if (e.key === 'Escape') setEditingIndex(null)
                }}
              />
            ) : (
              <span
                className="subtitle-text"
                onClick={() => onSeek(segment.start)}
                onDoubleClick={() => startEditing(index, segment.text)}
                title="Doble click para editar"
              >
                {segment.text}
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
