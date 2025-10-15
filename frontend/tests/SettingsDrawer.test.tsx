import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import SettingsDrawer from '../src/components/SettingsDrawer'
import { useStore } from '../src/state/useStore'


// ensure store initializes cleanly
beforeEach(()=>{
useStore.setState({ threshold: 0.4, smoothing: 0.5, effects: { bounce: true, glow: true, beep: false }, modelSource: 'mock', showFaceBox: true })
})


test('shows threshold and smoothing controls', () => {
render(<SettingsDrawer />)
expect(screen.getByText(/Threshold/i)).toBeInTheDocument()
expect(screen.getByText(/Smoothing/i)).toBeInTheDocument()
})