import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/design-tokens.css'
import './styles/game-motion.css'
import './styles/game-background.css'
import './styles/ornate-ui.css'
import './styles/game-surfaces.css'
import './styles/game-buttons.css'
import './styles/square-ui.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
