import React from 'react'
import { useApp } from '../context/AppContext'
import Navigation from './Navigation'
import { ROUTES } from '../lib/constants'

export default function WorkoutHistory() {
  const { navigate, startWorkout, ptWorkouts, savedWorkouts } = useApp()

  const handleStartEmptyWorkout = () => {
    startWorkout()
    navigate(ROUTES.WORKOUT_SESSION)
  }

  const handleStartPTWorkout = (workout) => {
    startWorkout(workout.exercises)
    navigate(ROUTES.WORKOUT_SESSION)
  }

  return (
    <div className="min-h-screen bg-base-300 text-base-content">
      <Navigation title="Starta träningspass" showBack={true} />
      
      <div className="p-4 space-y-4">
        <h1 className="text-xl font-bold text-center">Starta träningspass</h1>
        <p className="text-center text-sm opacity-70">
          Välj ett pass från din PT eller starta ett eget.
        </p>

        {/* PT Assigned Workouts */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title flex justify-between items-center">
              <span>Pass från din PT</span>
              <div className="badge badge-primary">Ny</div>
            </h2>
            <div className="space-y-2">
              {ptWorkouts.map((workout) => (
                <div 
                  key={workout.id}
                  className="collapse collapse-arrow bg-base-300"
                >
                  <input type="checkbox" /> 
                  <div className="collapse-title font-medium">
                    <div className="flex justify-between items-center">
                      <div>
                        <div>{workout.name}</div>
                        <div className="text-sm opacity-70">
                          Från: {workout.assignedBy} • {workout.date}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="collapse-content">
                    <p className="mb-4 text-sm opacity-70">{workout.description}</p>
                    
                    <div className="space-y-2">
                      {workout.exercises.map((exercise) => (
                        <div key={exercise.id} className="bg-base-200 p-3 rounded-lg">
                          <div className="font-medium">{exercise.name}</div>
                          {exercise.sets ? (
                            <table className="table table-sm mt-2">
                              <thead>
                                <tr>
                                  <th>Set</th>
                                  <th>Reps</th>
                                  <th>Vikt</th>
                                </tr>
                              </thead>
                              <tbody>
                                {exercise.sets.map((set, index) => (
                                  <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{set.reps}</td>
                                    <td>{set.weight}kg</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          ) : (
                            <div className="text-sm opacity-70 mt-1">
                              Tid: {exercise.value} sekunder
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <button 
                      onClick={() => handleStartPTWorkout(workout)}
                      className="btn btn-primary w-full mt-4"
                    >
                      Starta detta pass
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Empty Workout Section */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Start eget pass</h2>
            <p className="text-sm opacity-70">
              Starta och lägg till valfria tillgängliga övningar medans du tränar.
            </p>
            <button 
              onClick={handleStartEmptyWorkout}
              className="btn btn-primary w-full mt-2"
            >
              Starta tomt pass
            </button>
          </div>
        </div>

        {/* Previous Workouts */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Tidigare pass</h2>
            <div className="space-y-2">
              {savedWorkouts.map((workout) => (
                <div 
                  key={workout.id}
                  className="bg-base-300 p-3 rounded-lg"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{workout.name}</div>
                      <div className="text-sm opacity-70">
                        Tränat: {workout.date} ({workout.daysAgo} dagar sen)
                      </div>
                    </div>
                    <div className="badge badge-ghost">{workout.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="card-title">Tips</h2>
            <p className="text-sm opacity-70">
              PT-pass innehåller förbestämda övningar och vikter anpassade för dig. 
              Du kan också starta ett eget pass och välja övningar själv.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
