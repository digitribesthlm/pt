import React from 'react'

export default function PTProgram({ workout }) {
  if (!workout) return null

  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="card-title">{workout.name}</h2>
            <p className="text-sm opacity-70">PT: {workout.ptName}</p>
          </div>
          <div className="badge badge-primary">{workout.type}</div>
        </div>

        <p className="text-sm opacity-70 mb-4">{workout.description}</p>

        <div className="space-y-4">
          {workout.exercises.map((exercise, index) => (
            <div key={exercise.id} className="bg-base-300 p-4 rounded-lg">
              <div className="font-medium mb-2">{exercise.name}</div>
              <div className="grid grid-cols-3 gap-2">
                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="bg-base-100 p-2 rounded text-center">
                    <div className="text-sm font-medium">{set.reps} reps</div>
                    <div className="text-xs opacity-70">{set.weight} kg</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="card-actions mt-4">
          <button className="btn btn-primary btn-block">
            Starta detta pass
          </button>
        </div>
      </div>
    </div>
  )
}
