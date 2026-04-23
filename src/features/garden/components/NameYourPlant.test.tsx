import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// Mock framer-motion before any component imports
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...rest }: React.HTMLAttributes<HTMLDivElement> & { animate?: unknown; transition?: unknown; initial?: unknown; exit?: unknown }) =>
      <div {...rest}>{children}</div>,
    button: ({ children, ...rest }: React.HTMLAttributes<HTMLButtonElement> & { animate?: unknown; transition?: unknown; whileHover?: unknown; whileTap?: unknown }) =>
      <button {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: vi.fn(() => false),
}))

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    rpc: vi.fn(),
    auth: {
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
    },
  },
}))

import type { PlantSpecies } from '../types'
import { NameYourPlant } from './NameYourPlant'

// ── Helpers ───────────────────────────────────────────────────────────────────

function renderModal(overrides?: {
  species?: PlantSpecies
  onConfirm?: (name: string) => void
  onSkip?: () => void
}) {
  const onConfirm = overrides?.onConfirm ?? vi.fn()
  const onSkip = overrides?.onSkip ?? vi.fn()
  const species = overrides?.species ?? 'girasol'

  render(
    <NameYourPlant
      species={species}
      onConfirm={onConfirm}
      onSkip={onSkip}
    />
  )

  return { onConfirm, onSkip }
}

// ── Modal renders ─────────────────────────────────────────────────────────────

describe('NameYourPlant — modal content', () => {
  it('renders modal content without crashing', () => {
    // Arrange / Act
    renderModal()

    // Assert — the modal should have some visible content
    expect(document.body.firstChild).not.toBeNull()
  })

  it('renders a text input for entering the plant name', () => {
    // Arrange / Act
    renderModal()

    // Assert
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  it('renders a confirm button', () => {
    // Arrange / Act
    renderModal()

    // Assert
    const confirmBtn = screen.getByRole('button', { name: /confirmar|nombrar|listo|guardar|confirm|name|save/i })
    expect(confirmBtn).toBeInTheDocument()
  })

  it('renders a skip option', () => {
    // Arrange / Act
    renderModal()

    // Assert — skip can be a button or a link
    const skipEl =
      screen.queryByRole('button', { name: /saltar|omitir|skip|después|later/i }) ??
      screen.queryByText(/saltar|omitir|skip/i)
    expect(skipEl).toBeInTheDocument()
  })
})

// ── Suggested names ───────────────────────────────────────────────────────────

describe('NameYourPlant — suggested names', () => {
  it('shows suggested name chips for girasol', () => {
    // Arrange / Act
    renderModal({ species: 'girasol' })

    // Assert — at least one suggested name should be visible as a clickable chip
    const chips = screen.getAllByRole('button')
    // We expect more than just the confirm and skip buttons
    expect(chips.length).toBeGreaterThan(2)
  })

  it('shows suggested name chips for margarita', () => {
    // Arrange / Act
    renderModal({ species: 'margarita' })

    // Assert
    const chips = screen.getAllByRole('button')
    expect(chips.length).toBeGreaterThan(2)
  })

  it('shows suggested name chips for lirio', () => {
    // Arrange / Act
    renderModal({ species: 'lirio' })

    // Assert
    const chips = screen.getAllByRole('button')
    expect(chips.length).toBeGreaterThan(2)
  })

  it('shows suggested name chips for helecho', () => {
    // Arrange / Act
    renderModal({ species: 'helecho' })

    // Assert
    const chips = screen.getAllByRole('button')
    expect(chips.length).toBeGreaterThan(2)
  })
})

// ── Clicking a suggested name ─────────────────────────────────────────────────

describe('NameYourPlant — clicking suggested names', () => {
  it('clicking a suggested name chip populates the input field', async () => {
    // Arrange
    renderModal({ species: 'girasol' })
    const input = screen.getByRole('textbox') as HTMLInputElement

    // Find a chip that is not the confirm or skip button
    const allButtons = screen.getAllByRole('button')
    const confirmText = /confirmar|nombrar|listo|guardar|confirm|name|save/i
    const skipText = /saltar|omitir|skip|después|later/i
    const chip = allButtons.find(
      (btn) => !confirmText.test(btn.textContent ?? '') && !skipText.test(btn.textContent ?? '') && btn.textContent?.trim()
    )
    expect(chip).not.toBeUndefined()

    // Act
    fireEvent.click(chip!)

    // Assert
    expect(input.value).toBeTruthy()
    expect(input.value).toBe(chip!.textContent?.trim())
  })
})

// ── Confirm button state ──────────────────────────────────────────────────────

describe('NameYourPlant — confirm button state', () => {
  it('confirm button is disabled when the input is empty', () => {
    // Arrange / Act
    renderModal()

    // Assert
    const confirmBtn = screen.getByRole('button', { name: /confirmar|nombrar|listo|guardar|confirm|name|save/i })
    expect(confirmBtn).toBeDisabled()
  })

  it('confirm button is enabled when the input has text', () => {
    // Arrange
    renderModal()
    const input = screen.getByRole('textbox')

    // Act
    fireEvent.change(input, { target: { value: 'Sol' } })

    // Assert
    const confirmBtn = screen.getByRole('button', { name: /confirmar|nombrar|listo|guardar|confirm|name|save/i })
    expect(confirmBtn).not.toBeDisabled()
  })

  it('confirm button becomes disabled again if user clears the input', () => {
    // Arrange
    renderModal()
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'Sol' } })

    // Act
    fireEvent.change(input, { target: { value: '' } })

    // Assert
    const confirmBtn = screen.getByRole('button', { name: /confirmar|nombrar|listo|guardar|confirm|name|save/i })
    expect(confirmBtn).toBeDisabled()
  })
})

