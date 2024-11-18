import { createContext, useContext, useState } from 'react'

const AppContext = createContext(undefined)

export function AppProvider({ children }) {
  const [currentScreen, setCurrentScreen] = useState('dashboard')
  const [activeWorkout, setActiveWorkout] = useState(null)
  const [workoutTimer, setWorkoutTimer] = useState(0)
  const [presetExercises, setPresetExercises] = useState(null)

  const value = {
    currentScreen,
    navigate: setCurrentScreen,
    activeWorkout,
    workoutTimer,
    presetExercises,
    startWorkout: (exercises = null) => {
      setActiveWorkout({
        startTime: new Date(),
        exercises: []
      })
      setPresetExercises(exercises)
    },
    endWorkout: () => {
      setActiveWorkout(null)
      setWorkoutTimer(0)
      setPresetExercises(null)
    }
  }

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
