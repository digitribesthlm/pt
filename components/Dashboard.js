import React from 'react'
import { useApp } from '../context/AppContext'
import { ROUTES } from '../lib/constants'
import Navigation from './Navigation'

export default function Dashboard() {
  const { navigate, startWorkout, ptWorkouts, savedWorkouts } = useApp()

  const handleStartEmptyWorkout = () => {
    startWorkout()
    navigate(ROUTES.WORKOUT_SESSION)
  }

  const latestPTWorkout = ptWorkouts[0] // Get most recent PT workout

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

        {/* PT Program Section */}
        {latestPTWorkout && (
          <div className="card bg-base-200">
            <div className="card-body">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="card-title">Ditt PT program</h2>
                  <p className="text-sm opacity-70">Från: {latestPTWorkout.assignedBy}</p>
                </div>
                <div className="badge badge-primary">Nytt</div>
              </div>
              <p className="text-sm opacity-70 mb-4">{latestPTWorkout.description}</p>
              <div className="card-actions">
                <button 
                  onClick={() => navigate(ROUTES.WORKOUT_HISTORY)}
                  className="btn btn-primary btn-block"
                >
                  Starta dagens PT pass
                </button>
              </div>
            </div>
          </div>
        )}

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

        {/* Main Action Buttons */}
        <div className="space-y-2">
          <button 
            onClick={handleStartEmptyWorkout}
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

        {/* Training History */}
        <div className="card bg-base-200">
          <div className="card-body">
            <div className="flex justify-between items-center mb-2">
              <h2 className="card-title">Träningshistorik</h2>
              <button 
                onClick={() => navigate(ROUTES.WORKOUT_HISTORY)}
                className="text-sm text-primary"
              >
                Klicka för detaljer
              </button>
            </div>
            <div className="space-y-2">
              {recentWorkouts.map(workout => (
                <div 
                  key={workout.id}
                  className="bg-base-300 p-3 rounded-lg flex justify-between items-center"
                >
                  <div>
                    <div className="font-medium">{workout.name}</div>
                    <div className="text-sm text-success">{workout.type}</div>
                  </div>
                  <div className="text-sm opacity-70">{workout.daysAgo} dgr sen</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
