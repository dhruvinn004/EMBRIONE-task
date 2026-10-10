'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

const DOMAINS = ['Web Development', 'Design', 'Logistics', 'Operations', 'Sponsorship', 'Hospitality', 'Social Media', 'Event Management']
const POSITIONS = ['Head', 'Vice-Head', 'Core Member', 'Member']

const DEFAULT_AVATARS = [
  { id: 'diver', label: 'Deep Sea Diver', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&auto=format&fit=crop&q=80' },
  { id: 'kraken', label: 'Aqua Guardian', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { id: 'manta', label: 'Bio Manta', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80' },
  { id: 'captain', label: 'Dungeon Captain', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { id: 'navigator', label: 'Deep Navigator', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80' },
]

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    srn: '',
    domain: DOMAINS[0],
    position: POSITIONS[3],
    branch: '',
    semester: '',
    email: '',
    linkedin: '',
    github: '',
    bio: '',
    avatar_url: DEFAULT_AVATARS[0].url,
  })

  // Eywa Particle Effect State
  const [eywaSeeds, setEywaSeeds] = useState<EywaSeed[]>([])

  // Autonomous Swimming Sea Creatures State
  const [creatures, setCreatures] = useState<SeaCreature[]>([
    { id: 'whale', name: 'Glow Whale', x: 80, y: 160, vx: 0.7, vy: 0.2, facingRight: true },
    { id: 'manta', name: 'Sea Manta', x: 650, y: 320, vx: -0.8, vy: -0.3, facingRight: false },
    { id: 'turtle', name: 'Aqua Turtle', x: 250, y: 550, vx: 0.6, vy: -0.15, facingRight: true },
    { id: 'angler', name: 'Luminous Angler', x: 800, y: 120, vx: -0.6, vy: 0.2, facingRight: false },
    { id: 'jelly1', name: 'Eywa Jelly', x: 180, y: 420, vx: 0.3, vy: -0.5, facingRight: true },
  ])

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatar_url: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const newMember = {
        ...formData,
        id: Date.now().toString(),
        status: 'pending',
      }

      const existing = JSON.parse(localStorage.getItem('team_members') || '[]')
      localStorage.setItem('team_members', JSON.stringify([newMember, ...existing]))

      alert('Profile submitted successfully! Status is pending admin approval.')
      router.push('/team')
    } catch (err: any) {
      alert('Error submitting registration: ' + err.message)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#030712] text-[#E2E8F0] py-10 px-4 sm:px-6 lg:px-8 font-mono overflow-hidden">
      
      {/* Minecraft & Rye Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen&family=Rye&display=swap" rel="stylesheet" />

      {/* Deep Ocean Glow Background */}
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

      {/* Eywa Cursor Particles */}
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
        
        {/* Header Navigation */}
        <div className="flex justify-between items-center mb-8 pb-6 border-b-2 border-[#1E293B]">
          <h1 
            className="text-xl md:text-2xl font-extrabold text-[#F8FAFC] drop-shadow-[2px_2px_0px_#0F766E]"
            style={{ fontFamily: "'Press Start 2P', monospace" }}
          >
            REGISTER PROFILE
          </h1>
          <Link
            href="/team"
            className="px-4 py-2.5 bg-[#0A0F1D] hover:bg-[#111C35] border-2 border-[#1E293B] text-teal-300 text-xs font-bold rounded-none shadow-[2px_2px_0px_#030712] uppercase"
            style={{ fontFamily: "'Silkscreen', monospace" }}
          >
            &larr; Team Directory
          </Link>
        </div>

        {/* Form and Live Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Registration Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 bg-[#0B132B]/80 backdrop-blur-xl border-2 border-[#1E293B] p-6 sm:p-8 shadow-[6px_6px_0px_#030712] space-y-6">
            <p className="text-xs text-teal-400 font-semibold uppercase tracking-wider">
              Fill in your details below. Preview your live Wanted poster on the right!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-teal-300 uppercase tracking-widest mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Aarav Sharma"
                  className="w-full bg-[#030712] border-2 border-[#1E293B] px-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-teal-500 rounded-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-teal-300 uppercase tracking-widest mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>SRN *</label>
                <input
                  type="text"
                  name="srn"
                  required
                  value={formData.srn}
                  onChange={handleChange}
                  placeholder="PES1UG23CS001"
                  className="w-full bg-[#030712] border-2 border-[#1E293B] px-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-teal-500 rounded-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-teal-300 uppercase tracking-widest mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>Domain *</label>
                <select
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  className="w-full bg-[#030712] border-2 border-[#1E293B] px-4 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-teal-500 rounded-none"
                >
                  {DOMAINS.map((d) => (
                    <option key={d} value={d} className="bg-[#0B132B]">{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-teal-300 uppercase tracking-widest mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>Position *</label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full bg-[#030712] border-2 border-[#1E293B] px-4 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-teal-500 rounded-none"
                >
                  {POSITIONS.map((p) => (
                    <option key={p} value={p} className="bg-[#0B132B]">{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-teal-300 uppercase tracking-widest mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>Branch *</label>
                <input
                  type="text"
                  name="branch"
                  required
                  value={formData.branch}
                  onChange={handleChange}
                  placeholder="CSE / AIML"
                  className="w-full bg-[#030712] border-2 border-[#1E293B] px-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-teal-500 rounded-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-teal-300 uppercase tracking-widest mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>Semester *</label>
                <input
                  type="number"
                  name="semester"
                  required
                  min="1"
                  max="8"
                  value={formData.semester}
                  onChange={handleChange}
                  placeholder="5"
                  className="w-full bg-[#030712] border-2 border-[#1E293B] px-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-teal-500 rounded-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-teal-300 uppercase tracking-widest mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>PES Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="aarav@pes.edu"
                  className="w-full bg-[#030712] border-2 border-[#1E293B] px-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-teal-500 rounded-none"
                />
              </div>

              {/* PROFILE PICTURE OPTIONS */}
              <div className="md:col-span-2 bg-[#030712]/80 border-2 border-[#1E293B] p-4 space-y-4">
                <label className="block text-[10px] font-bold text-teal-300 uppercase tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                  Choose Profile Picture
                </label>

                {/* Option 1: Upload from Device */}
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Upload from Device:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-bold file:bg-teal-600 file:text-white hover:file:bg-teal-500 cursor-pointer bg-[#0B132B] border border-[#1E293B] p-2"
                  />
                </div>

                {/* Option 2: Choose Presets */}
                <div>
                  <label className="block text-xs text-slate-400 mb-2">Or Choose Preset Avatar:</label>
                  <div className="flex flex-wrap gap-3">
                    {DEFAULT_AVATARS.map((avatar) => (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, avatar_url: avatar.url })}
                        className={`flex items-center gap-2 px-3 py-2 border-2 transition ${
                          formData.avatar_url === avatar.url
                            ? 'border-teal-400 bg-teal-950/60 text-white shadow-[2px_2px_0px_#2DD4BF]'
                            : 'border-[#1E293B] bg-[#0B132B] text-slate-400 hover:border-teal-600'
                        }`}
                      >
                        <img src={avatar.url} alt={avatar.label} className="w-6 h-6 rounded-full object-cover bg-slate-800" />
                        <span className="text-[10px] font-bold" style={{ fontFamily: "'Silkscreen', monospace" }}>{avatar.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-teal-300 uppercase tracking-widest mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>LinkedIn Link</label>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full bg-[#030712] border-2 border-[#1E293B] px-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-teal-500 rounded-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-teal-300 uppercase tracking-widest mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>GitHub Link</label>
                <input
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleChange}
                  placeholder="https://github.com/..."
                  className="w-full bg-[#030712] border-2 border-[#1E293B] px-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-teal-500 rounded-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-teal-300 uppercase tracking-widest mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>Bio *</label>
                <textarea
                  name="bio"
                  required
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about your background and goals..."
                  className="w-full bg-[#030712] border-2 border-[#1E293B] p-4 text-xs text-[#F8FAFC] placeholder-[#475569] focus:outline-none focus:border-teal-500 rounded-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs border-b-4 border-r-4 border-teal-900 active:translate-y-0.5 transition uppercase tracking-widest shadow-[4px_4px_0px_#030712]"
              style={{ fontFamily: "'Press Start 2P', monospace" }}
            >
              Submit Application
            </button>
          </form>

          {/* RIGHT: ONE PIECE "WANTED" LIVE CARD WITH UNDERWATER CHAINS */}
          <div className="lg:col-span-5 sticky top-10">
            <div className="text-center mb-3">
              <span className="text-[10px] text-teal-400 font-bold uppercase tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace" }}>
                ⚡ LIVE PREVIEW CARD
              </span>
            </div>

            <div className="relative group">
              {/* Chains Overlay */}
              <div className="absolute -top-6 -left-6 w-16 h-16 z-30 pointer-events-none drop-shadow-[0_0_10px_#2DD4BF]">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-[#1E293B] stroke-[#2DD4BF] stroke-2">
                  <rect x="10" y="10" width="35" height="18" rx="8" />
                  <rect x="35" y="22" width="35" height="18" rx="8" transform="rotate(45 35 22)" />
                </svg>
              </div>

              <div className="absolute -bottom-5 -left-5 -right-5 h-12 z-30 pointer-events-none flex items-center justify-between opacity-90 drop-shadow-[0_0_12px_rgba(45,212,191,0.5)]">
                <svg viewBox="0 0 300 40" className="w-full h-full">
                  <path d="M 10 20 Q 75 38 150 20 T 290 20" fill="none" stroke="#1E293B" strokeWidth="12" strokeDasharray="14 8" strokeLinecap="round" />
                  <path d="M 10 20 Q 75 38 150 20 T 290 20" fill="none" stroke="#2DD4BF" strokeWidth="3" strokeDasharray="14 8" strokeLinecap="round" />
                </svg>
              </div>

              {/* Wanted Poster Card */}
              <div className="bg-[#EAD8B1] border-4 border-[#5A3E2B] p-6 shadow-[12px_12px_0px_#030712] text-[#3D2612] flex flex-col items-center relative overflow-hidden z-10">
                <div className="absolute inset-0 bg-[radial-gradient(#8C6239_1px,transparent_1px)] [background-size:12px_12px] opacity-10 pointer-events-none" />

                <h2 className="text-4xl font-extrabold tracking-widest text-[#3D2612] uppercase mb-1 drop-shadow-sm" style={{ fontFamily: "'Rye', serif" }}>
                  WANTED
                </h2>

                <p className="text-[9px] font-bold tracking-widest uppercase text-[#6B4423] mb-4">
                  DEAD OR ALIVE — EMBRIONE RECRUIT
                </p>

                <div className="w-52 h-52 bg-[#3D2612] border-4 border-[#5A3E2B] overflow-hidden shadow-inner flex items-center justify-center relative mb-4">
                  <img
                    src={formData.avatar_url || DEFAULT_AVATARS[0].url}
                    alt="Wanted Avatar"
                    className="w-full h-full object-cover sepia-[0.2] contrast-125"
                    onError={(e: any) => { e.target.src = DEFAULT_AVATARS[0].url }}
                  />
                </div>

                <div className="w-full text-center border-b-2 border-[#5A3E2B] pb-2 mb-2">
                  <h3 className="text-xl font-black uppercase text-[#2B190B] tracking-wider truncate" style={{ fontFamily: "'Rye', serif" }}>
                    {formData.name || 'YOUR NAME'}
                  </h3>
                </div>

                <div className="text-center space-y-1">
                  <p className="text-xs font-black uppercase text-[#5A3E2B] tracking-widest" style={{ fontFamily: "'Silkscreen', monospace" }}>
                    ฿ {formData.srn ? formData.srn : 'SRN-NOT-SET'}
                  </p>
                  <p className="text-[10px] font-bold text-[#6B4423] uppercase">
                    {formData.position} • {formData.domain}
                  </p>
                  <p className="text-[10px] font-mono text-[#8C5A2B]">
                    {formData.branch ? `${formData.branch} (Sem ${formData.semester || '?'})` : 'Branch & Sem'}
                  </p>
                  <p className="text-[9px] text-[#4A3019] italic max-w-xs line-clamp-2 mt-2 px-2">
                    "{formData.bio || 'Your bio statement will appear here on your official bounty poster...'}"
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-[#8C5A2B]/40 w-full flex justify-between items-center text-[8px] font-bold text-[#6B4423] uppercase">
                  <span>PES MARINE RECRUITMENT</span>
                  <span>EMBRIONE 2026</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
