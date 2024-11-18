import React from 'react'
import { useApp } from '../context/AppContext'
import { ROUTES } from '../lib/constants'
import Navigation from './Navigation'
import { savedWorkouts } from '../data/savedWorkouts'

export default function Dashboard() {
  const { navigate, startWorkout } = useApp()

  const handleStartEmptyWorkout = () => {
    startWorkout()
    navigate(ROUTES.WORKOUT_SESSION)
  }

  // Get the last 3 workouts for the history preview
  const recentWorkouts = savedWorkouts.slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="flex justify-between items-center p-4 bg-black/30">
        <div className="flex items-center gap-2">
          <span className="text-yellow-500">👑</span>
          <div className="text-xl font-bold">PT COMPANION</div>
        </div>
        <button className="text-sm">Logga ut</button>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Welcome Section */}
        <div className="text-center py-2">
          <h1 className="text-xl font-bold text-yellow-500">Välkommen Jesper!</h1>
        </div>

        {/* Training Chart */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-sm mb-2">Din träning senaste 30 dagarna</h2>
          <div className="h-32 bg-gray-900 rounded-lg">
            <div className="flex items-end h-full p-2 space-x-1">
              {[20, 70, 80, 0, 0, 75, 85].map((height, i) => (
                <div 
                  key={i}
                  style={{ height: `${height}%` }}
                  className="flex-1 bg-yellow-500 rounded-t"
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Messages Section */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold">Meddelanden</h2>
            <button 
              onClick={() => navigate(ROUTES.MESSAGES)}
              className="text-sm text-yellow-500"
            >
              Till meddelanden
            </button>
          </div>
          <div className="bg-gray-900 p-3 rounded-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-yellow-500">✉</span>
              <span>Jessica Nyström</span>
            </div>
            <span className="text-sm text-gray-400">Funkar toppen</span>
          </div>
        </div>

        {/* Main Action Buttons */}
        <div className="space-y-2">
          <button 
            onClick={handleStartEmptyWorkout}
            className="w-full bg-yellow-500 text-gray-900 p-4 rounded-lg font-medium hover:bg-yellow-400"
          >
            Starta träningspass
          </button>
          
          <button 
            onClick={() => navigate(ROUTES.EXERCISE_LIBRARY)}
            className="w-full bg-gray-800 text-gray-100 p-4 rounded-lg font-medium hover:bg-gray-700 flex justify-between items-center"
          >
            <span>Dina övningar</span>
            <span className="text-yellow-500">→</span>
          </button>
        </div>

        {/* Training History */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold">Träningshistorik</h2>
            <button 
              onClick={() => navigate(ROUTES.WORKOUT_HISTORY)}
              className="text-sm text-yellow-500"
            >
              Klicka för detaljer
            </button>
          </div>
          <div className="space-y-2">
            {recentWorkouts.map(workout => (
              <div 
                key={workout.id}
                className="bg-gray-900 p-3 rounded-lg flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{workout.name}</div>
                  <div className="text-sm text-green-500">{workout.type}</div>
                </div>
                <div className="text-sm text-gray-400">{workout.daysAgo} dgr sen</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
