"use client"

import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSession, saveSession } from '@/lib/session'

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const router = useRouter()

  useEffect(() => {
    const storedEmail = getSession()

    if (storedEmail){
      router.push("/dashboard")
    }
  }, [router])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log({
      email,
      password
    })
    saveSession(email)
    router.push("/dashboard")
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className='w-full max-w-md border p-9 rounded-lg'>
        <h1 className="text-2xl font-semibold">Login</h1>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label htmlFor="email" className='block text-sm font-medium'>
              Email
            </label>
            <input
              type="email"
              id='email'
              placeholder='Enter Your Email'
              className='w-full rounded-lg border border-gray-300 px-3 py-2'
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className='space-y-2'>
            <label htmlFor="password" className='block text-sm font-medium'>
              Password
            </label>
            <input
              type="password"
              id='password'
              placeholder='Enter Your Password'
              className='w-full rounded-lg border border-gray-300 px-3 py-2'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button className='w-full bg-white text-black rounded-lg py-2.5'>
            Login
          </button>

          <p className='text-sm text-center'>
            Don&apos;t have an account?{" "}
            <Link href="/register" className='font-medium underline'>
              Register
            </Link>
          </p>

        </form>
      </div>
    </main>
  )
}

export default LoginPage