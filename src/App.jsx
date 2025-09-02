import { AuthProvider } from './hooks/useAuth'
import AppRouter from './components/layout/AppRouter'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App