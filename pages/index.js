import { useApp } from '../context/AppContext'
import Dashboard from '../components/Dashboard'
import WorkoutHistory from '../components/WorkoutHistory'
import WorkoutList from '../components/WorkoutList'
import Messages from '../components/Messages'

export default function Home() {
  const { currentScreen } = useApp()

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard />
      case 'workout-history':
        return <WorkoutHistory />
      case 'workout-session':
        return <WorkoutList />
      case 'messages':
        return <Messages />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      {renderScreen()}
    </div>
  )
}

