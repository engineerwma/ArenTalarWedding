'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (data.success) {
        localStorage.setItem('adminToken', data.token)
        localStorage.setItem('tokenExpiry', data.expiresAt.toString())
        router.push('/admin/dashboard')
      } else {
        setError(data.error || 'Invalid credentials')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5EDE4] via-[#E8DDD2] to-[#D4C5B5]">
      <div className="bg-white/20 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-96 border border-white/30">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif text-[#4D403A]">Admin Login</h2>
          <p className="text-[#4D403A]/60 text-sm mt-2">Wedding RSVP Dashboard</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[#4D403A] text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-white/30 border border-white/40 rounded-lg focus:outline-none focus:border-[#C4A265] focus:ring-2 focus:ring-[#C4A265]/20 text-[#4D403A] transition-all"
              required
              disabled={loading}
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-[#4D403A] text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-white/30 border border-white/40 rounded-lg focus:outline-none focus:border-[#C4A265] focus:ring-2 focus:ring-[#C4A265]/20 text-[#4D403A] transition-all"
              required
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4D403A] text-white py-2.5 rounded-lg hover:bg-[#262626] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}