// ── onConfirm callback ────────────────────────────────────────────────────────

describe('NameYourPlant — onConfirm callback', () => {
  it('calls onConfirm with the entered name when confirm is clicked', () => {
    // Arrange
    const onConfirm = vi.fn()
    renderModal({ onConfirm })
    const input = screen.getByRole('textbox')

    // Act
    fireEvent.change(input, { target: { value: 'Solecito' } })
    const confirmBtn = screen.getByRole('button', { name: /confirmar|nombrar|listo|guardar|confirm|name|save/i })
    fireEvent.click(confirmBtn)

    // Assert
    expect(onConfirm).toHaveBeenCalledOnce()
    expect(onConfirm).toHaveBeenCalledWith('Solecito')
  })

  it('calls onConfirm with the selected suggested name', async () => {
    // Arrange
    const onConfirm = vi.fn()
    renderModal({ species: 'girasol', onConfirm })

    // Act — click a chip to populate the input
    const allButtons = screen.getAllByRole('button')
    const confirmText = /confirmar|nombrar|listo|guardar|confirm|name|save/i
    const skipText = /saltar|omitir|skip|después|later/i
    const chip = allButtons.find(
      (btn) => !confirmText.test(btn.textContent ?? '') && !skipText.test(btn.textContent ?? '') && btn.textContent?.trim()
    )
    fireEvent.click(chip!)
    const chipName = chip!.textContent!.trim()

    // Then confirm
    const confirmBtn = screen.getByRole('button', { name: confirmText })
    fireEvent.click(confirmBtn)

    // Assert
    expect(onConfirm).toHaveBeenCalledWith(chipName)
  })

  it('does not call onConfirm when input is empty and confirm is clicked', async () => {
    // Arrange
    const onConfirm = vi.fn()
    renderModal({ onConfirm })

    // Act — click confirm without entering a name (button should be disabled)
    const confirmBtn = screen.getByRole('button', { name: /confirmar|nombrar|listo|guardar|confirm|name|save/i })
    fireEvent.click(confirmBtn)

    // Assert — confirm not called because button is disabled
    expect(onConfirm).not.toHaveBeenCalled()
  })
})

// ── onSkip callback ───────────────────────────────────────────────────────────

describe('NameYourPlant — onSkip callback', () => {
  it('calls onSkip when skip action is clicked', () => {
    // Arrange
    const onSkip = vi.fn()
    renderModal({ onSkip })

    // Act
    const skipEl =
      screen.queryByRole('button', { name: /saltar|omitir|skip|después|later/i }) ??
      screen.getByText(/saltar|omitir|skip/i)
    fireEvent.click(skipEl)

    // Assert
    expect(onSkip).toHaveBeenCalledOnce()
  })

  it('does not call onConfirm when skip is clicked', () => {
    // Arrange
    const onConfirm = vi.fn()
    const onSkip = vi.fn()
    renderModal({ onConfirm, onSkip })

    // Act
    const skipEl =
      screen.queryByRole('button', { name: /saltar|omitir|skip|después|later/i }) ??
      screen.getByText(/saltar|omitir|skip/i)
    fireEvent.click(skipEl)

    // Assert
    expect(onConfirm).not.toHaveBeenCalled()
  })
})

// ── Input character limit ─────────────────────────────────────────────────────

describe('NameYourPlant — input character limit', () => {
  it('enforces a 20 character maximum on the input', () => {
    // Arrange
    renderModal()
    const input = screen.getByRole('textbox') as HTMLInputElement

    // Act — simulate input with a string longer than 20 chars; the maxLength
    // attribute on the real input enforces the limit, so we test the attribute
    // and also that the component slices/caps on change if it does so in state.
    fireEvent.change(input, { target: { value: 'A'.repeat(30) } })

    // Assert — maxLength enforces the cap at the DOM level
    const maxLen = Number(input.getAttribute('maxlength') ?? input.maxLength)
    expect(maxLen).toBeLessThanOrEqual(20)
  })

  it('input has maxLength attribute of 20', () => {
    // Arrange / Act
    renderModal()
    const input = screen.getByRole('textbox') as HTMLInputElement

    // Assert
    expect(Number(input.getAttribute('maxlength') ?? input.maxLength)).toBe(20)
  })

  it('accepts exactly 20 characters', () => {
    // Arrange
    renderModal()
    const input = screen.getByRole('textbox') as HTMLInputElement

    // Act
    const exactString = 'A'.repeat(20)
    fireEvent.change(input, { target: { value: exactString } })

    // Assert
    expect(input.value.length).toBe(20)
    const confirmBtn = screen.getByRole('button', { name: /confirmar|nombrar|listo|guardar|confirm|name|save/i })
    expect(confirmBtn).not.toBeDisabled()
  })
})
