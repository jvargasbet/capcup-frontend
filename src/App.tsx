import { useRef, useState } from 'react'
import './App.css'
import { transcribeVideo, updateTranscriptSegment, uploadVideo, videoFileUrl } from './api/client'
import type { TranscriptSegment } from './api/client'
import SubtitleTimeline from './components/SubtitleTimeline'
import CaptionOverlay from './components/CaptionOverlay'
import TrackTimeline from './components/TrackTimeline'

type Status = 'idle' | 'uploading' | 'transcribing' | 'ready' | 'error'

function App() {
  const [videoId, setVideoId] = useState<string | null>(null)
  const [isAudio, setIsAudio] = useState(false)
  const [segments, setSegments] = useState<TranscriptSegment[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null)

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setErrorMessage(null)
    setSegments([])
    setStatus('uploading')

    try {
      const upload = await uploadVideo(file)
      setVideoId(upload.video_id)
      setIsAudio(upload.is_audio)
      setStatus('transcribing')

      const transcript = await transcribeVideo(upload.video_id)
      setSegments(transcript.segments)
      setStatus('ready')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Error desconocido')
    }
  }

  function handleSeek(time: number) {
    if (mediaRef.current) {
      mediaRef.current.currentTime = time
      mediaRef.current.play()
    }
  }

  async function handleEditText(index: number, text: string) {
    if (!videoId) return
    try {
      const updated = await updateTranscriptSegment(videoId, index, { text })
      setSegments(updated.segments)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error al editar el subtitulo')
    }
  }

  const isBusy = status === 'uploading' || status === 'transcribing'

  return (
    <div className="editor-layout">
      <header className="editor-header">
        <div className="brand">
          <span className="brand-mark">CC</span>
          <div>
            <h1>CapCup</h1>
            <p>Editor de video con subtitulos automaticos</p>
          </div>
        </div>

        <label className={`upload-button ${isBusy ? 'is-disabled' : ''}`}>
          {status === 'uploading' && 'Subiendo...'}
          {status === 'transcribing' && 'Transcribiendo...'}
          {(status === 'idle' || status === 'ready' || status === 'error') && '+ Subir video o audio'}
          <input
            type="file"
            accept="video/*,audio/*"
            onChange={handleFileChange}
            hidden
            disabled={isBusy}
          />
        </label>
      </header>

      <main className="editor-main">
        <section className="preview-panel">
          <div className="video-frame">
            {videoId ? (
              <div className="video-stage">
                {isAudio ? (
                  <div className="audio-stage">
                    <div className="audio-art">🎵</div>
                    <audio
                      ref={mediaRef as React.RefObject<HTMLAudioElement>}
                      className="audio-preview"
                      src={videoFileUrl(videoId)}
                      controls
                      onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                      onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                    />
                  </div>
                ) : (
                  <video
                    ref={mediaRef as React.RefObject<HTMLVideoElement>}
                    className="video-preview"
                    src={videoFileUrl(videoId)}
                    controls
                    onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                    onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                  />
                )}
                <CaptionOverlay segments={segments} currentTime={currentTime} />
              </div>
            ) : (
              <div className="video-placeholder">
                <div className="video-placeholder-icon">▶</div>
                <p>Sube un video o audio para empezar a editar</p>
              </div>
            )}

            {isBusy && (
              <div className="video-overlay-status">
                <span className="spinner" />
                {status === 'uploading' ? 'Subiendo...' : 'Detectando voz y generando subtitulos...'}
              </div>
            )}
          </div>

          {status === 'error' && <p className="status-msg error">{errorMessage}</p>}

          <TrackTimeline
            segments={segments}
            duration={duration}
            currentTime={currentTime}
            onSeek={handleSeek}
            isAudio={isAudio}
          />
        </section>

        <aside className="subtitle-panel">
          <h2>Transcripcion</h2>
          <p className="subtitle-hint">Doble click en un texto para editarlo</p>
          <div className="subtitle-panel-body">
            <SubtitleTimeline
              segments={segments}
              currentTime={currentTime}
              onSeek={handleSeek}
              onEditText={handleEditText}
            />
          </div>
        </aside>
      </main>
    </div>
  )
}

export default App
