import { createContext, useContext, useState } from 'react'

const AppContext = createContext(undefined)

export function AppProvider({ children }) {
  const [currentScreen, setCurrentScreen] = useState('dashboard')
  const [activeWorkout, setActiveWorkout] = useState(null)
  const [workoutTimer, setWorkoutTimer] = useState(0)

  const value = {
    currentScreen,
    navigate: setCurrentScreen,
    activeWorkout,
    workoutTimer,
    startWorkout: () => {
      setActiveWorkout({
        startTime: new Date(),
        exercises: []
      })
    },
    endWorkout: () => {
      setActiveWorkout(null)
      setWorkoutTimer(0)
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