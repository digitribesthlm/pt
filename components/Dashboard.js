import { useApp } from '../context/AppContext'
import { ROUTES } from '../lib/constants'
import Navigation from './Navigation'

export default function Dashboard() {
  const { navigate, startWorkout } = useApp()

  const handleStartEmptyWorkout = () => {
    startWorkout()
    navigate(ROUTES.WORKOUT_SESSION)
  }

  return (
    <div className="min-h-screen bg-base-300">
      <Navigation title="PT COMPANION" showBack={false} />
      
      {/* Previous Dashboard content... */}
      
      <div className="p-4 space-y-2">
        <button 
          onClick={handleStartEmptyWorkout}
          className="btn btn-primary w-full"
        >
          Starta tomt pass
        </button>
        
        <button 
          onClick={() => navigate(ROUTES.WORKOUT_HISTORY)}
          className="btn btn-primary w-full"
        >
          Dina träningspass
        </button>
        
        <button 
          onClick={() => navigate(ROUTES.EXERCISES)}
          className="btn btn-primary w-full"
        >
          Dina övningar
        </button>
      </div>
    </div>
  )
} 