import { AuthProvider } from './hooks/useAuth'
import { EmployeeProvider } from './hooks/useEmployee' // IMPORT THE NEW PROVIDER
import AppRouter from './components/layout/AppRouter'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <EmployeeProvider> {/* WRAP THE ROUTER */}
        <AppRouter />
      </EmployeeProvider>
    </AuthProvider>
  )
}

export default App
