import { useRouter } from 'next/router'
import { useApp } from '../context/AppContext'
import { ROUTES } from '../lib/constants'
import { useEffect, useState } from 'react'

export default function WorkoutPreview() {
  const router = useRouter()
  const { workoutId } = router.query
  const { startWorkout, user } = useApp()
  const [workout, setWorkout] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWorkout = async () => {
      if (!workoutId) return
      
      try {
        setIsLoading(true)
        const response = await fetch(`/api/workouts/programs/${workoutId}`)
        if (!response.ok) throw new Error('Failed to fetch workout')
        
        const data = await response.json()
        setWorkout(data)
      } catch (error) {
        console.error('Error fetching workout:', error)
        setError('Kunde inte ladda träningspasset')
      } finally {
        setIsLoading(false)
      }
    }

    fetchWorkout()
  }, [workoutId])

  const handleStartWorkout = () => {
    if (!workout) return
    startWorkout(workout)
    router.push(ROUTES.WORKOUT_SESSION)
  }

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

  if (!workout) return null

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
          <div className="text-xl font-bold">Förhandsgranska pass</div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Workout Header */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">{workout.name}</h2>
            <p className="text-sm opacity-70">{workout.exercises.length} övningar</p>
          </div>
        </div>

        {/* Exercise List */}
        <div className="space-y-2">
          <h3 className="font-bold text-lg">Övningar</h3>
          {workout.exercises.map((exercise, index) => (
            <div key={index} className="card bg-base-200">
              <div className="card-body p-4">
                <h4 className="font-medium">{exercise.name}</h4>
                {exercise.description && (
                  <p className="text-sm opacity-70 mb-2">{exercise.description}</p>
                )}
                <div className="space-y-1">
                  {exercise.sets?.map((set, setIndex) => (
                    <div key={setIndex} className="text-sm">
                      Set {setIndex + 1}: {set.reps} reps @ {set.weight}kg
                    </div>
                  ))}
                </div>
                {exercise.videoUrl && (
                  <a 
                    href={exercise.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary mt-2 inline-block"
                  >
                    Se övningsvideo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartWorkout}
          className="btn btn-primary btn-block"
        >
          Starta träningspass
        </button>
      </div>
    </div>
  )
}
