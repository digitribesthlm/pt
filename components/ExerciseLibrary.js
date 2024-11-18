import React from 'react'
import { useApp } from '../context/AppContext'
import { ROUTES } from '../lib/constants'
import Navigation from './Navigation'
import { workouts } from '../data/workouts'

export default function ExerciseLibrary() {
  const { navigate, startWorkout } = useApp()

  const handleStartWorkout = () => {
    startWorkout()
    navigate(ROUTES.WORKOUT_SESSION)
  }

  const exerciseCategories = {
    strength: 'Styrka',
    balance: 'Balans',
    olympic: 'Olympisk lyftning',
    mobility: 'Rörlighet'
  }

  // Extract YouTube video ID from URL
  const getVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  // Group exercises by category
  const groupedExercises = workouts.reduce((acc, exercise) => {
    if (!acc[exercise.type]) {
      acc[exercise.type] = []
    }
    acc[exercise.type].push(exercise)
    return acc
  }, {})

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Navigation title="Dina övningar" />
      
      <div className="p-4 space-y-6">
        {/* Quick Start Section */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="font-bold mb-4">Snabbstart</h2>
          <button 
            onClick={handleStartWorkout}
            className="w-full bg-yellow-500 text-gray-900 p-3 rounded-lg font-medium hover:bg-yellow-400"
          >
            Starta nytt träningspass
          </button>
        </div>

        {/* Exercise Categories */}
        {Object.entries(groupedExercises).map(([category, exercises]) => (
          <div key={category} className="bg-gray-800 p-4 rounded-lg">
            <h2 className="font-bold mb-4">{exerciseCategories[category]}</h2>
            <div className="grid grid-cols-1 gap-4">
              {exercises.map((exercise) => (
                <div 
                  key={exercise.id}
                  className="bg-gray-900 rounded-lg overflow-hidden"
                >
                  {/* YouTube Video Embed */}
                  <div className="aspect-video bg-gray-800">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${getVideoId(exercise.videoUrl)}`}
                      title={exercise.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{exercise.name}</h3>
                        <p className="text-sm text-gray-400">{exercise.description}</p>
                      </div>
                      <span className="text-xs bg-gray-800 px-2 py-1 rounded">
                        #{exercise.id}
                      </span>
                    </div>

                    {/* Training Tips */}
                    <div className="mt-3 space-y-1">
                      <h4 className="text-sm font-medium text-yellow-500">Tips:</h4>
                      <ul className="text-sm text-gray-400 list-disc list-inside">
                        {exercise.tips.map((tip, index) => (
                          <li key={index}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <button 
                        onClick={() => {
                          startWorkout()
                          navigate(ROUTES.WORKOUT_SESSION)
                        }}
                        className="flex-1 bg-green-800 p-2 rounded text-sm hover:bg-green-700"
                      >
                        Starta pass med denna övning
                      </button>
                      <button 
                        onClick={() => window.open(exercise.videoUrl, '_blank')}
                        className="flex-1 bg-gray-800 p-2 rounded text-sm hover:bg-gray-700"
                      >
                        Se på YouTube
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Exercise Tips */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="font-bold mb-2">Tips</h2>
          <p className="text-sm text-gray-400">
            Klicka på en övning för att se detaljerad information och instruktionsvideo. 
            Du kan starta ett nytt träningspass direkt från en övning eller via snabbstart-knappen.
          </p>
        </div>
      </div>
    </div>
  )
}
