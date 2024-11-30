import { useRouter } from 'next/router'
import { useApp } from '../../context/AppContext'
import { useEffect, useState } from 'react'
import { ROUTES } from '../../lib/constants'

export default function WorkoutHistoryList() {
  const router = useRouter()
  const { user } = useApp()
  const [workouts, setWorkouts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWorkouts = async () => {
      if (!user?._id) return
      
      try {
        setIsLoading(true)
        const response = await fetch(`/api/workouts/history/${user._id}`)
        if (!response.ok) throw new Error('Failed to fetch workouts')
        const data = await response.json()
        setWorkouts(data)
      } catch (error) {
        console.error('Error:', error)
        setError('Kunde inte ladda träningshistorik')
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkouts()
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center">
        <div className="text-center">
          <p className="text-error mb-4">{error}</p>
          <button 
            onClick={() => router.push(ROUTES.DASHBOARD)}
            className="btn btn-primary"
          >
            Tillbaka till Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-300 text-base-content">
      <div className="flex justify-between items-center p-4 bg-black/30">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.push(ROUTES.DASHBOARD)} 
            className="btn btn-ghost btn-sm"
          >
            ←
          </button>
          <div className="text-xl font-bold">Träningshistorik</div>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-4">
          {workouts.map((workout) => (
            <div key={workout._id} className="card bg-base-200">
              <div className="card-body p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{workout.name}</h3>
                    <div className="text-sm opacity-70">
                      <div>{workout.exercises?.length || 0} övningar</div>
                      <div>
                        {new Date(workout.completed || workout.created).toLocaleDateString('sv-SE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="text-primary">
                        {workout.type === 'completed' ? 'Genomfört pass' : 'Träningsprogram'}
                      </div>
                      {workout.duration && (
                        <div>Tid: {Math.round(workout.duration / 1000 / 60)} minuter</div>
                      )}
                    </div>
                  </div>
                  {workout.type === 'program' ? (
                    <button
                      onClick={() => router.push(`/workout-preview?workoutId=${workout._id}`)}
                      className="btn btn-outline btn-sm"
                    >
                      Visa
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push(`/workout-history/${workout._id}`)}
                      className="btn btn-ghost btn-sm"
                    >
                      Detaljer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {workouts.length === 0 && (
            <div className="text-center p-8">
              <p className="opacity-70">Ingen träningshistorik än</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
