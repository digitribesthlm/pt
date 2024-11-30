import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ROUTES } from '../../lib/constants'
import { useApp } from '../../context/AppContext'

export default function WorkoutHistory() {
  const router = useRouter()
  const { id } = router.query
  const { startWorkout } = useApp()
  const [workout, setWorkout] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchWorkout = async () => {
      if (!id) return
      try {
        const response = await fetch(`/api/workouts/completed/${id}`)
        if (!response.ok) throw new Error('Failed to fetch workout')
        const data = await response.json()
        setWorkout(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkout()
  }, [id])

  const handleStartSimilarWorkout = () => {
    if (!workout) return

    // Create a new workout from the historical one
    const newWorkout = {
      name: `${workout.name} (Ny)`,
      exercises: workout.exercises.map(ex => ({
        ...ex,
        completed: false,
        sets: ex.sets.map(set => ({
          ...set,
          completed: false
        }))
      }))
    }

    // Start the new workout
    startWorkout(newWorkout)
    router.push(ROUTES.WORKOUT_SESSION)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  if (!workout) {
    return (
      <div className="min-h-screen bg-base-300 flex items-center justify-center">
        <div className="text-center">
          <p className="text-error mb-4">Kunde inte hitta träningspasset</p>
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
          <div className="text-xl font-bold">Genomfört träningspass</div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Workout Header */}
        <div className="card bg-base-200">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="card-title">{workout.name}</h2>
                <div className="text-sm opacity-70">
                  <p>Genomfört: {new Date(workout.completed).toLocaleDateString('sv-SE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                  <p>Tid: {Math.round(workout.duration / 1000 / 60)} minuter</p>
                  <p>{workout.exercises.length} övningar</p>
                </div>
              </div>
              <button
                onClick={handleStartSimilarWorkout}
                className="btn btn-primary"
              >
                Starta liknande pass
              </button>
            </div>
          </div>
        </div>

        {/* Exercise List */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg">Övningar</h3>
          {workout.exercises.map((exercise, index) => (
            <div 
              key={index} 
              className={`card bg-base-200 ${exercise.completed ? 'border-l-4 border-success' : ''}`}
            >
              <div className="card-body p-4">
                <h4 className="font-medium">{exercise.name}</h4>
                {exercise.description && (
                  <p className="text-sm opacity-70 mb-2">{exercise.description}</p>
                )}
                {exercise.sets && (
                  <div className="mt-2">
                    <table className="table table-zebra w-full">
                      <thead>
                        <tr>
                          <th>Set</th>
                          <th>Reps</th>
                          <th>Vikt (kg)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {exercise.sets.map((set, setIndex) => (
                          <tr key={setIndex}>
                            <td>{setIndex + 1}</td>
                            <td>{set.reps}</td>
                            <td>{set.weight}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="mt-2 text-sm">
                  Status: {exercise.completed ? 'Genomförd ✓' : 'Ej genomförd'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
