'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const INITIAL_MOCK_PROFILES = [
  {
    id: '1',
    name: 'Aarav Sharma',
    srn: 'PES1UG23CS001',
    domain: 'Web Development',
    position: 'Head',
    branch: 'CSE',
    semester: '5',
    email: 'aarav@pes.edu',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    bio: 'Full-stack architect building scalable web applications and managing tech infrastructure for Embrione.',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    status: 'approved',
  },
  {
    id: '2',
    name: 'Ananya Rao',
    srn: 'PES1UG23DS042',
    domain: 'Design',
    position: 'Head',
    branch: 'AIML',
    semester: '5',
    email: 'ananya@pes.edu',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    bio: 'UI/UX enthusiast crafting immersive brand identities, promotional graphics, and clean user experiences.',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    status: 'approved',
  },
  {
    id: '3',
    name: 'Rohan Verma',
    srn: 'PES1UG23EC089',
    domain: 'Logistics',
    position: 'Vice-Head',
    branch: 'ECE',
    semester: '7',
    email: 'rohan@pes.edu',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    bio: 'Handling venue management, equipment flows, and ground operations to ensure seamless event execution.',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    status: 'approved',
  },
  {
    id: '4',
    name: 'Sneha Patel',
    srn: 'PES1UG24ME015',
    domain: 'Sponsorship',
    position: 'Core Member',
    branch: 'ME',
    semester: '3',
    email: 'sneha@pes.edu',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    bio: 'Connecting with corporate partners, pitching proposals, and securing financial backing for the festival.',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    status: 'approved',
  },
  {
    id: '5',
    name: 'Karan Mehta',
    srn: 'PES1UG23EE012',
    domain: 'Operations',
    position: 'Core Member',
    branch: 'EEE',
    semester: '5',
    email: 'karan@pes.edu',
    linkedin: 'https://linkedin.com',
    github: 'https://github.com',
    bio: 'Coordinating cross-domain workflows, participant check-ins, and on-ground crisis management.',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    status: 'approved',
  },
]

const DOMAINS = ['All', 'Web Development', 'Design', 'Logistics', 'Operations', 'Sponsorship', 'Hospitality', 'Social Media', 'Event Management']
const POSITIONS = ['All', 'Head', 'Vice-Head', 'Core Member', 'Member']

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

