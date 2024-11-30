import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useApp } from '../context/AppContext'
import Navigation from '../components/Navigation'
import { ROUTES } from '../lib/constants'

export default function WorkoutSetup() {
  const router = useRouter()
  const { user, startWorkout } = useApp()
  const [setupType, setSetupType] = useState(null) // 'new' or 'load'
  const [savedPrograms, setSavedPrograms] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [newProgram, setNewProgram] = useState({
    name: '',
    exercises: []
  })
  const [showExerciseModal, setShowExerciseModal] = useState(false)
  const [exercises, setExercises] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [exerciseConfig, setExerciseConfig] = useState({
    sets: [{ reps: '', weight: '' }]
  })

  // Fetch saved programs
  useEffect(() => {
    const fetchPrograms = async () => {
      if (!user?._id) return
      
      try {
        setIsLoading(true)
        const response = await fetch(`/api/workouts/programs?userId=${user._id}`)
        if (!response.ok) throw new Error('Failed to fetch programs')
        const data = await response.json()
        setSavedPrograms(data)
      } catch (error) {
        console.error('Error fetching programs:', error)
        setError('Failed to load saved programs')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrograms()
  }, [user])

  // Fetch available exercises
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await fetch('/api/workouts/exercises')
        if (!response.ok) throw new Error('Failed to fetch exercises')
        const data = await response.json()
        setExercises(data)
      } catch (error) {
        console.error('Error fetching exercises:', error)
      }
    }

    fetchExercises()
  }, [])

  const handleStartSavedProgram = (program) => {
    startWorkout({
      name: program.name,
      exercises: program.exercises,
      originalProgramId: program._id
    })
    router.push(ROUTES.WORKOUT_SESSION)
  }

  const handleStartNewProgram = () => {
    startWorkout({
      name: newProgram.name || 'Nytt träningspass',
      exercises: newProgram.exercises
    })
    router.push(ROUTES.WORKOUT_SESSION)
  }

  const handleSelectExercise = (exercise) => {
    setSelectedExercise(exercise)
    setExerciseConfig({ sets: [{ reps: '', weight: '' }] })
  }

  const handleAddSet = () => {
    setExerciseConfig(prev => ({
      ...prev,
      sets: [...prev.sets, { reps: '', weight: '' }]
    }))
  }

  const handleRemoveSet = (index) => {
    setExerciseConfig(prev => ({
      ...prev,
      sets: prev.sets.filter((_, i) => i !== index)
    }))
  }

  const handleSetChange = (index, field, value) => {
    setExerciseConfig(prev => ({
      ...prev,
      sets: prev.sets.map((set, i) => 
        i === index ? { ...set, [field]: value } : set
      )
    }))
  }

  const handleAddExercise = () => {
    if (!selectedExercise) return

    const exerciseWithSets = {
      ...selectedExercise,
      sets: exerciseConfig.sets.filter(set => set.reps && set.weight)
    }

    setNewProgram(prev => ({
      ...prev,
      exercises: [...prev.exercises, exerciseWithSets]
    }))
    
    setSelectedExercise(null)
    setExerciseConfig({ sets: [{ reps: '', weight: '' }] })
    setShowExerciseModal(false)
  }

  const handleSaveProgram = async () => {
    if (!newProgram.name || newProgram.exercises.length === 0) {
      setError('Lägg till ett namn och minst en övning')
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch('/api/workouts/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          name: newProgram.name,
          exercises: newProgram.exercises
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save program')
      }
      
      // After saving, redirect to dashboard instead of starting workout
      router.push(ROUTES.DASHBOARD)
    } catch (error) {
      console.error('Error saving program:', error)
      setError('Det gick inte att spara träningspasset. Försök igen.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log('Program name:', newProgram.name)
    console.log('Exercises:', newProgram.exercises)
    console.log('Button should be enabled:', Boolean(newProgram.name && newProgram.exercises.length > 0))
  }, [newProgram])

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
          <div className="text-xl font-bold">Starta träningspass</div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {!setupType ? (
          <div className="space-y-4">
            <button
              onClick={() => setSetupType('new')}
              className="btn btn-primary btn-block"
            >
              Skapa nytt träningspass
            </button>
            <button
              onClick={() => setSetupType('load')}
              className="btn btn-outline btn-block"
            >
              Ladda sparat träningspass
            </button>
          </div>
        ) : setupType === 'new' ? (
          <div className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Namn på träningspass</span>
              </label>
              <input
                type="text"
                placeholder="T.ex. Ben & Core"
                className="input input-bordered"
                value={newProgram.name}
                onChange={(e) => setNewProgram(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>

            {/* Selected Exercises */}
            <div className="space-y-2">
              <h3 className="font-bold">Valda övningar</h3>
              {newProgram.exercises.map((exercise, index) => (
                <div key={index} className="card bg-base-200">
                  <div className="card-body p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{exercise.name}</h4>
                        <div className="text-sm opacity-70 mt-1">
                          {exercise.sets.map((set, i) => (
                            <div key={i}>
                              Set {i + 1}: {set.reps} reps @ {set.weight}kg
                            </div>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => setNewProgram(prev => ({
                          ...prev,
                          exercises: prev.exercises.filter((_, i) => i !== index)
                        }))}
                        className="btn btn-ghost btn-sm"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowExerciseModal(true)}
              className="btn btn-outline btn-block"
            >
              Lägg till övning
            </button>

            <button
              onClick={handleStartNewProgram}
              className="btn btn-primary btn-block"
              disabled={!newProgram.name || newProgram.exercises.length === 0}
            >
              Starta
            </button>
          </div>
        ) : (
          <div className="space-y-4">
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
            ) : savedPrograms.length === 0 ? (
              <div className="text-center py-8">
                <p className="opacity-70">Inga sparade träningspass</p>
                <button 
                  className="btn btn-outline btn-sm mt-2"
                  onClick={() => setSetupType('new')}
                >
                  Skapa nytt träningspass
                </button>
              </div>
            ) : (
              savedPrograms.map((program) => (
                <div key={program._id} className="card bg-base-200">
                  <div className="card-body">
                    <h3 className="card-title">{program.name}</h3>
                    <p className="text-sm opacity-70">
                      {program.exercises.length} övningar
                    </p>
                    <div className="card-actions justify-end">
                      <button
                        onClick={() => handleStartSavedProgram(program)}
                        className="btn btn-primary"
                      >
                        Starta
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Exercise Modal */}
      {showExerciseModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            {!selectedExercise ? (
              <>
                <h3 className="font-bold text-lg mb-4">Välj övning</h3>
                
                <input
                  type="text"
                  placeholder="Sök övningar..."
                  className="input input-bordered w-full mb-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {exercises
                    .filter(ex => 
                      ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (ex.description && ex.description.toLowerCase().includes(searchTerm.toLowerCase()))
                    )
                    .map((exercise) => (
                      <div 
                        key={exercise._id}
                        className="card bg-base-200 cursor-pointer hover:bg-base-300"
                        onClick={() => handleSelectExercise(exercise)}
                      >
                        <div className="card-body p-4">
                          <h4 className="font-medium">{exercise.name}</h4>
                          {exercise.description && (
                            <p className="text-sm opacity-70">{exercise.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <>
                <h3 className="font-bold text-lg mb-4">{selectedExercise.name}</h3>
                
                <div className="space-y-4">
                  {exerciseConfig.sets.map((set, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <label className="label">
                          <span className="label-text">Reps</span>
                        </label>
                        <input
                          type="number"
                          value={set.reps}
                          onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                          className="input input-bordered w-full"
                          placeholder="Antal"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="label">
                          <span className="label-text">Vikt (kg)</span>
                        </label>
                        <input
                          type="number"
                          value={set.weight}
                          onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                          className="input input-bordered w-full"
                          placeholder="Kg"
                        />
                      </div>
                      {exerciseConfig.sets.length > 1 && (
                        <button
                          onClick={() => handleRemoveSet(index)}
                          className="btn btn-ghost btn-sm"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  
                  <button
                    onClick={handleAddSet}
                    className="btn btn-outline btn-block"
                  >
                    Lägg till set
                  </button>
                </div>
              </>
            )}

            <div className="modal-action">
              {selectedExercise ? (
                <>
                  <button
                    onClick={() => setSelectedExercise(null)}
                    className="btn btn-ghost"
                  >
                    Tillbaka
                  </button>
                  <button
                    onClick={handleAddExercise}
                    className="btn btn-primary"
                    disabled={!exerciseConfig.sets.some(set => set.reps && set.weight)}
                  >
                    Lägg till
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowExerciseModal(false)}
                  className="btn"
                >
                  Stäng
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
