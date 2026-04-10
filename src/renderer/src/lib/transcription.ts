import { getSettings } from '../store/settingsStore'

export type TranscriptionChunk = {
  text: string
  timestamp: number
}

export type TranscriptionHandler = (chunk: TranscriptionChunk) => void

// ─── Whisper transcription ───────────────────────────────────
async function transcribeBlob(blob: Blob, apiKey: string): Promise<string> {
  const form = new FormData()
  form.append('file', new File([blob], 'audio.webm', { type: blob.type || 'audio/webm' }))
  form.append('model', 'whisper-1')
  form.append('language', getSettings().transcriptionLanguage || 'en')

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error?.message || `Whisper error ${res.status}`)
  }

  return ((await res.json()).text as string).trim()
}

function bestMimeType(): string {
  const types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4']
  return types.find((t) => MediaRecorder.isTypeSupported(t)) ?? ''
}

// ─── MeetingCapture ──────────────────────────────────────────
export class MeetingCapture {
  private mediaRecorder: MediaRecorder | null = null
  private audioContext: AudioContext | null = null
  private streams: MediaStream[] = []
  private chunks: Blob[] = []
  private flushTimer: ReturnType<typeof setInterval> | null = null
  private transcriptParts: string[] = []
  private onChunk: TranscriptionHandler
  private mimeType: string = ''

  constructor(onChunk: TranscriptionHandler) {
    this.onChunk = onChunk
  }

  // ── Public start ────────────────────────────────────────────
  async start(): Promise<{ micOnly: boolean }> {
    this.audioContext = new AudioContext({ sampleRate: 16000 })
    const dest = this.audioContext.createMediaStreamDestination()
    let micOnly = true

    // 1. Microphone — always
    const micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: true,
        sampleRate: 16000,
        channelCount: 1,
      },
    })
    this.streams.push(micStream)
    this.audioContext.createMediaStreamSource(micStream).connect(dest)

    // 2. System audio — captures the other participants through your speakers
    //    Requires Screen Recording permission + macOS 13+
    try {
      const api = (window as any).api
      const sources: { id: string; name: string }[] = await api.capture.getSources()
      // prefer a screen source (id starts with "screen:") which carries system audio
      const screenSrc =
        sources.find((s) => s.id.startsWith('screen:')) ?? sources[0]

      if (screenSrc) {
        const sysStream = await (navigator.mediaDevices as any).getUserMedia({
          audio: {
            mandatory: {
              chromeMediaSource: 'desktop',
            },
          },
          video: {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: screenSrc.id,
              maxWidth: 1,
              maxHeight: 1,
              maxFrameRate: 1,
            },
          },
        })

        // Drop the video track — we only want audio
        sysStream.getVideoTracks().forEach((t: MediaStreamTrack) => t.stop())

        if (sysStream.getAudioTracks().length > 0) {
          this.streams.push(sysStream)
          this.audioContext.createMediaStreamSource(sysStream).connect(dest)
          micOnly = false
        }
      }
    } catch {
      // System audio unavailable (no Screen Recording permission, or pre-macOS 13)
      // Fall back to mic only — still useful
    }

    // 3. Record the mixed stream
    this.mimeType = bestMimeType()
    this.mediaRecorder = new MediaRecorder(
      dest.stream,
      this.mimeType ? { mimeType: this.mimeType } : undefined
    )

    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) this.chunks.push(e.data)
    }

    // Collect 1-second slices so we can flush incrementally
    this.mediaRecorder.start(1000)

    // Flush & transcribe every 30 seconds
    this.flushTimer = setInterval(() => this.flush(), 30_000)

    return { micOnly }
  }

  // ── Flush accumulated audio to Whisper ─────────────────────
  private async flush(): Promise<void> {
    if (this.chunks.length === 0) return

    const blob = new Blob(this.chunks, {
      type: this.mimeType || 'audio/webm',
    })
    this.chunks = []

    const settings = getSettings()
    const apiKey = settings.ai.openaiApiKey
    if (!apiKey) return // silently skip — user will see error at stop time

    try {
      const text = await transcribeBlob(blob, apiKey)
      if (text) {
        this.transcriptParts.push(text)
        this.onChunk({ text, timestamp: Date.now() })
      }
    } catch (err) {
      console.error('Transcription flush error:', err)
    }
  }

  // ── Stop and return full transcript ─────────────────────────
  async stop(): Promise<string> {
    // Stop the periodic flush timer
    if (this.flushTimer) {
      clearInterval(this.flushTimer)
      this.flushTimer = null
    }

    // Stop the recorder and wait for its final dataavailable event
    await new Promise<void>((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        resolve()
        return
      }
      this.mediaRecorder.onstop = () => resolve()
      this.mediaRecorder.stop()
    })

    // Flush whatever is left
    await this.flush()

    // Release all tracks and audio context
    this.streams.forEach((s) => s.getTracks().forEach((t) => t.stop()))
    this.streams = []
    this.audioContext?.close()
    this.audioContext = null
    this.mediaRecorder = null

    const full = this.transcriptParts.join(' ')
    this.transcriptParts = []
    return full
  }

  get isRecording(): boolean {
    return this.mediaRecorder !== null && this.mediaRecorder.state === 'recording'
  }
}
