import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { ROUTES } from '../lib/constants'
import { useRouter } from 'next/router'

export default function WorkoutSession() {
  const router = useRouter()
  const { activeWorkout, endWorkout, user } = useApp()
  const [exercises, setExercises] = useState(activeWorkout?.exercises || [])

  useEffect(() => {
    if (!activeWorkout) {
      router.push(ROUTES.DASHBOARD)
      return
    }
  }, [activeWorkout, router])

  if (!activeWorkout) {
    return null
  }

  const handleEndWorkout = async () => {
    try {
      // Save completed workout
      const completedWorkout = {
        ...activeWorkout,
        exercises: exercises,
        userId: user._id,
        originalProgramId: activeWorkout.originalProgramId, // if started from a program
        duration: Date.now() - new Date(activeWorkout.startTime).getTime(),
      }

      await fetch('/api/workouts/completed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completedWorkout),
      })

      endWorkout()
      router.push(ROUTES.DASHBOARD)
    } catch (error) {
      console.error('Error saving completed workout:', error)
      // Still end the workout even if saving fails
      endWorkout()
      router.push(ROUTES.DASHBOARD)
    }
  }

  const handleToggleExercise = (index) => {
    const newExercises = [...exercises]
    newExercises[index] = {
      ...newExercises[index],
      completed: !newExercises[index].completed
    }
    setExercises(newExercises)
  }

  const completedCount = exercises.filter(ex => ex.completed).length
  const progress = (completedCount / exercises.length) * 100

  return (
    <div className="min-h-screen bg-base-300 text-base-content">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-black/30">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => router.push(ROUTES.DASHBOARD)} 
            className="btn btn-ghost btn-sm"
          >
            ←
          </button>
          <div className="text-xl font-bold">{activeWorkout.name || 'Träningspass'}</div>
        </div>
        <button 
          onClick={handleEndWorkout}
          className="btn btn-error btn-sm"
        >
          Avsluta pass
        </button>
      </div>

      {/* Progress Bar */}
      <div className="p-4 bg-base-200">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold">Träningspass progress</span>
          <span className="text-sm">{completedCount} av {exercises.length}</span>
        </div>
        <div className="w-full bg-base-300 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Exercise List */}
      <div className="p-4 space-y-4">
        {exercises.map((exercise, index) => (
          <div 
            key={index} 
            className={`card bg-base-200 ${exercise.completed ? 'border-l-4 border-success' : ''}`}
          >
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <label className="cursor-pointer flex items-center gap-2">
                      <input 
                        type="checkbox"
                        className="checkbox checkbox-success"
                        checked={exercise.completed}
                        onChange={() => handleToggleExercise(index)}
                      />
                      <span className={`card-title ${exercise.completed ? 'line-through opacity-70' : ''}`}>
                        {exercise.name}
                      </span>
                    </label>
                  </div>
                  {exercise.description && (
                    <p className={`text-sm opacity-70 mt-1 ${exercise.completed ? 'line-through' : ''}`}>
                      {exercise.description}
                    </p>
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
                </div>
                {exercise.videoUrl && (
                  <button 
                    onClick={() => window.open(exercise.videoUrl, '_blank')}
                    className="btn btn-ghost btn-sm"
                  >
                    Se video
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
