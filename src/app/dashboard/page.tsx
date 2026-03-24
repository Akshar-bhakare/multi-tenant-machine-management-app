"use client"

import { useEffect, useState } from 'react'
import { clearSession, getSession } from '@/lib/session'
import { useRouter } from 'next/navigation'

const DashboardPage = () => {

  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const handleLogout = () => {
    clearSession()
    router.push("/login")
  }

  useEffect(() => {
    const storedEmail = getSession()

    if (!storedEmail) {
      router.push("/login")
      return
    }
    setEmail(storedEmail)
    setLoading(false)
  }, [router])

  if (!email && !loading) {
    return null
  }

  if (loading) {
    return (
      <main className="min-h-screen text-xl font-bold flex items-center justify-center">
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold mb-2">I am dashboard</h1>

      <p className="text-sm text-gray-600">
        Logged in as: {email || "No user"}
      </p>

      <button onClick={handleLogout} className='w-40 p-2 m-2 rounded-lg bg-white text-black'>
        Logout
      </button>
    </main>
  )
}

export default DashboardPage