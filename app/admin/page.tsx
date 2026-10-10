'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [members, setMembers] = useState<any[]>([])

  const loadMembers = () => {
    const stored = localStorage.getItem('team_members')
    if (stored) {
      setMembers(JSON.parse(stored))
    }
  }

  useEffect(() => {
    loadMembers()
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === 'admin@embrione.pes.edu' && password === 'EmbrioneAdmin@2026') {
      setIsAuthenticated(true)
    } else {
      alert('Invalid admin credentials!')
    }
  }

  const handleUpdateStatus = (id: string, status: 'approved' | 'rejected') => {
    const updated = members.map((m) => (m.id === id ? { ...m, status } : m))
    setMembers(updated)
    localStorage.setItem('team_members', JSON.stringify(updated))
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030712] text-[#E2E8F0] flex items-center justify-center p-4 font-mono">
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
        <form onSubmit={handleLogin} className="bg-[#0B132B] border-2 border-[#1E293B] p-8 max-w-md w-full space-y-6">
          <h2 className="text-lg font-bold text-teal-400 text-center" style={{ fontFamily: "'Press Start 2P', monospace" }}>ADMIN PORTAL</h2>
          <div>
            <label className="block text-xs mb-2">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@embrione.pes.edu" className="w-full bg-[#030712] border border-[#1E293B] p-3 text-xs text-white" />
          </div>
          <div>
            <label className="block text-xs mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full bg-[#030712] border border-[#1E293B] p-3 text-xs text-white" />
          </div>
          <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            Login
          </button>
        </form>
      </div>
    )
  }

  const pendingMembers = members.filter((m) => m.status === 'pending')
  const approvedMembers = members.filter((m) => m.status === 'approved')

  return (
    <div className="min-h-screen bg-[#030712] text-[#E2E8F0] p-8 font-mono">
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen&display=swap" rel="stylesheet" />

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center border-b-2 border-[#1E293B] pb-6">
          <h1 className="text-xl font-bold text-teal-400" style={{ fontFamily: "'Press Start 2P', monospace" }}>MODERATION DASHBOARD</h1>
          <Link href="/team" className="px-4 py-2 bg-[#0A0F1D] border border-[#1E293B] text-teal-300 text-xs font-bold" style={{ fontFamily: "'Silkscreen', monospace" }}>
            View Team Directory →
          </Link>
        </div>

        {/* Pending Approval Workflow */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-yellow-400 uppercase" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            Pending Applications ({pendingMembers.length})
          </h2>
          {pendingMembers.length === 0 ? (
            <p className="text-xs text-slate-500">No pending recruit profiles.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingMembers.map((m) => (
                <div key={m.id} className="bg-[#0B132B] border-2 border-yellow-500/40 p-4 flex flex-col justify-between space-y-4">
                  <div className="flex gap-4">
                    <img src={m.avatar_url} alt={m.name} className="w-16 h-16 object-cover border border-slate-700" />
                    <div>
                      <h3 className="font-bold text-white">{m.name} ({m.srn})</h3>
                      <p className="text-xs text-teal-400">{m.position} • {m.domain}</p>
                      <p className="text-xs text-slate-400 mt-1">{m.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdateStatus(m.id, 'approved')} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase">
                      Approve
                    </button>
                    <button onClick={() => handleUpdateStatus(m.id, 'rejected')} className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Currently Approved Roster */}
        <section className="space-y-4 pt-6 border-t border-[#1E293B]">
          <h2 className="text-sm font-bold text-emerald-400 uppercase" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            Approved Active Roster ({approvedMembers.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {approvedMembers.map((m) => (
              <div key={m.id} className="bg-[#0B132B] border border-emerald-500/30 p-4 flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold text-white">{m.name}</p>
                  <p className="text-[10px] text-teal-400">{m.domain}</p>
                </div>
                <button onClick={() => handleUpdateStatus(m.id, 'rejected')} className="px-3 py-1 bg-rose-950 text-rose-400 text-[10px] border border-rose-800">
                  Revoke
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}