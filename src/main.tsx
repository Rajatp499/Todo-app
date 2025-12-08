// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import Store from './Store/Store.ts'
import './index.css'
import App from './App.tsx'



createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={Store}>
      
    <App />
    </Provider>
  // </StrictMode>,
)
