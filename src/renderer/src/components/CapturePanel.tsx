import { useState, useRef } from 'react'
import { Mic, MicOff, X, Radio, Loader } from 'lucide-react'
import { MeetingCapture } from '../lib/transcription'
import { generateMeetingNotes, buildTipTapDoc } from '../lib/noteGenerator'
import { getSettings } from '../store/settingsStore'
import clsx from 'clsx'

type Phase = 'idle' | 'recording' | 'generating' | 'done' | 'error'

interface Props {
  onClose: () => void
  onNotesReady: (title: string, tiptapContent: string) => void
  onCaptureStateChange: (capturing: boolean) => void
}

export default function CapturePanel({ onClose, onNotesReady, onCaptureStateChange }: Props) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [statusLine, setStatusLine] = useState('')
  const [micOnly, setMicOnly] = useState(false)
  const [error, setError] = useState('')
  const [liveChunks, setLiveChunks] = useState<string[]>([])
  const captureRef = useRef<MeetingCapture | null>(null)

  const start = async () => {
    setError('')
    setLiveChunks([])
    setPhase('recording')
    setStatusLine('Starting...')

    try {
      // Request mic permission
      const api = (window as any).api
      const micOk = await api.permissions.microphone()
      if (!micOk) {
        setError('Microphone permission denied. Allow access in System Preferences → Privacy → Microphone.')
        setPhase('error')
        return
      }

      const capture = new MeetingCapture((chunk) => {
        // Live transcript preview
        setLiveChunks((prev) => [...prev, chunk.text])
        setStatusLine(`Last heard: ${new Date().toLocaleTimeString()}`)
      })

      const result = await capture.start()
      captureRef.current = capture
      onCaptureStateChange(true)
      setMicOnly(result.micOnly)

      setStatusLine(
        result.micOnly
          ? 'Recording microphone only — grant Screen Recording permission to also capture other participants.'
          : 'Recording microphone + meeting audio.'
      )
    } catch (err: any) {
      setError(err.message || 'Failed to start recording.')
      setPhase('error')
      onCaptureStateChange(false)
    }
  }

  const stop = async () => {
    if (!captureRef.current) return

    setPhase('generating')
    setStatusLine('Stopping recording...')
    onCaptureStateChange(false)

    let transcript = ''
    try {
      transcript = await captureRef.current.stop()
      captureRef.current = null
    } catch (err: any) {
      setError(err.message || 'Error stopping recording.')
      setPhase('error')
      return
    }

    if (!transcript.trim()) {
      setError('Nothing was transcribed. Make sure your OpenAI API key is set in Settings and speak clearly.')
      setPhase('error')
      return
    }

    // Generate structured notes with the configured AI provider
    setStatusLine('Generating notes with AI...')
    try {
      const settings = getSettings()
      const generated = await generateMeetingNotes(transcript, settings.ai)
      const tiptapDoc = buildTipTapDoc(generated)
      onNotesReady(generated.title, JSON.stringify(tiptapDoc))
      setPhase('done')
      setStatusLine('Notes created!')
    } catch (err: any) {
      // AI failed — still surface the raw transcript
      const rawDoc = {
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: 'Transcript' }] },
          ...transcript.split('. ').filter(Boolean).map((s) => ({
            type: 'paragraph',
            content: [{ type: 'text', text: s.trim() + '.' }],
          })),
        ],
      }
      onNotesReady('Meeting Notes', JSON.stringify(rawDoc))
      setPhase('done')
      setStatusLine(`AI note generation failed (${err.message}) — raw transcript inserted.`)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-900 px-5 py-4">
        <div className="flex items-center gap-2">
          <Radio
            size={13}
            className={phase === 'recording' ? 'text-zinc-900 dark:text-zinc-100 animate-pulse' : 'text-zinc-400'}
          />
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Capture Meeting
          </span>
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">

        {/* How it works note */}
        {phase === 'idle' && (
          <div className="space-y-3 text-xs text-zinc-500 dark:text-zinc-500">
            <p>
              Captures your microphone and, if Screen Recording permission is granted, the other participants through your speakers.
            </p>
            <p>
              When you stop, the full recording is transcribed with Whisper and structured into notes by your AI provider.
            </p>
            <div className="rounded border border-zinc-100 dark:border-zinc-900 p-3 space-y-1">
              <p className="font-medium text-zinc-700 dark:text-zinc-400">Requirements</p>
              <p>· OpenAI API key (for Whisper transcription)</p>
              <p>· Any AI key (for note generation)</p>
              <p>· Screen Recording permission (optional — for capturing other participants)</p>
            </div>
          </div>
        )}

        {/* Recording state */}
        {phase === 'recording' && (
          <div className="space-y-4">
            {micOnly && (
              <div className="rounded border border-zinc-100 dark:border-zinc-900 px-3 py-2.5 text-xs text-zinc-500">
                Microphone only. To also capture other participants, grant Screen Recording permission in System Preferences → Privacy.
              </div>
            )}

            {/* Live transcript preview */}
            {liveChunks.length > 0 && (
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-700">Live transcript</p>
                <div className="max-h-48 overflow-y-auto space-y-1">
                  {liveChunks.map((chunk, i) => (
                    <p key={i} className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {chunk}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Generating state */}
        {phase === 'generating' && (
          <div className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
            <Loader size={14} className="animate-spin shrink-0" />
            <span>Generating structured notes…</span>
          </div>
        )}

        {/* Done */}
        {phase === 'done' && (
          <p className="text-xs text-zinc-500">Notes have been added to your note.</p>
        )}

        {/* Error */}
        {error && (
          <div className="rounded border border-zinc-200 dark:border-zinc-800 px-3 py-2.5 text-xs text-zinc-600 dark:text-zinc-400">
            {error}
          </div>
        )}

        {/* Status line */}
        {statusLine && phase !== 'idle' && (
          <p className="text-[11px] text-zinc-400 dark:text-zinc-700">{statusLine}</p>
        )}
      </div>

      {/* Footer button */}
      <div className="border-t border-zinc-100 dark:border-zinc-900 p-4">
        {phase === 'recording' ? (
          <button
            onClick={stop}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 py-2.5 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
          >
            <MicOff size={14} />
            Stop & Generate Notes
          </button>
        ) : phase === 'generating' ? (
          <button
            disabled
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 py-2.5 text-sm font-medium text-zinc-400 dark:text-zinc-600 cursor-not-allowed"
          >
            <Loader size={14} className="animate-spin" />
            Generating…
          </button>
        ) : (
          <button
            onClick={phase === 'done' || phase === 'error' ? () => { setPhase('idle'); setError(''); setLiveChunks([]) } : start}
            className={clsx(
              'flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors',
              phase === 'done' || phase === 'error'
                ? 'border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                : 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200'
            )}
          >
            <Mic size={14} />
            {phase === 'done' ? 'Record Another' : phase === 'error' ? 'Try Again' : 'Start Recording'}
          </button>
        )}
      </div>
    </div>
  )
}
