import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Onboarding from './pages/Onboarding'
import Schedule from './pages/Schedule'
import './App.scss'
import { InvalidSchedule, NotFound } from './pages/ErrorPages'

const basename = import.meta.env.BASE_URL

function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/invalidSchedule" element={<InvalidSchedule />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
