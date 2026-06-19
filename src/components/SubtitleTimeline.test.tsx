import { render, screen, fireEvent } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import SubtitleTimeline from './SubtitleTimeline'

const segments = [
  { start: 0, end: 1.5, text: 'Hola a todos' },
  { start: 1.5, end: 3, text: 'bienvenidos al editor' },
]

describe('SubtitleTimeline', () => {
  it('shows an empty state when there are no segments', () => {
    render(<SubtitleTimeline segments={[]} currentTime={0} onSeek={() => {}} />)
    expect(screen.getByText(/Aun no hay transcripcion/i)).toBeInTheDocument()
  })

  it('renders every segment with its text', () => {
    render(<SubtitleTimeline segments={segments} currentTime={0} onSeek={() => {}} />)
    expect(screen.getByText('Hola a todos')).toBeInTheDocument()
    expect(screen.getByText('bienvenidos al editor')).toBeInTheDocument()
  })

  it('marks the segment matching currentTime as active', () => {
    render(<SubtitleTimeline segments={segments} currentTime={2} onSeek={() => {}} />)
    const activeItem = screen.getByText('bienvenidos al editor').closest('li')
    expect(activeItem).toHaveClass('active')
  })

  it('calls onSeek with the segment start time when clicked', () => {
    const onSeek = vi.fn()
    render(<SubtitleTimeline segments={segments} currentTime={0} onSeek={onSeek} />)
    fireEvent.click(screen.getByText('bienvenidos al editor'))
    expect(onSeek).toHaveBeenCalledWith(1.5)
  })

  it('enters edit mode on double click and commits the new text on blur', () => {
    const onEditText = vi.fn()
    render(
      <SubtitleTimeline segments={segments} currentTime={0} onSeek={() => {}} onEditText={onEditText} />
    )

    fireEvent.doubleClick(screen.getByText('Hola a todos'))
    const input = screen.getByDisplayValue('Hola a todos')
    fireEvent.change(input, { target: { value: 'Hola a todas' } })
    fireEvent.blur(input)

    expect(onEditText).toHaveBeenCalledWith(0, 'Hola a todas')
  })

  it('commits the edit on Enter key', () => {
    const onEditText = vi.fn()
    render(
      <SubtitleTimeline segments={segments} currentTime={0} onSeek={() => {}} onEditText={onEditText} />
    )

    fireEvent.doubleClick(screen.getByText('Hola a todos'))
    const input = screen.getByDisplayValue('Hola a todos')
    fireEvent.change(input, { target: { value: 'Texto editado' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(onEditText).toHaveBeenCalledWith(0, 'Texto editado')
  })

  it('does not call onEditText if the text is unchanged', () => {
    const onEditText = vi.fn()
    render(
      <SubtitleTimeline segments={segments} currentTime={0} onSeek={() => {}} onEditText={onEditText} />
    )

    fireEvent.doubleClick(screen.getByText('Hola a todos'))
    fireEvent.blur(screen.getByDisplayValue('Hola a todos'))

    expect(onEditText).not.toHaveBeenCalled()
  })
})
