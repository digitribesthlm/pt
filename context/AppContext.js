import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AppContext = createContext(undefined)

export function AppProvider({ children }) {
  const [currentScreen, setCurrentScreen] = useState('dashboard')
  const [activeWorkout, setActiveWorkout] = useState(null)
  const [workoutTimer, setWorkoutTimer] = useState(0)
  const [presetExercises, setPresetExercises] = useState(null)
  const [ptWorkouts, setPtWorkouts] = useState([])
  const [savedWorkouts, setSavedWorkouts] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        console.log('AppContext - Loading user from localStorage:', parsedUser)
        if (parsedUser && parsedUser._id) {
          setUser(parsedUser)
        } else {
          console.error('Invalid user data in localStorage:', parsedUser)
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/check')
      if (res.ok) {
        const data = await res.json()
        if (data.user) {
          setUser(data.user)
          localStorage.setItem('user', JSON.stringify(data.user))
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      
      const fetchWorkouts = async () => {
        try {
          const [ptRes, savedRes] = await Promise.all([
            fetch(`/api/workouts/pt/${user._id}`),
            fetch(`/api/workouts/saved/${user._id}`)
          ])

          if (ptRes.ok && savedRes.ok) {
            const [ptData, savedData] = await Promise.all([
              ptRes.json(),
              savedRes.json()
            ])
            
            setPtWorkouts(ptData)
            setSavedWorkouts(savedData)
          }
        } catch (error) {
          console.error('Error fetching workouts:', error)
        }
      }

      fetchWorkouts()
    }
  }, [])

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      console.log('Login response data:', data)

      localStorage.setItem('user', JSON.stringify(data.user))
      setUser(data.user)

      return data.user
    } catch (error) {
      throw error
    }
  }

  const value = {
    currentScreen,
    navigate: (route) => {
      window.location.href = route
    },
    activeWorkout,
    workoutTimer,
    presetExercises,
    ptWorkouts,
    savedWorkouts,
    user,
    setUser,
    login,
    startWorkout: (workout) => {
      if (!workout || !workout.exercises) {
        console.error('Invalid workout data:', workout)
        return
      }

      // Ensure each exercise has the required properties
      const exercises = workout.exercises.map(exercise => ({
        ...exercise,
        completed: false,
        sets: exercise.sets || []
      }))

      setActiveWorkout({
        ...workout,
        exercises,
        startTime: new Date(),
      })
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
