import { useRef, useState } from 'react'
import './App.css'
import { transcribeVideo, uploadVideo, videoFileUrl } from './api/client'
import type { TranscriptSegment } from './api/client'
import SubtitleTimeline from './components/SubtitleTimeline'
import CaptionOverlay from './components/CaptionOverlay'

type Status = 'idle' | 'uploading' | 'transcribing' | 'ready' | 'error'

function App() {
  const [videoId, setVideoId] = useState<string | null>(null)
  const [segments, setSegments] = useState<TranscriptSegment[]>([])
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setErrorMessage(null)
    setSegments([])
    setStatus('uploading')

    try {
      const upload = await uploadVideo(file)
      setVideoId(upload.video_id)
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
    if (videoRef.current) {
      videoRef.current.currentTime = time
      videoRef.current.play()
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
          {(status === 'idle' || status === 'ready' || status === 'error') && '+ Subir video'}
          <input type="file" accept="video/*" onChange={handleFileChange} hidden disabled={isBusy} />
        </label>
      </header>

      <main className="editor-main">
        <section className="preview-panel">
          <div className="video-frame">
            {videoId ? (
              <div className="video-stage">
                <video
                  ref={videoRef}
                  className="video-preview"
                  src={videoFileUrl(videoId)}
                  controls
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                />
                <CaptionOverlay segments={segments} currentTime={currentTime} />
              </div>
            ) : (
              <div className="video-placeholder">
                <div className="video-placeholder-icon">▶</div>
                <p>Sube un video para empezar a editar</p>
              </div>
            )}

            {isBusy && (
              <div className="video-overlay-status">
                <span className="spinner" />
                {status === 'uploading' ? 'Subiendo video...' : 'Transcribiendo audio...'}
              </div>
            )}
          </div>

          {status === 'error' && <p className="status-msg error">{errorMessage}</p>}
        </section>

        <aside className="subtitle-panel">
          <h2>Transcripcion</h2>
          <div className="subtitle-panel-body">
            <SubtitleTimeline segments={segments} currentTime={currentTime} onSeek={handleSeek} />
          </div>
        </aside>
      </main>
    </div>
  )
}

export default App
