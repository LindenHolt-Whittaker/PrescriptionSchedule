import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import OnboardingForm from './pages/OnboardingForm'
import Schedule from './pages/Schedule'
import './App.scss'

function App() {
  return (
    <>
      <BrowserRouter>      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<OnboardingForm />} />
          <Route path="/schedule" element={<Schedule />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
