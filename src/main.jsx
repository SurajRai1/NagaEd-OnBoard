import { AuthProvider } from './hooks/useAuth'
import { EmployeeProvider } from './hooks/useEmployee'
import AppRouter from './components/layout/AppRouter'
import './App.css'
import React from 'react'
import ReactDOM from 'react-dom/client'


function App() {
  return (
    <AuthProvider>
      <EmployeeProvider>
        <AppRouter />
      </EmployeeProvider>
    </AuthProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)