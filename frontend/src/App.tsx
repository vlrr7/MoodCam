import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import RealtimePage from './components/RealtimePage'
import UploadPage from './components/UploadPage'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/realtime" element={<RealtimePage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </Router>
  )
}
