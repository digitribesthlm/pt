import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Dashboard from '../components/Dashboard'

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check auth tokens in client-side only
    const hasAuthToken = document.cookie.includes('auth-token')
    if (!hasAuthToken) {
      router.push('/login')
    } else {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  if (loading) {
    return null // or a loading spinner
  }

  if (!isAuthenticated) {
    return null
  }

  return <Dashboard />
}
