'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface EywaSeed {
  id: number
  x: number
  y: number
  size: number
  vx: number
  vy: number
  opacity: number
}

interface SeaCreature {
  id: string
  name: string
  x: number
  y: number
  vx: number
  vy: number
  facingRight: boolean
}

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const [members, setMembers] = useState<any[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')

  // Eywa Particle Effect State
  const [eywaSeeds, setEywaSeeds] = useState<EywaSeed[]>([])

  // Autonomous Swimming Sea Creatures State
  const [creatures, setCreatures] = useState<SeaCreature[]>([
    { id: 'whale', name: 'Glow Whale', x: 100, y: 180, vx: 0.8, vy: 0.2, facingRight: true },
    { id: 'manta', name: 'Sea Manta', x: 700, y: 350, vx: -0.9, vy: -0.3, facingRight: false },
    { id: 'turtle', name: 'Aqua Turtle', x: 300, y: 520, vx: 0.6, vy: -0.15, facingRight: true },
    { id: 'angler', name: 'Luminous Angler', x: 850, y: 150, vx: -0.7, vy: 0.25, facingRight: false },
    { id: 'jelly1', name: 'Eywa Jelly', x: 200, y: 400, vx: 0.3, vy: -0.6, facingRight: true },
  ])

  useEffect(() => {
    loadMembers()
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() < 0.6) {
        const newSeed: EywaSeed = {
          id: Date.now() + Math.random(),
          x: e.clientX + (Math.random() - 0.5) * 30,
          y: e.clientY + (Math.random() - 0.5) * 30,
          size: Math.random() * 12 + 8,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -Math.random() * 2 - 0.5,
          opacity: 0.9,
        }
        setEywaSeeds((prev) => [...prev.slice(-25), newSeed])
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Swimming Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCreatures((prev) =>
        prev.map((c) => {
          let newX = c.x + c.vx
          let newY = c.y + c.vy + Math.sin(Date.now() / 1000 + c.x) * 0.4
          let newVx = c.vx
          let newVy = c.vy
          let facing = c.facingRight

          const widthLimit = typeof window !== 'undefined' ? window.innerWidth - 120 : 1200
          const heightLimit = typeof window !== 'undefined' ? window.innerHeight - 120 : 800

          if (newX > widthLimit) {
            newVx = -Math.abs(c.vx)
            facing = false
          } else if (newX < 40) {
            newVx = Math.abs(c.vx)
            facing = true
          }

          if (newY > heightLimit) {
            newVy = -Math.abs(c.vy)
          } else if (newY < 60) {
            newVy = Math.abs(c.vy)
          }

          return { ...c, x: newX, y: newY, vx: newVx, vy: newVy, facingRight: facing }
        })
      )
    }, 30)

    return () => clearInterval(timer)
  }, [])

  // Eywa seeds floating loop
  useEffect(() => {
    const timer = setInterval(() => {
      setEywaSeeds((prev) =>
        prev
          .map((seed) => ({
            ...seed,
            x: seed.x + seed.vx,
            y: seed.y + seed.vy,
            opacity: seed.opacity - 0.02,
          }))
          .filter((seed) => seed.opacity > 0)
      )
    }, 30)
    return () => clearInterval(timer)
  }, [])

  const loadMembers = () => {
    const data = JSON.parse(localStorage.getItem('team_members') || '[]')
    setMembers(data)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      emailInput.trim() === 'admin@embrione.pes.edu' &&
      passwordInput === 'EmbrioneAdmin@2026'
    ) {
      setIsLoggedIn(true)
      setErrorMsg('')
    } else {
      setErrorMsg('DUNGEON ACCESS DENIED! CHECK KEYS.')
    }
  }

  const updateStatus = (id: string, newStatus: 'approved' | 'rejected' | 'pending') => {
    const updated = members.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
    setMembers(updated)
    localStorage.setItem('team_members', JSON.stringify(updated))
  }

  const deleteMember = (id: string) => {
    if (confirm('Delete this profile permanently from the dungeon archives?')) {
      const updated = members.filter((m) => m.id !== id)
      setMembers(updated)
      localStorage.setItem('team_members', JSON.stringify(updated))
    }
  }

  const totalCount = members.length
  const pendingCount = members.filter((m) => m.status === 'pending' || !m.status).length
  const approvedCount = members.filter((m) => m.status === 'approved').length
  const rejectedCount = members.filter((m) => m.status === 'rejected').length

  const filteredMembers = members.filter((m) => {
    const status = m.status || 'pending'
    if (filter === 'all') return true
    return status === filter
  })

  return (
    <div className="relative min-h-screen bg-[#030712] text-[#E2E8F0] py-12 px-4 sm:px-6 lg:px-8 font-mono overflow-hidden">
      
      {/* Minecraft Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen&display=swap" rel="stylesheet" />

      {/* Ocean Dungeon Glow Background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[650px] h-[650px] bg-cyan-600/10 rounded-full blur-[170px] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* --- SWIMMING BIOLUMINESCENT SEA CREATURES --- */}
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {creatures.map((c) => (
          <div
            key={c.id}
            className="absolute transition-transform duration-75 ease-linear flex flex-col items-center opacity-80"
            style={{
              left: `${c.x}px`,
              top: `${c.y}px`,
              transform: `scaleX(${c.facingRight ? 1 : -1})`,
            }}
          >
            {c.id === 'whale' && (
              <svg width="100" height="55" viewBox="0 0 120 70" className="drop-shadow-[0_0_20px_#38BDF8]">
                <path d="M 10 35 C 20 10, 80 10, 100 35 C 115 20, 115 50, 100 35 C 80 60, 20 60, 10 35 Z" fill="#0284C7" stroke="#38BDF8" strokeWidth="2.5"/>
                <circle cx="85" cy="30" r="3.5" fill="#E0F2FE"/>
              </svg>
            )}
            {c.id === 'manta' && (
              <svg width="90" height="60" viewBox="0 0 110 80" className="drop-shadow-[0_0_22px_#2DD4BF]">
                <path d="M 55 10 L 100 45 Q 55 55 10 45 Z" fill="#0F766E" stroke="#2DD4BF" strokeWidth="2.5"/>
                <path d="M 55 50 Q 55 75 55 80" stroke="#2DD4BF" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            )}
            {c.id === 'turtle' && (
              <svg width="80" height="50" viewBox="0 0 90 60" className="drop-shadow-[0_0_18px_#34D399]">
                <ellipse cx="45" cy="30" rx="25" ry="18" fill="#065F46" stroke="#34D399" strokeWidth="2.5"/>
                <circle cx="75" cy="30" r="8" fill="#10B981" stroke="#34D399" strokeWidth="2"/>
              </svg>
            )}
            {c.id === 'angler' && (
              <svg width="70" height="50" viewBox="0 0 80 60" className="drop-shadow-[0_0_18px_#F59E0B]">
                <path d="M 20 30 Q 40 10 65 30 Q 40 50 20 30 Z" fill="#1E1B4B" stroke="#F59E0B" strokeWidth="2"/>
                <circle cx="70" cy="5" r="4" fill="#FDE047" className="animate-ping"/>
              </svg>
            )}
            {c.id === 'jelly1' && (
              <svg width="55" height="75" viewBox="0 0 80 100" className="drop-shadow-[0_0_18px_#38BDF8]">
                <path d="M 15 40 Q 40 5 65 40 Z" fill="#0284C7" stroke="#38BDF8" strokeWidth="2"/>
                <path d="M 40 45 Q 40 75 38 95" stroke="#2DD4BF" strokeWidth="2.5"/>
              </svg>
            )}
            <span className="text-[7px] font-mono text-teal-300 bg-black/70 px-1 py-0.5 mt-0.5 border border-teal-500/30 whitespace-nowrap">
              {c.name}
            </span>
          </div>
        ))}
      </div>

      {/* Eywa Cursor Effect */}
      {eywaSeeds.map((seed) => (
        <div
          key={seed.id}
          className="pointer-events-none fixed z-30 transition-opacity duration-100 flex items-center justify-center"
          style={{
            left: `${seed.x}px`,
            top: `${seed.y}px`,
            width: `${seed.size}px`,
            height: `${seed.size}px`,
            opacity: seed.opacity,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="w-full h-full bg-cyan-200 rounded-full shadow-[0_0_15px_#2DD4BF,0_0_25px_#38BDF8] animate-ping opacity-75" />
          <div className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_8px_#FFFFFF]" />
        </div>
      ))}

      {/* 1. UNDERWATER DUNGEON LOGIN GATE */}
      {!isLoggedIn ? (
        <div className="max-w-lg mx-auto my-12 relative z-20">
          <div className="relative bg-[#080D1A]/95 border-4 border-[#1E293B] p-8 sm:p-10 shadow-[14px_14px_0px_#030712] overflow-hidden">
            
            {/* Iron Dungeon Bars Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-20 flex justify-between px-6 z-0">
              <div className="w-3 h-full bg-[#1E293B] border-x border-[#334155]" />
              <div className="w-3 h-full bg-[#1E293B] border-x border-[#334155]" />
              <div className="w-3 h-full bg-[#1E293B] border-x border-[#334155]" />
              <div className="w-3 h-full bg-[#1E293B] border-x border-[#334155]" />
            </div>

            {/* Blue Torch Flame Left */}
            <div className="absolute -top-4 -left-4 z-20 drop-shadow-[0_0_15px_#2DD4BF]">
              <svg width="40" height="50" viewBox="0 0 50 60">
                <rect x="20" y="30" width="10" height="25" fill="#3D2612" />
                <path d="M 25 5 Q 35 20 25 32 Q 15 20 25 5 Z" fill="#2DD4BF" className="animate-pulse" />
              </svg>
            </div>

            {/* Blue Torch Flame Right */}
            <div className="absolute -top-4 -right-4 z-20 drop-shadow-[0_0_15px_#2DD4BF]">
              <svg width="40" height="50" viewBox="0 0 50 60">
                <rect x="20" y="30" width="10" height="25" fill="#3D2612" />
                <path d="M 25 5 Q 35 20 25 32 Q 15 20 25 5 Z" fill="#2DD4BF" className="animate-pulse" />
              </svg>
            </div>

            <div className="text-center mb-8 relative z-10">
              <div className="inline-block p-3 bg-[#030712] border-2 border-teal-500/50 mb-3 shadow-[0_0_15px_rgba(45,212,191,0.2)]">
                <span className="text-2xl">🔒</span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-[#F8FAFC] tracking-wider drop-shadow-[2px_2px_0px_#0F766E] uppercase" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                DUNGEON GATE
              </h1>
              <p className="text-[10px] text-teal-400 mt-2 uppercase tracking-widest font-bold" style={{ fontFamily: "'Silkscreen', monospace" }}>
                Restricted Moderation Chamber
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-3 bg-red-950/90 text-red-300 text-[10px] font-bold border-2 border-red-500 shadow-[2px_2px_0px_#7F1D1D] relative z-10" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                ⚠️ {errorMsg}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5 relative z-10">
              <div>
                <label className="block text-[10px] font-bold text-teal-300 uppercase tracking-widest mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                  Guardian Key (Email)
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="admin@embrione.pes.edu"
                  className="w-full bg-[#030712] border-2 border-[#1E293B] px-4 py-3 text-xs text-[#F8FAFC] focus:outline-none focus:border-teal-500 rounded-none shadow-inner"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-teal-300 uppercase tracking-widest mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                  Passcode Seal
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#030712] border-2 border-[#1E293B] px-4 py-3 text-xs text-[#F8FAFC] focus:outline-none focus:border-teal-500 rounded-none shadow-inner"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs border-b-4 border-r-4 border-teal-900 active:translate-y-0.5 transition uppercase tracking-widest shadow-[4px_4px_0px_#030712] mt-2"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                Unlock Dungeon Door 🗝️
              </button>
            </form>

            <div className="mt-8 text-center relative z-10 border-t border-[#1E293B] pt-4">
              <Link href="/team" className="text-xs text-teal-400 hover:underline font-bold uppercase tracking-wider" style={{ fontFamily: "'Silkscreen', monospace" }}>
                &larr; Return to Team Directory
              </Link>
            </div>

          </div>
        </div>
      ) : (
        /* 2. LOGGED IN MODERATION DASHBOARD */
        <div className="max-w-7xl mx-auto relative z-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b-2 border-[#1E293B] pb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] drop-shadow-[2px_2px_0px_#0F766E]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                MODERATION CHAMBER
              </h1>
              <p className="text-xs text-[#94A3B8] mt-2 uppercase font-semibold">Review, approve, or reject candidate bounty profiles.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/team"
                className="px-4 py-2.5 bg-[#0A0F1D] border-2 border-[#1E293B] text-teal-300 text-xs font-bold rounded-none uppercase shadow-[2px_2px_0px_#030712]"
                style={{ fontFamily: "'Silkscreen', monospace" }}
              >
                View Directory
              </Link>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="px-4 py-2.5 bg-red-950/80 border-2 border-red-800 text-red-300 text-xs font-bold rounded-none uppercase shadow-[2px_2px_0px_#030712]"
                style={{ fontFamily: "'Silkscreen', monospace" }}
              >
                Lock Chamber
              </button>
            </div>
          </div>

          {/* Counters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#0B132B]/80 border-2 border-[#1E293B] p-5 shadow-[4px_4px_0px_#030712]">
              <p className="text-[10px] text-teal-400 uppercase font-bold" style={{ fontFamily: "'Press Start 2P', monospace" }}>Total</p>
              <h3 className="text-2xl font-bold text-white mt-2">{totalCount}</h3>
            </div>
            <div className="bg-[#0B132B]/80 border-2 border-[#1E293B] p-5 shadow-[4px_4px_0px_#030712]">
              <p className="text-[10px] text-amber-400 uppercase font-bold" style={{ fontFamily: "'Press Start 2P', monospace" }}>Pending</p>
              <h3 className="text-2xl font-bold text-amber-400 mt-2">{pendingCount}</h3>
            </div>
            <div className="bg-[#0B132B]/80 border-2 border-[#1E293B] p-5 shadow-[4px_4px_0px_#030712]">
              <p className="text-[10px] text-emerald-400 uppercase font-bold" style={{ fontFamily: "'Press Start 2P', monospace" }}>Approved</p>
              <h3 className="text-2xl font-bold text-emerald-400 mt-2">{approvedCount}</h3>
            </div>
            <div className="bg-[#0B132B]/80 border-2 border-[#1E293B] p-5 shadow-[4px_4px_0px_#030712]">
              <p className="text-[10px] text-red-400 uppercase font-bold" style={{ fontFamily: "'Press Start 2P', monospace" }}>Rejected</p>
              <h3 className="text-2xl font-bold text-red-400 mt-2">{rejectedCount}</h3>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 border-b-2 border-[#1E293B] pb-4">
            {(['pending', 'approved', 'rejected', 'all'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 text-xs font-bold uppercase transition rounded-none border-2 ${
                  filter === tab
                    ? 'bg-teal-600 text-white border-teal-400 shadow-[2px_2px_0px_#030712]'
                    : 'bg-[#0B132B] text-slate-400 border-[#1E293B] hover:text-white'
                }`}
                style={{ fontFamily: "'Silkscreen', monospace" }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Submissions Grid */}
          {filteredMembers.length === 0 ? (
            <div className="text-center py-16 bg-[#0B132B]/40 border-2 border-[#1E293B]">
              <p className="text-slate-400 text-sm">No submissions under "{filter}" status.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => {
                const currentStatus = member.status || 'pending'
                return (
                  <div key={member.id} className="bg-[#0B132B]/80 border-2 border-[#1E293B] p-6 shadow-[4px_4px_0px_#030712] flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-[#F8FAFC] text-sm" style={{ fontFamily: "'Silkscreen', monospace" }}>{member.name}</h3>
                          <p className="text-xs font-mono text-slate-500">{member.srn}</p>
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${
                          currentStatus === 'approved' ? 'bg-emerald-950 text-emerald-300 border-emerald-500' :
                          currentStatus === 'rejected' ? 'bg-red-950 text-red-300 border-red-500' :
                          'bg-amber-950 text-amber-300 border-amber-500'
                        }`}>
                          {currentStatus}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-slate-300 mb-4 bg-[#030712]/80 p-3 border border-[#1E293B]">
                        <p><strong className="text-teal-400">Role:</strong> {member.position} • {member.domain}</p>
                        <p><strong className="text-teal-400">Branch:</strong> {member.branch} (Sem {member.semester})</p>
                        <p><strong className="text-teal-400">Email:</strong> {member.email}</p>
                        <p className="line-clamp-2 mt-1"><strong className="text-teal-400">Bio:</strong> {member.bio}</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#1E293B]">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => updateStatus(member.id, 'approved')}
                          disabled={currentStatus === 'approved'}
                          className="py-1.5 px-3 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 text-xs font-bold border border-emerald-600 disabled:opacity-40 uppercase"
                          style={{ fontFamily: "'Silkscreen', monospace" }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(member.id, 'rejected')}
                          disabled={currentStatus === 'rejected'}
                          className="py-1.5 px-3 bg-amber-900/60 hover:bg-amber-800 text-amber-300 text-xs font-bold border border-amber-600 disabled:opacity-40 uppercase"
                          style={{ fontFamily: "'Silkscreen', monospace" }}
                        >
                          Reject
                        </button>
                      </div>
                      <button
                        onClick={() => deleteMember(member.id)}
                        className="w-full py-1.5 px-3 bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-bold border border-red-700 uppercase"
                        style={{ fontFamily: "'Silkscreen', monospace" }}
                      >
                        Delete Profile
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

    </div>
  )
}