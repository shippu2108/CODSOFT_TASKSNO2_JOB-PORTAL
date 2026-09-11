'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch('/api/admin/stats')
        .then((res) => res.json())
        .then((d) => setData(d));
    }
  }, [session]);

  if (status === 'loading' || !session || !data) {
    return <div className="min-h-screen flex items-center justify-center bg-paper text-ink/50">Loading...</div>;
  }

  const { stats, recentJobs, allUsers } = data;

  return (
    <div className="min-h-screen bg-paper">
      <nav className="bg-ink">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="font-display text-lg font-semibold text-text-hi">CareerHub — Admin</span>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-text-soft">{session.user.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="px-3 py-1.5 bg-white/10 text-text-hi rounded-full text-xs hover:bg-white/20 transition-base"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8 animate-rise">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <StatCard label="Total Users" value={stats.totalUsers} color="brass" />
          <StatCard label="Candidates" value={stats.totalCandidates} color="violet" />
          <StatCard label="Recruiters" value={stats.totalRecruiters} color="forest" />
          <StatCard label="Jobs Posted" value={stats.totalJobs} color="brass" />
          <StatCard label="Applications" value={stats.totalApplications} color="violet" />
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('overview')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-base ${
              tab === 'overview' ? 'bg-ink text-text-hi' : 'bg-white text-ink/60 border border-line-light'
            }`}
          >
            Recent Jobs
          </button>
          <button
            onClick={() => setTab('users')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-base ${
              tab === 'users' ? 'bg-ink text-text-hi' : 'bg-white text-ink/60 border border-line-light'
            }`}
          >
            All Users
          </button>
        </div>

        {tab === 'overview' ? (
          <div className="grid gap-3">
            {recentJobs.map((job) => (
              <div key={job.id} className="bg-white p-5 rounded-2xl border border-line-light glow-on-hover">
                <div className="flex justify-between">
                  <h3 className="font-medium text-ink">{job.title}</h3>
                  <span className="text-xs text-ink/40">{job._count.applications} applicants</span>
                </div>
                <p className="text-sm text-ink/50 mt-1">{job.location} • {job.type}</p>
                <p className="text-xs text-ink/30 mt-1">Posted by {job.postedBy.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-line-light overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-paper">
                <tr>
                  <th className="p-3 text-ink/60 font-medium">Name</th>
                  <th className="p-3 text-ink/60 font-medium">Email</th>
                  <th className="p-3 text-ink/60 font-medium">Role</th>
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u) => (
                  <tr key={u.id} className="border-t border-line-light hover:bg-paper/50 transition-base">
                    <td className="p-3 text-ink">{u.name}</td>
                    <td className="p-3 text-ink/60">{u.email}</td>
                    <td className="p-3 text-ink/60">{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const styles = { brass: 'text-brass', violet: 'text-violet', forest: 'text-forest' };
  return (
    <div className="bg-white p-4 rounded-2xl border border-line-light text-center glow-on-hover">
      <p className={`font-display text-2xl font-semibold ${styles[color]}`}>{value}</p>
      <p className="text-xs text-ink/50 mt-1">{label}</p>
    </div>
  );
}