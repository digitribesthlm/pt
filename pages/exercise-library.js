import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import Navigation from '../components/Navigation'

export default function ExerciseLibrary() {
  const { navigate } = useApp()
  const [exercises, setExercises] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/workouts/exercises')
        if (!response.ok) {
          throw new Error('Failed to fetch exercises')
        }
        const data = await response.json()
        setExercises(data)
      } catch (error) {
        console.error('Error fetching exercises:', error)
        setError('Failed to load exercises')
      } finally {
        setIsLoading(false)
      }
    }

    fetchExercises()
  }, [])

  // Filter exercises based on search term
  const filteredExercises = exercises.filter(exercise => 
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Extract YouTube video ID from URL
  const getVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url?.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  return (
    <div className="min-h-screen bg-base-300 text-base-content">
      <Navigation title="Övningsbibliotek" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="form-control">
            <input
              type="text"
              placeholder="Sök övningar..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="loading loading-spinner loading-lg"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-error">
              <p>{error}</p>
              <button 
                className="btn btn-outline btn-sm mt-2"
                onClick={() => window.location.reload()}
              >
                Försök igen
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map((exercise) => (
                <div 
                  key={exercise._id}
                  className="card bg-base-200"
                >
                  <div className="card-body">
                    <div className="aspect-video bg-base-300 rounded-lg overflow-hidden">
                      {exercise.videoUrl && (
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${getVideoId(exercise.videoUrl)}`}
                          title={exercise.name}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">{exercise.name}</h3>
                          <p className="text-sm opacity-70 mt-1">{exercise.description}</p>
                        </div>
                        <span className="badge badge-primary">{exercise.type}</span>
                      </div>

                      {exercise.tips && exercise.tips.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-bold">Tips:</h4>
                          <ul className="text-sm list-disc list-inside opacity-70">
                            {exercise.tips.map((tip, index) => (
                              <li key={index}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
