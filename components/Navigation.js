import { useApp } from '../context/AppContext'
import { ROUTES } from '../lib/routes'

export default function Navigation({ title, showBack = true }) {
  const { navigate, activeWorkout } = useApp()

  return (
    <div className="flex justify-between items-center p-4 bg-base-300 border-b border-base-content/10">
      {showBack ? (
        <button 
          onClick={() => navigate(ROUTES.DASHBOARD)} 
          className="btn btn-ghost"
        >
          Tillbaka
        </button>
      ) : <div />}
      
      <div className="text-lg font-bold">{title}</div>
      
      {activeWorkout && (
        <div className="text-warning">
          {/* Format workout duration */}
          {new Date(activeWorkout.startTime).toISOString().substr(11, 8)}
        </div>
      )}
    </div>
  )
} 