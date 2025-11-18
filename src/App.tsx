import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Onboarding from './pages/Onboarding'
import Schedule from './pages/Schedule'
import './App.scss'
import { InvalidSchedule, NotFound } from './pages/ErrorPages'

function App() {
  return (
    <>
      <BrowserRouter>      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/invalidSchedule" element={<InvalidSchedule />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
