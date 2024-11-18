import { useApp } from '../../context/AppContext'
import Dashboard from '../../components/Dashboard'
import WorkoutHistory from '../../components/WorkoutHistory'
import WorkoutList from '../../components/WorkoutList'
import Messages from '../../components/Messages'
import ExerciseLibrary from '../../components/ExerciseLibrary'
import { ROUTES } from '../../lib/constants'

export default function Home() {
  const { currentScreen } = useApp()

  const renderScreen = () => {
    switch (currentScreen) {
      case ROUTES.DASHBOARD:
        return <Dashboard />
      case ROUTES.WORKOUT_HISTORY:
        return <WorkoutHistory />
      case ROUTES.WORKOUT_SESSION:
        return <WorkoutList />
      case ROUTES.MESSAGES:
        return <Messages />
      case ROUTES.EXERCISE_LIBRARY:
        return <ExerciseLibrary />
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