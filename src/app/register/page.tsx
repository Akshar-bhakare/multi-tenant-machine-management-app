"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getSession, saveSession } from '@/lib/session'

const RegisterPage = () => {

    const [name, setName] = useState("")
    const [organizationName, setOrganizationName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    const router = useRouter()

    useEffect(() => {
        const storedEmail = getSession()
    
        if (storedEmail){
          router.push("/dashboard")
        }
      }, [router])

    const handelSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log({
            name, organizationName, email, password
        })
        saveSession(email)
        router.push("/dashboard")
    }
    

    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md border p-9 rounded-lg">
                <h1
                    className="text-2xl font-semibold"
                >
                    Register
                </h1>

                <form onSubmit={handelSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Enter your name"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="organizationName"
                            className="block text-sm font-medium"
                        >
                            Organization Name
                        </label>
                        <input
                            id="organizationName"
                            type="text"
                            placeholder="Enter organization name"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            value={organizationName}
                            onChange={(event) => setOrganizationName(event.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter Your Email"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>

                    <div className='space-y-2'>
                        <label
                            htmlFor="password"
                            className='block text-sm font-medium'
                        >
                            Password
                        </label>
                        <input
                            id='password'
                            type="password"
                            placeholder='Create a Password'
                            className='w-full rounded-lg border border-gray-300 px-3 py-2'
                            value={password}
                            onChange={(event) => setPassword(event?.target.value)}
                            required
                        />
                    </div>

                    <button className='w-full rounded-lg bg-white py-2.5 text-black'>
                        Register
                    </button>

                    <p className='text-sm text-center'>
                        Already have an account?{" "}
                        <Link href="/login" className='font-medium underline'>
                            Login
                        </Link>
                    </p>

                </form>
            </div>
        </main>
    )
}

export default RegisterPage