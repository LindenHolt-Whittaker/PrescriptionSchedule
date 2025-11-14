import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import OnboardingForm from './pages/OnboardingForm'
import Results from './pages/Results'
import './App.scss'

function App() {
  return (
    <>
      <BrowserRouter>      
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/onboarding" element={<OnboardingForm />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
