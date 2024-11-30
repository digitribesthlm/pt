import React from 'react'
import { useApp } from '../context/AppContext'
import { ROUTES } from '../lib/constants'
import Navigation from './Navigation'
import PTProgram from './PTProgram'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const router = useRouter()
  const { navigate, ptWorkouts, savedWorkouts } = useApp()

  // Get the last 3 workouts for the history preview
  const recentWorkouts = savedWorkouts.slice(0, 3)

  return (
    <div className="min-h-screen bg-base-300 text-base-content">
      <div className="flex justify-between items-center p-4 bg-black/30">
        <div className="flex items-center gap-2">
          <span className="text-primary">👑</span>
          <div className="text-xl font-bold">PT COMPANION</div>
        </div>
        <button className="btn btn-ghost btn-sm">Logga ut</button>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Welcome Section */}
        <div className="text-center py-2">
          <h1 className="text-xl font-bold text-primary">Välkommen Jesper!</h1>
        </div>

        {/* Training Chart */}
        <div className="card bg-base-200">
          <div className="card-body">
            <h2 className="text-sm mb-2">Din träning senaste 30 dagarna</h2>
            <div className="h-32 bg-base-300 rounded-lg">
              <div className="flex items-end h-full p-2 space-x-1">
                {[20, 70, 80, 0, 0, 75, 85].map((height, i) => (
                  <div 
                    key={i}
                    style={{ height: `${height}%` }}
                    className="flex-1 bg-primary rounded-t"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Action Buttons */}
        <div className="space-y-2">
          <button 
            onClick={() => navigate(ROUTES.WORKOUT_SETUP)}
            className="btn btn-block"
          >
            Starta eget träningspass
          </button>
          
          <button 
            onClick={() => navigate(ROUTES.EXERCISE_LIBRARY)}
            className="btn btn-block btn-outline"
          >
            Dina övningar
          </button>
        </div>

        {/* PT Programs Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">PT Program för dig</h2>
          {ptWorkouts.map((workout, index) => (
            <PTProgram key={workout._id} workout={workout} />
          ))}
          {ptWorkouts.length === 0 && (
            <div className="text-center p-4 bg-base-200 rounded-lg">
              <p className="opacity-70">Inga PT program tillgängliga än</p>
            </div>
          )}
        </div>

        {/* Messages Section */}
        <div className="card bg-base-200">
          <div className="card-body">
            <div className="flex justify-between items-center mb-2">
              <h2 className="card-title">Meddelanden</h2>
              <button 
                onClick={() => navigate(ROUTES.MESSAGES)}
                className="text-sm text-primary"
              >
                Till meddelanden
              </button>
            </div>
            <div className="bg-base-300 p-3 rounded-lg flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-primary">✉</span>
                <span>Jessica Nyström</span>
              </div>
              <span className="text-sm opacity-70">Funkar toppen</span>
            </div>
          </div>
        </div>

        {/* Recent Workouts */}
        {recentWorkouts.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Senaste Träningspassen</h2>
              <button 
                onClick={() => router.push(ROUTES.WORKOUT_HISTORY)}
                className="text-sm text-primary"
              >
                Se alla pass
              </button>
            </div>
            <div className="space-y-2">
              {recentWorkouts.slice(0, 3).map((workout) => (
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
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