export default function TeamDirectoryPage() {
  const [members, setMembers] = useState<any[]>([])
  const [selectedDomain, setSelectedDomain] = useState('All')
  const [selectedPosition, setSelectedPosition] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const [eywaSeeds, setEywaSeeds] = useState<EywaSeed[]>([])
  const [creatures, setCreatures] = useState<SeaCreature[]>([
    { id: 'whale', name: 'Glow Whale', x: 100, y: 180, vx: 0.8, vy: 0.2, facingRight: true },
    { id: 'manta', name: 'Sea Manta', x: 700, y: 350, vx: -0.9, vy: -0.3, facingRight: false },
    { id: 'turtle', name: 'Aqua Turtle', x: 300, y: 520, vx: 0.6, vy: -0.15, facingRight: true },
    { id: 'angler', name: 'Luminous Angler', x: 850, y: 150, vx: -0.7, vy: 0.25, facingRight: false },
    { id: 'jelly1', name: 'Eywa Jelly', x: 200, y: 400, vx: 0.3, vy: -0.6, facingRight: true },
  ])

  // Mouse & Eywa Particles
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

  // Swimming Creatures Loop
  useEffect(() => {
    const animationTimer = setInterval(() => {
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

    return () => clearInterval(animationTimer)
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

  // Load members from localStorage and auto-refresh on window focus
  useEffect(() => {
    const loadMembers = () => {
      const stored = localStorage.getItem('team_members')
      let currentMembers = stored ? JSON.parse(stored) : []
      const hasMock = currentMembers.some((m: any) => m.id === '1' || m.name === 'Aarav Sharma')
      if (!hasMock) {
        currentMembers = [...INITIAL_MOCK_PROFILES, ...currentMembers]
        localStorage.setItem('team_members', JSON.stringify(currentMembers))
      }
      setMembers(currentMembers)
    }

    loadMembers()

    // Re-check localStorage whenever the tab/window is focused (e.g. returning from Admin)
    window.addEventListener('focus', loadMembers)
    return () => window.removeEventListener('focus', loadMembers)
  }, [])

  const approvedMembers = members.filter((m) => {
    const isApproved = m.status === 'approved'
    const matchesDomain = selectedDomain === 'All' || m.domain === selectedDomain
    const matchesPosition = selectedPosition === 'All' || m.position === selectedPosition
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.bio.toLowerCase().includes(searchQuery.toLowerCase())
    return isApproved && matchesDomain && matchesPosition && matchesSearch
  })

  return (
    <div className="relative min-h-screen bg-[#030712] text-[#E2E8F0] py-12 px-4 sm:px-6 lg:px-8 font-mono overflow-hidden">
      
      {/* Minecraft Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen&display=swap" rel="stylesheet" />

      {/* Deep Ocean Blue-Green Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-[650px] h-[650px] bg-cyan-600/10 rounded-full blur-[170px] animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* Swimming Creatures */}
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {creatures.map((c) => (
          <div
            key={c.id}
            className="absolute transition-transform duration-75 ease-linear flex flex-col items-center group opacity-85"
            style={{
              left: `${c.x}px`,
              top: `${c.y}px`,
              transform: `scaleX(${c.facingRight ? 1 : -1})`,
            }}
          >
            {c.id === 'whale' && (
              <svg width="110" height="60" viewBox="0 0 120 70" className="drop-shadow-[0_0_20px_#38BDF8]">
                <path d="M 10 35 C 20 10, 80 10, 100 35 C 115 20, 115 50, 100 35 C 80 60, 20 60, 10 35 Z" fill="#0284C7" stroke="#38BDF8" strokeWidth="2.5"/>
                <ellipse cx="85" cy="30" rx="4" ry="4" fill="#E0F2FE"/>
              </svg>
            )}
            {c.id === 'manta' && (
              <svg width="100" height="70" viewBox="0 0 110 80" className="drop-shadow-[0_0_22px_#2DD4BF]">
                <path d="M 55 10 L 100 45 Q 55 55 10 45 Z" fill="#0F766E" stroke="#2DD4BF" strokeWidth="2.5"/>
                <path d="M 55 50 Q 55 75 55 80" stroke="#2DD4BF" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="45" cy="25" r="3" fill="#E0F2FE"/>
              </svg>
            )}
            {c.id === 'turtle' && (
              <svg width="85" height="55" viewBox="0 0 90 60" className="drop-shadow-[0_0_18px_#34D399]">
                <ellipse cx="45" cy="30" rx="25" ry="18" fill="#065F46" stroke="#34D399" strokeWidth="2.5"/>
                <circle cx="75" cy="30" r="8" fill="#10B981" stroke="#34D399" strokeWidth="2"/>
              </svg>
            )}
            {c.id === 'angler' && (
              <svg width="75" height="55" viewBox="0 0 80 60" className="drop-shadow-[0_0_18px_#F59E0B]">
                <path d="M 20 30 Q 40 10 65 30 Q 40 50 20 30 Z" fill="#1E1B4B" stroke="#F59E0B" strokeWidth="2"/>
                <circle cx="70" cy="5" r="4" fill="#FDE047" className="animate-ping"/>
              </svg>
            )}
            {c.id === 'jelly1' && (
              <svg width="60" height="80" viewBox="0 0 80 100" className="drop-shadow-[0_0_18px_#38BDF8]">
                <path d="M 15 40 Q 40 5 65 40 Z" fill="#0284C7" stroke="#38BDF8" strokeWidth="2"/>
                <path d="M 40 45 Q 40 75 38 95" stroke="#2DD4BF" strokeWidth="2.5"/>
              </svg>
            )}
            <span 
              className="text-[8px] font-mono text-teal-300 bg-black/70 px-1.5 py-0.5 mt-1 border border-teal-500/30 rounded-none shadow-sm whitespace-nowrap"
              style={{ transform: `scaleX(${c.facingRight ? 1 : -1})` }}
            >
              {c.name}
            </span>
          </div>
        ))}
      </div>

      {/* Eywa Particles */}
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

      <div className="max-w-7xl mx-auto relative z-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b-2 border-[#1E293B] pb-8">
          <div>
            <div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-teal-500/15 text-teal-300 text-[10px] font-bold mb-3 border border-teal-500/40 uppercase tracking-widest shadow-[2px_2px_0px_#0D9488]"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              🌊 EMBRIONE 2026 DIRECTORY
            </div>
            <h1 
              className="text-3xl md:text-4xl font-extrabold tracking-wider text-[#F8FAFC] drop-shadow-[2px_2px_0px_#0F766E]"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              MEET OUR TEAM
            </h1>
            <p className="text-[#94A3B8] text-xs mt-3 uppercase tracking-wider font-semibold">
              Discover the brilliant minds behind the challenge.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="px-4 py-3 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-none border-b-4 border-r-4 border-teal-900 active:translate-y-0.5 transition uppercase tracking-wider"
              style={{ fontFamily: "'Silkscreen', monospace" }}
            >
              Register Profile
            </Link>
            <Link
              href="/admin"
              className="px-4 py-3 bg-[#0A0F1D] hover:bg-[#111C35] border-2 border-[#1E293B] text-teal-300 text-xs font-bold rounded-none border-b-4 border-r-4 border-slate-900 active:translate-y-0.5 transition uppercase tracking-wider"
              style={{ fontFamily: "'Silkscreen', monospace" }}
            >
              Admin Portal
            </Link>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-[#0B132B]/80 backdrop-blur-xl border-2 border-[#1E293B] p-6 rounded-none shadow-[4px_4px_0px_#030712] mb-10 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label 
                className="block text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-2"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type member name..."
                className="w-full bg-[#030712] border-2 border-[#1E293B] px-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-teal-500 rounded-none transition"
              />
            </div>
            <div>
              <label 
                className="block text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-2"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                Domain
              </label>
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="w-full bg-[#030712] border-2 border-[#1E293B] px-4 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-teal-500 rounded-none transition"
              >
                {DOMAINS.map((d) => (
                  <option key={d} value={d} className="bg-[#0B132B]">{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label 
                className="block text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-2"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                Position
              </label>
              <select
                value={selectedPosition}
                onChange={(e) => setSelectedPosition(e.target.value)}
                className="w-full bg-[#030712] border-2 border-[#1E293B] px-4 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-teal-500 rounded-none transition"
              >
                {POSITIONS.map((p) => (
                  <option key={p} value={p} className="bg-[#0B132B]">{p}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Team Grid */}
        {approvedMembers.length === 0 ? (
          <div className="text-center py-20 bg-[#0B132B]/40 border-2 border-[#1E293B] rounded-none">
            <p className="text-[#94A3B8] text-sm mb-4 font-mono">No approved team members match your filter criteria.</p>
            <button
              onClick={() => { setSelectedDomain('All'); setSelectedPosition('All'); setSearchQuery(''); }}
              className="text-teal-400 text-xs font-bold hover:underline uppercase"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedMembers.map((member) => (
              <div
                key={member.id}
                className="group bg-[#0B132B]/75 hover:bg-[#111C3A] border-2 border-[#1E293B] hover:border-teal-400 transition-all duration-200 rounded-none p-6 flex flex-col justify-between shadow-[4px_4px_0px_#030712]"
              >
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 bg-[#132247] flex-shrink-0 border-2 border-teal-500/60 shadow-inner overflow-hidden">
                      <img
                        src={member.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + member.name}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <div>
                      <h3 
                        className="text-sm font-bold text-[#F8FAFC] group-hover:text-teal-300 transition"
                        style={{ fontFamily: "'Silkscreen', monospace" }}
                      >
                        {member.name}
                      </h3>
                      <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mt-1">
                        {member.position} • {member.domain}
                      </p>
                      <p className="text-[11px] text-[#64748B] font-mono mt-1">
                        {member.branch} | Sem {member.semester}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-[#CBD5E1] leading-relaxed mb-6 bg-[#030712]/80 p-4 border border-[#1E293B] line-clamp-3 font-mono">
                    "{member.bio}"
                  </p>
                </div>

                <div className="pt-4 border-t-2 border-[#1E293B] flex items-center justify-between text-[11px] text-[#64748B]">
                  <span className="font-mono text-[#475569]">{member.srn}</span>
                  <div className="flex items-center gap-3 font-bold">
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition">
                        LinkedIn ↗
                      </a>
                    )}
                    {member.github && (
                      <a href={member.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                        GitHub ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}