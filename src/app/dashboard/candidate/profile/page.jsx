'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CandidateProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [experience, setExperience] = useState('');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch('/api/profile')
        .then((res) => res.json())
        .then((data) => {
          if (data.profile) {
            setProfile(data.profile);
            setBio(data.profile.bio || '');
            setSkillsInput((data.profile.skills || []).join(', '));
            setExperience(data.profile.experience || '');
          }
        });
    }
  }, [session]);

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('');

    const skills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);

    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio, skills, experience }),
    });

    setMessage(res.ok ? 'Profile updated!' : 'Failed to update profile');
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('resume', file);

    const res = await fetch('/api/upload-resume', { method: 'POST', body: formData });
    setUploading(false);

    if (res.ok) {
      const data = await res.json();
      setProfile((prev) => ({ ...prev, resumeUrl: data.url }));
      setMessage('Resume uploaded successfully!');
    } else {
      setMessage('Resume upload failed');
    }
  };

  if (status === 'loading' || !session) {
    return <div className="min-h-screen flex items-center justify-center bg-paper text-ink/50">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-paper">
      <nav className="bg-ink">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="font-display text-lg font-semibold text-text-hi">CareerHub — My Profile</span>
          <Link href="/dashboard/candidate" className="text-brass text-sm font-medium hover:text-amber-300 transition-base">
            ← Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-8 animate-rise">
        {message && (
          <p className="mb-4 text-sm text-forest bg-forest-soft rounded-lg px-3 py-2">{message}</p>
        )}

        <div className="bg-white p-6 rounded-2xl border border-line-light mb-6">
          <h2 className="font-display text-lg font-medium mb-4 text-ink">Resume</h2>
          {profile?.resumeUrl ? (
            <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-brass underline">
              View current resume
            </a>
          ) : (
            <p className="text-ink/50 mb-3">No resume uploaded yet.</p>
          )}
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            disabled={uploading}
            className="mt-3 text-sm text-ink/70"
          />
          {uploading && <p className="text-sm text-ink/40 mt-2">Uploading...</p>}
        </div>

        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-line-light grid gap-4">
          <h2 className="font-display text-lg font-medium text-ink">Profile Details</h2>

          <div>
            <label className="block text-sm text-ink/60 mb-1">Bio</label>
            <textarea
              className="w-full border border-line-light rounded-lg p-2.5 text-ink focus:outline-none focus:border-brass transition-base"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell recruiters about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm text-ink/60 mb-1">Skills (comma-separated)</label>
            <input
              type="text"
              className="w-full border border-line-light rounded-lg p-2.5 text-ink focus:outline-none focus:border-brass transition-base"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="React, Node.js, PostgreSQL"
            />
          </div>

          <div>
            <label className="block text-sm text-ink/60 mb-1">Years of Experience</label>
            <input
              type="number"
              className="w-full border border-line-light rounded-lg p-2.5 text-ink focus:outline-none focus:border-brass transition-base"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>

          <button type="submit" className="bg-brass text-ink p-2.5 rounded-full font-medium glow-on-hover">
            Save Profile
          </button>
        </form>
      </main>
    </div>
  );
}