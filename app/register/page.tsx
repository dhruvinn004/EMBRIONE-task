'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const DOMAINS = ['Web Development', 'Design', 'Logistics', 'Operations', 'Sponsorship', 'Hospitality', 'Social Media', 'Event Management']
const POSITIONS = ['Head', 'Vice-Head', 'Core Member', 'Member']

const DEFAULT_AVATARS = [
  { id: 'diver', label: 'Deep Sea Diver', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&auto=format&fit=crop&q=80' },
  { id: 'kraken', label: 'Aqua Guardian', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { id: 'manta', label: 'Bio Manta', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80' },
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Convert uploaded image to WebP format using HTML5 Canvas
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const img = new Image()
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0)
        const webpDataUrl = canvas.toDataURL('image/webp', 0.8)
        setFormData((prev) => ({ ...prev, avatar_url: webpDataUrl }))
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newMember = {
      ...formData,
      id: Date.now().toString(),
      status: 'pending',
    }
    const existing = JSON.parse(localStorage.getItem('team_members') || '[]')
    localStorage.setItem('team_members', JSON.stringify([newMember, ...existing]))

    alert('Profile submitted successfully! Status is pending admin approval.')
    router.push('/team')
  }

  return (
    <div className="min-h-screen bg-[#030712] text-[#E2E8F0] py-10 px-4 font-mono">
      <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Silkscreen&family=Rye&display=swap" rel="stylesheet" />

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 pb-6 border-b-2 border-[#1E293B]">
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Press Start 2P', monospace" }}>REGISTER PROFILE</h1>
          <Link href="/team" className="px-4 py-2 bg-[#0A0F1D] border-2 border-[#1E293B] text-teal-300 text-xs font-bold" style={{ fontFamily: "'Silkscreen', monospace" }}>
            ← Team Directory
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-7 bg-[#0B132B]/80 border-2 border-[#1E293B] p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-teal-300 mb-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>Full Name *</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-[#030712] border-2 border-[#1E293B] p-2 text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-teal-300 mb-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>SRN *</label>
                <input type="text" name="srn" required value={formData.srn} onChange={handleChange} className="w-full bg-[#030712] border-2 border-[#1E293B] p-2 text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-teal-300 mb-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>Domain *</label>
                <select name="domain" value={formData.domain} onChange={handleChange} className="w-full bg-[#030712] border-2 border-[#1E293B] p-2 text-xs">
                  {DOMAINS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-teal-300 mb-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>Position *</label>
                <select name="position" value={formData.position} onChange={handleChange} className="w-full bg-[#030712] border-2 border-[#1E293B] p-2 text-xs">
                  {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-teal-300 mb-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>Branch *</label>
                <input type="text" name="branch" required value={formData.branch} onChange={handleChange} className="w-full bg-[#030712] border-2 border-[#1E293B] p-2 text-xs" />
              </div>
              <div>
                <label className="block text-[10px] text-teal-300 mb-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>Semester *</label>
                <input type="number" name="semester" required min="1" max="8" value={formData.semester} onChange={handleChange} className="w-full bg-[#030712] border-2 border-[#1E293B] p-2 text-xs" />
              </div>
            </div>

            <div className="bg-[#030712] border-2 border-[#1E293B] p-4 space-y-3">
              <label className="block text-[10px] text-teal-300 font-bold" style={{ fontFamily: "'Press Start 2P', monospace" }}>Profile Picture (.webp auto-converted)</label>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="w-full text-xs text-slate-300 bg-[#0B132B] p-2 border border-[#1E293B]" />
            </div>

            <div>
              <label className="block text-[10px] text-teal-300 mb-1" style={{ fontFamily: "'Press Start 2P', monospace" }}>Bio *</label>
              <textarea name="bio" required rows={3} value={formData.bio} onChange={handleChange} className="w-full bg-[#030712] border-2 border-[#1E293B] p-2 text-xs" />
            </div>

            <button type="submit" className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase" style={{ fontFamily: "'Press Start 2P', monospace" }}>
              Submit Application
            </button>
          </form>

          {/* Live Wanted Poster Preview */}
          <div className="lg:col-span-5 sticky top-10">
            <div className="bg-[#EAD8B1] border-4 border-[#5A3E2B] p-6 text-[#3D2612] flex flex-col items-center">
              <h2 className="text-3xl font-extrabold uppercase mb-1" style={{ fontFamily: "'Rye', serif" }}>WANTED</h2>
              <div className="w-48 h-48 bg-[#3D2612] border-4 border-[#5A3E2B] overflow-hidden mb-4">
                <img src={formData.avatar_url} alt="Wanted" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-lg font-black uppercase text-[#2B190B]" style={{ fontFamily: "'Rye', serif" }}>{formData.name || 'YOUR NAME'}</h3>
              <p className="text-[10px] font-bold text-[#6B4423] uppercase">{formData.position} • {formData.domain}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}