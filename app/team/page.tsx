'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
]

const DOMAINS = ['All', 'Web Development', 'Design', 'Logistics', 'Operations', 'Sponsorship', 'Hospitality', 'Social Media', 'Event Management']
const POSITIONS = ['All', 'Head', 'Vice-Head', 'Core Member', 'Member']

export default function TeamDirectoryPage() {
  const pathname = usePathname()
  const [members, setMembers] = useState<any[]>([])
  const [selectedDomain, setSelectedDomain] = useState('All')
  const [selectedPosition, setSelectedPosition] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Force reload members from localStorage whenever the path/page is visited
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
  }, [pathname])

  const approvedMembers = members.filter((m) => {
    const isApproved = m.status === 'approved'
    const matchesDomain = selectedDomain === 'All' || m.domain === selectedDomain
    const matchesPosition = selectedPosition === 'All' || m.position === selectedPosition
    const matchesSearch = (m.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || (m.bio || '').toLowerCase().includes(searchQuery.toLowerCase())
    return isApproved && matchesDomain && matchesPosition && matchesSearch
  })

  return (
    <div className="relative min-h-screen bg-[#030712] text-[#E2E8F0] py-12 px-4 sm:px-6 lg:px-8 font-mono overflow-hidden">
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen&display=swap" rel="stylesheet" />

      <div className="max-w-7xl mx-auto relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b-2 border-[#1E293B] pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-500/15 text-teal-300 text-[10px] font-bold mb-3 border border-teal-500/40 uppercase tracking-widest" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              🌊 EMBRIONE 2026 DIRECTORY
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-wider text-[#F8FAFC]" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              MEET OUR TEAM
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/register" className="px-4 py-3 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'Silkscreen', monospace" }}>
              Register Profile
            </Link>
            <Link href="/admin" className="px-4 py-3 bg-[#0A0F1D] border-2 border-[#1E293B] text-teal-300 text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'Silkscreen', monospace" }}>
              Admin Portal
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-[#0B132B]/80 border-2 border-[#1E293B] p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-teal-400 uppercase mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>Search</label>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Type member name..." className="w-full bg-[#030712] border-2 border-[#1E293B] px-4 py-2 text-xs text-white" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-teal-400 uppercase mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>Domain</label>
              <select value={selectedDomain} onChange={(e) => setSelectedDomain(e.target.value)} className="w-full bg-[#030712] border-2 border-[#1E293B] px-4 py-2 text-xs text-white">
                {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-teal-400 uppercase mb-2" style={{ fontFamily: "'Press Start 2P', monospace" }}>Position</label>
              <select value={selectedPosition} onChange={(e) => setSelectedPosition(e.target.value)} className="w-full bg-[#030712] border-2 border-[#1E293B] px-4 py-2 text-xs text-white">
                {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Member Cards */}
        {approvedMembers.length === 0 ? (
          <div className="text-center py-20 bg-[#0B132B]/40 border-2 border-[#1E293B]">
            <p className="text-[#94A3B8] text-sm">No approved team members found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedMembers.map((member) => (
              <div key={member.id} className="bg-[#0B132B]/75 border-2 border-[#1E293B] hover:border-teal-400 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    <img src={member.avatar_url} alt={member.name} className="w-16 h-16 object-cover border-2 border-teal-500/60" />
                    <div>
                      <h3 className="text-sm font-bold text-white" style={{ fontFamily: "'Silkscreen', monospace" }}>{member.name}</h3>
                      <p className="text-[10px] font-bold text-teal-400 uppercase mt-1">{member.position} • {member.domain}</p>
                      <p className="text-[11px] text-[#64748B] mt-1">{member.branch} | Sem {member.semester}</p>
                    </div>
                  </div>
                  <p className="text-xs text-[#CBD5E1] bg-[#030712]/80 p-4 border border-[#1E293B] mb-6">"{member.bio}"</p>
                </div>

                <div className="pt-4 border-t-2 border-[#1E293B] flex justify-between text-[11px] text-[#64748B]">
                  <span>{member.srn}</span>
                  <div className="flex gap-3 font-bold">
                    {member.linkedin && <a href={member.linkedin} target="_blank" rel="noreferrer" className="hover:text-teal-400">LinkedIn ↗</a>}
                    {member.github && <a href={member.github} target="_blank" rel="noreferrer" className="hover:text-white">GitHub ↗</a>}
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