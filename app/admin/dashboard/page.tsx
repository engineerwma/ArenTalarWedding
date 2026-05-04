'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface RSVP {
  id: string
  attending: boolean
  fullName: string
  guests: string[]
  songRequest: string | null
  travelingFrom: string | null
  createdAt: string
}

interface Stats {
  totalRsvps: number
  attending: number
  notAttending: number
  totalGuests: number
  wishes: number
}

export default function AdminDashboard() {
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'attending' | 'not-attending'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const expiry = localStorage.getItem('tokenExpiry')

    if (!token || (expiry && Date.now() > parseInt(expiry))) {
      router.push('/admin/login')
      return
    }

    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const [rsvpsRes, statsRes] = await Promise.all([
        fetch('/api/admin/rsvps', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])
      
      const rsvpsData = await rsvpsRes.json()
      const statsData = await statsRes.json()
      
      if (rsvpsData.success) setRsvps(rsvpsData.data)
      if (statsData.success) setStats(statsData.data)
    } catch (error) {
      console.error('Failed to fetch data', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('tokenExpiry')
    router.push('/admin/login')
  }

  const exportToCSV = () => {
    const filtered = getFilteredRsvps()
    const headers = ['Full Name', 'Attending', 'Guests', 'Song Request', 'Traveling From', 'RSVP Date']
    const csvData = filtered.map(rsvp => [
      rsvp.fullName,
      rsvp.attending ? 'Yes' : 'No',
      rsvp.guests.join(', '),
      rsvp.songRequest || '',
      rsvp.travelingFrom || '',
      new Date(rsvp.createdAt).toLocaleString(),
    ])
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `wedding-rsvps-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getFilteredRsvps = () => {
    let filtered = rsvps
    if (filter === 'attending') filtered = filtered.filter(r => r.attending)
    if (filter === 'not-attending') filtered = filtered.filter(r => !r.attending)
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.guests.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    return filtered
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5EDE4] to-[#D4C5B5]">
        <div className="text-[#4D403A] text-lg">Loading dashboard...</div>
      </div>
    )
  }

  const filteredRsvps = getFilteredRsvps()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EDE4] via-[#E8DDD2] to-[#D4C5B5]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 mb-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <h1 className="text-3xl font-serif text-[#4D403A]">Wedding RSVP Dashboard</h1>
              <p className="text-[#4D403A]/70 mt-1">Manage your guest responses</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-[#C4A265] text-white rounded-lg hover:bg-[#9E7E45] transition-all"
              >
                Export CSV
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-[#4D403A] text-white rounded-lg hover:bg-[#262626] transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6">
            <p className="text-[#4D403A]/70 text-sm">Total RSVPs</p>
            <p className="text-3xl font-serif text-[#4D403A] mt-2 font-bold">{stats?.totalRsvps || 0}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6">
            <p className="text-[#4D403A]/70 text-sm">Attending</p>
            <p className="text-3xl font-serif text-green-700 mt-2 font-bold">{stats?.attending || 0}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6">
            <p className="text-[#4D403A]/70 text-sm">Not Attending</p>
            <p className="text-3xl font-serif text-red-700 mt-2 font-bold">{stats?.notAttending || 0}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6">
            <p className="text-[#4D403A]/70 text-sm">Total Guests</p>
            <p className="text-3xl font-serif text-[#4D403A] mt-2 font-bold">{stats?.totalGuests || 0}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6">
            <p className="text-[#4D403A]/70 text-sm">Wishes Received</p>
            <p className="text-3xl font-serif text-[#4D403A] mt-2 font-bold">{stats?.wishes || 0}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-3">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg transition-all ${filter === 'all' ? 'bg-[#4D403A] text-white' : 'bg-white/30 text-[#4D403A] hover:bg-white/40'}`}
              >
                All ({stats?.totalRsvps || 0})
              </button>
              <button
                onClick={() => setFilter('attending')}
                className={`px-4 py-2 rounded-lg transition-all ${filter === 'attending' ? 'bg-[#4D403A] text-white' : 'bg-white/30 text-[#4D403A] hover:bg-white/40'}`}
              >
                Attending ({stats?.attending || 0})
              </button>
              <button
                onClick={() => setFilter('not-attending')}
                className={`px-4 py-2 rounded-lg transition-all ${filter === 'not-attending' ? 'bg-[#4D403A] text-white' : 'bg-white/30 text-[#4D403A] hover:bg-white/40'}`}
              >
                Not Attending ({stats?.notAttending || 0})
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or guest..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/30 border border-white/40 rounded-lg focus:outline-none focus:border-[#C4A265] text-[#4D403A] w-64"
              />
              <svg className="absolute left-3 top-2.5 w-4 h-4 text-[#4D403A]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* RSVP List */}
        <div className="space-y-4">
          {filteredRsvps.map((rsvp) => (
            <div key={rsvp.id} className="bg-white/20 backdrop-blur-lg rounded-xl p-6 hover:bg-white/30 transition-all">
              <div className="flex flex-wrap justify-between items-start mb-4 gap-3">
                <div>
                  <h3 className="text-xl font-serif text-[#4D403A] font-semibold">{rsvp.fullName}</h3>
                  <p className="text-[#4D403A]/60 text-sm">
                    {new Date(rsvp.createdAt).toLocaleDateString()} at{' '}
                    {new Date(rsvp.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${rsvp.attending ? 'bg-green-500/20 text-green-700' : 'bg-red-500/20 text-red-700'}`}>
                  {rsvp.attending ? '✓ Attending' : '✗ Not Attending'}
                </div>
              </div>
              
              {rsvp.guests.length > 0 && (
                <div className="mb-3">
                  <p className="text-[#4D403A]/70 text-sm font-semibold mb-2">Additional Guests:</p>
                  <div className="flex flex-wrap gap-2">
                    {rsvp.guests.map((guest, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white/30 rounded-lg text-sm text-[#4D403A]">
                        {guest}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {rsvp.songRequest && (
                <div className="mb-3">
                  <p className="text-[#4D403A]/70 text-sm font-semibold mb-1">🎵 Song Request:</p>
                  <p className="text-[#4D403A] italic bg-white/20 inline-block px-3 py-1 rounded-lg">"{rsvp.songRequest}"</p>
                </div>
              )}
              
              {rsvp.travelingFrom && (
                <div>
                  <p className="text-[#4D403A]/70 text-sm font-semibold mb-1">✈️ Traveling From:</p>
                  <p className="text-[#4D403A]">{rsvp.travelingFrom}</p>
                </div>
              )}
            </div>
          ))}
          
          {filteredRsvps.length === 0 && (
            <div className="bg-white/20 backdrop-blur-lg rounded-xl p-12 text-center">
              <p className="text-[#4D403A]/60 text-lg">No RSVPs found</p>
              <p className="text-[#4D403A]/40 text-sm mt-2">Try adjusting your filters or search term</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}