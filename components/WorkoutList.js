import React, { useState, useEffect, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import Navigation from './Navigation'
import { ROUTES } from '../lib/constants'

export default function WorkoutList() {
  const { 
    activeWorkout, 
    endWorkout: contextEndWorkout, 
    navigate,
    user 
  } = useApp()
  const [selectedExercises, setSelectedExercises] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [timer, setTimer] = useState(0)
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false)
  const [showExerciseList, setShowExerciseList] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [measurementModal, setMeasurementModal] = useState(null)
  const [selectedMeasureType, setSelectedMeasureType] = useState(null)
  const [sets, setSets] = useState([{ reps: '', weight: '' }])
  const [time, setTime] = useState('')
  const [availableExercises, setAvailableExercises] = useState([])
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
        setAvailableExercises(data)
      } catch (error) {
        console.error('Error fetching exercises:', error)
        setError('Failed to load exercises')
      } finally {
        setIsLoading(false)
      }
    }

    fetchExercises()
  }, [])

  useEffect(() => {
    let interval
    if (isWorkoutStarted) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isWorkoutStarted])

  useEffect(() => {
    // Redirect if no user
    if (!user?._id) {
      console.log('No user found in WorkoutList, redirecting to login')
      navigate(ROUTES.LOGIN)
    }
  }, [user, navigate])

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const getVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url?.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const handleEndWorkout = () => {
    const workoutData = {
      exercises: selectedExercises,
      duration: timer,
      date: new Date().toISOString()
    }
    console.log('Saving workout:', workoutData)
    
    setIsWorkoutStarted(false)
    setTimer(0)
    setSelectedExercises([])
    setShowExerciseList(true)
    
    contextEndWorkout()
    navigate(ROUTES.DASHBOARD)
  }

  const handleAddExercise = (exercise, measureType = null, values = null) => {
    if (!isWorkoutStarted) {
      setIsWorkoutStarted(true)
    }
    setSelectedExercises([...selectedExercises, {
      ...exercise,
      measureType: measureType,
      values: values,
      timeAdded: new Date()
    }])
    setShowExerciseList(false)
    setMeasurementModal(null)
    setSets([{ reps: '', weight: '' }])
    setTime('')
    setSelectedMeasureType(null)
  }

  const handleMeasurementTypeClick = (exercise) => {
    setMeasurementModal(exercise)
    setSelectedMeasureType(null)
    setSets([{ reps: '', weight: '' }])
    setTime('')
  }

  const handleAddSet = () => {
    setSets([...sets, { reps: '', weight: '' }])
  }

  const handleRemoveSet = (index) => {
    setSets(sets.filter((_, i) => i !== index))
  }

  const handleSetChange = (index, field, value) => {
    const newSets = [...sets]
    newSets[index][field] = value
    setSets(newSets)
  }

  const handleAddWithMeasurement = () => {
    if (!measurementModal) return

    let values = null
    if (selectedMeasureType === 'repsWeight') {
      values = { sets: sets.filter(set => set.reps && set.weight) }
    } else if (selectedMeasureType === 'time') {
      values = { time: parseInt(time) }
    }

    handleAddExercise(measurementModal, selectedMeasureType, values)
  }

  const saveWorkout = useCallback(async (workoutData) => {
    const res = await fetch('/api/workouts/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workoutData),
    })

    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.message || 'Failed to save workout')
    }

    return res.json()
  }, [])

  const handleSaveWorkout = async () => {
    try {
      if (!user?._id) {
        throw new Error('No user ID found - please log in again')
      }

      const workoutData = {
        userId: user._id,
        name: `Träningspass ${new Date().toLocaleDateString('sv-SE')}`,
        exercises: selectedExercises.map(exercise => ({
          name: exercise.name,
          measureType: exercise.measureType || 'reps',
          value: exercise.measureType === 'time' ? 
            parseInt(exercise.time) || 0 : 
            exercise.sets.reduce((total, set) => total + parseInt(set.reps || 0), 0),
          completed: true
        })),
        duration: timer
      }

      console.log('Saving workout with data:', workoutData)

      await saveWorkout(workoutData)

      alert('Träningspass sparat!')
      contextEndWorkout()
      navigate(ROUTES.DASHBOARD)
    } catch (error) {
      console.error('Error saving workout:', error)
      alert('Kunde inte spara träningspasset: ' + error.message)
    }
  }

  const handleClear = () => {
    setSelectedExercises([])
    setIsWorkoutStarted(false)
    setTimer(0)
    setShowExerciseList(true)
    setSelectedVideo(null)
    setMeasurementModal(null)
    setSets([{ reps: '', weight: '' }])
    setTime('')
    setSelectedMeasureType(null)
  }

  const isValidMeasurement = () => {
    if (selectedMeasureType === 'repsWeight') {
      return sets.some(set => set.reps && set.weight)
    }
    return selectedMeasureType === 'time' && time
  }

  // Filter exercises based on search term
  const filteredExercises = availableExercises.filter(exercise => 
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-base-300 text-base-content pb-20">
      <Navigation title="Aktuellt pass" />
      
      {/* Measurement Modal */}
      {measurementModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card bg-base-200 w-full max-w-sm">
            <div className="card-body">
              <h3 className="card-title">Välj mättyp för {measurementModal.name}</h3>
              
              <div className="space-y-4 mt-4">
                {/* Measurement Type Selection */}
                <div className="btn-group w-full">
                  <button 
                    className={`btn flex-1 ${selectedMeasureType === 'repsWeight' ? 'btn-active' : ''}`}
                    onClick={() => setSelectedMeasureType('repsWeight')}
                  >
                    Reps x Vikt
                  </button>
                  <button 
                    className={`btn flex-1 ${selectedMeasureType === 'time' ? 'btn-active' : ''}`}
                    onClick={() => setSelectedMeasureType('time')}
                  >
                    Tid
                  </button>
                </div>

                {/* Input Fields Based on Selection */}
                {selectedMeasureType === 'repsWeight' && (
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="table table-zebra">
                        <thead>
                          <tr>
                            <th>Set</th>
                            <th>Reps</th>
                            <th>Vikt (kg)</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {sets.map((set, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <input
                                  type="number"
                                  placeholder="Reps"
                                  className="input input-bordered input-sm w-20"
                                  value={set.reps}
                                  onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  placeholder="Vikt"
                                  className="input input-bordered input-sm w-20"
                                  value={set.weight}
                                  onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                                />
                              </td>
                              <td>
                                {sets.length > 1 && (
                                  <button 
                                    className="btn btn-ghost btn-sm btn-circle"
                                    onClick={() => handleRemoveSet(index)}
                                  >
                                    ✕
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <button 
                      className="btn btn-outline btn-sm w-full"
                      onClick={handleAddSet}
                    >
                      Lägg till set
                    </button>
                  </div>
                )}

                {selectedMeasureType === 'time' && (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Tid (sekunder)</span>
                    </label>
                    <input
                      type="number"
                      placeholder="Tid i sekunder"
                      className="input input-bordered"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="card-actions justify-end gap-2">
                  <button 
                    className="btn btn-ghost"
                    onClick={() => setMeasurementModal(null)}
                  >
                    Avbryt
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={handleAddWithMeasurement}
                    disabled={!isValidMeasurement()}
                  >
                    Lägg till
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 space-y-4">
        {/* Timer Section */}
        <div className="card bg-base-200">
          <div className="card-body text-center">
            <div className="text-3xl font-bold text-primary">{formatTime(timer)}</div>
            <div className="text-sm opacity-70">
              {isWorkoutStarted ? 'Pågående pass' : 'Välj en övning för att starta passet'}
            </div>
          </div>
        </div>

        {showExerciseList ? (
          <>
            {/* Search Section */}
            <div className="space-y-2">
              <div className="join w-full">
                <input
                  type="text"
                  placeholder="skivstång"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-bordered join-item flex-1"
                />
                <button className="btn join-item">Sök</button>
              </div>
              <button className="btn btn-block btn-outline">
                Alla tränade övningar
              </button>
            </div>

            {/* Exercise List */}
            <div className="space-y-2">
              {filteredExercises.map((exercise) => (
                <div 
                  key={exercise._id}
                  className="card bg-base-200"
                >
                  <div className="card-body p-4">
                    <div className="flex justify-between items-center">
                      <div className="font-medium">
                        {exercise.name}
                      </div>
                      <div className="flex items-center gap-2">
                        {exercise.videoUrl && (
                          <button 
                            onClick={() => setSelectedVideo(exercise)}
                            className="btn btn-circle btn-sm btn-primary"
                          >
                            ▶
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between gap-2 mt-2">
                      <button 
                        onClick={() => handleMeasurementTypeClick(exercise)}
                        className="btn btn-primary flex-1"
                      >
                        Lägg till övning
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Selected Exercise View */
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Aktuell övning</h2>
              {selectedExercises.length > 0 && (
                <div className="bg-base-300 rounded-box p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">
                        {selectedExercises[selectedExercises.length - 1].name}
                      </div>
                      {selectedExercises[selectedExercises.length - 1].measureType === 'repsWeight' ? (
                        <div className="mt-2">
                          <table className="table table-sm">
                            <thead>
                              <tr>
                                <th>Set</th>
                                <th>Reps</th>
                                <th>Vikt</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedExercises[selectedExercises.length - 1].values.sets.map((set, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{set.reps}</td>
                                  <td>{set.weight}kg</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-sm opacity-70">
                          {selectedExercises[selectedExercises.length - 1].values.time} sekunder
                        </div>
                      )}
                      <div className="text-sm opacity-70 mt-2">
                        Tillagd: {selectedExercises[selectedExercises.length - 1].timeAdded.toLocaleTimeString()}
                      </div>
                    </div>
                    {selectedExercises[selectedExercises.length - 1].videoUrl && (
                      <button 
                        onClick={() => setSelectedVideo(selectedExercises[selectedExercises.length - 1])}
                        className="btn btn-circle btn-sm btn-primary"
                      >
                        ▶
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Previous Exercises */}
        {selectedExercises.length > 1 && !showExerciseList && (
          <div className="card bg-base-200">
            <div className="card-body">
              <h2 className="card-title">Tidigare övningar</h2>
              <div className="space-y-2">
                {selectedExercises.slice(0, -1).reverse().map((exercise, index) => (
                  <div 
                    key={`${exercise._id}-${index}`}
                    className="bg-base-300 rounded-box p-4"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{exercise.name}</div>
                        {exercise.measureType === 'repsWeight' ? (
                          <div className="mt-2">
                            <table className="table table-sm">
                              <thead>
                                <tr>
                                  <th>Set</th>
                                  <th>Reps</th>
                                  <th>Vikt</th>
                                </tr>
                              </thead>
                              <tbody>
                                {exercise.values.sets.map((set, setIndex) => (
                                  <tr key={setIndex}>
                                    <td>{setIndex + 1}</td>
                                    <td>{set.reps}</td>
                                    <td>{set.weight}kg</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-sm opacity-70">
                            {exercise.values.time} sekunder
                          </div>
                        )}
                        <div className="text-sm opacity-70 mt-2">
                          Tillagd: {exercise.timeAdded.toLocaleTimeString()}
                        </div>
                      </div>
                      {exercise.videoUrl && (
                        <button 
                          onClick={() => setSelectedVideo(exercise)}
                          className="btn btn-circle btn-sm btn-primary"
                        >
                          ▶
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Video View */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/50 z-50">
            <div className="h-full flex flex-col">
              <div className="aspect-video bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${getVideoId(selectedVideo.videoUrl)}`}
                  title="Exercise Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="flex-1 overflow-y-auto bg-base-200 p-4">
                <h3 className="font-bold text-lg mb-2">{selectedVideo.name}</h3>
                <p className="opacity-70 mb-4">{selectedVideo.description}</p>
                
                <h4 className="font-medium text-primary mb-2">Träningstips:</h4>
                <ul className="list-disc list-inside opacity-70 space-y-1 mb-4">
                  {selectedVideo.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>

                <button 
                  onClick={() => setSelectedVideo(null)}
                  className="btn btn-primary w-full"
                >
                  Stäng video
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="btm-nav btm-nav-lg bg-base-200 border-t border-base-300">
        {!showExerciseList && (
          <button 
            onClick={() => setShowExerciseList(true)}
            className="btn btn-primary flex-1"
          >
            Lägg till övning
          </button>
        )}
        <button 
          onClick={handleClear}
          className="btn btn-ghost flex-1"
        >
          Rensa
        </button>
        <button 
          onClick={handleSaveWorkout}
          className="btn btn-secondary flex-1"
        >
          Avsluta & Spara
        </button>
      </div>
    </div>
  )
}
