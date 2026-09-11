'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CandidateDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('jobs');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  const loadData = () => {
    Promise.all([
      fetch('/api/jobs').then((res) => res.json()),
      fetch('/api/applications').then((res) => res.json()),
    ]).then(([jobsData, appsData]) => {
      setJobs(jobsData.jobs || []);
      setApplications(appsData.applications || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    if (session) loadData();
  }, [session]);

  const appliedJobIds = new Set(applications.map((a) => a.jobId));

  const handleApply = async (jobId) => {
  setMessage('');
  const res = await fetch('/api/applications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jobId }),
  });

  if (res.ok) {
    const data = await res.json();
    const job = jobs.find((j) => j.id === jobId);
    setApplications((prev) => [{ ...data.application, job }, ...prev]);
    setMessage('Applied successfully!');
  } else {
    const errData = await res.json();
    setMessage(errData.error || 'Failed to apply');
  }
};

  if (status === 'loading' || !session) {
    return <div className="min-h-screen flex items-center justify-center bg-paper text-ink/50">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-paper">
      <nav className="bg-ink">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="font-display text-lg font-semibold text-text-hi">CareerHub</span>
          <div className="flex items-center gap-5 text-sm">
            <Link href="/dashboard/candidate/profile" className="text-brass font-medium hover:text-amber-300 transition-base">
              My Profile
            </Link>
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
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('jobs')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-base ${
              tab === 'jobs' ? 'bg-ink text-text-hi' : 'bg-white text-ink/60 border border-line-light'
            }`}
          >
            Browse Jobs
          </button>
          <button
            onClick={() => setTab('applications')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-base ${
              tab === 'applications' ? 'bg-ink text-text-hi' : 'bg-white text-ink/60 border border-line-light'
            }`}
          >
            My Applications ({applications.length})
          </button>
        </div>

        {message && (
          <p className="mb-4 text-sm text-forest bg-forest-soft rounded-lg px-3 py-2">{message}</p>
        )}

        {loading ? (
          <p className="text-ink/50">Loading...</p>
        ) : tab === 'jobs' ? (
          jobs.length === 0 ? (
            <EmptyState text="No jobs available right now." />
          ) : (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white p-6 rounded-2xl border border-line-light glow-on-hover">
                  <h3 className="font-display text-lg font-medium text-ink">{job.title}</h3>
                  <p className="text-sm text-ink/50 mt-1">{job.location} • {job.type}</p>
                  <p className="text-ink/70 mt-3 leading-relaxed">{job.description}</p>
                  <button
                    onClick={() => handleApply(job.id)}
                    disabled={appliedJobIds.has(job.id)}
                    className={`mt-4 px-4 py-2 rounded-full text-sm font-medium transition-base ${
                      appliedJobIds.has(job.id)
                        ? 'bg-line-light text-ink/40 cursor-not-allowed'
                        : 'bg-forest text-white hover:bg-forest/90'
                    }`}
                  >
                    {appliedJobIds.has(job.id) ? 'Applied' : 'Apply Now'}
                  </button>
                </div>
              ))}
            </div>
          )
        ) : applications.length === 0 ? (
          <EmptyState text="You haven't applied to any jobs yet." />
        ) : (
          <div className="grid gap-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-white p-6 rounded-2xl border border-line-light">
                <div className="flex justify-between items-center">
                  <h3 className="font-display text-lg font-medium text-ink">{app.job.title}</h3>
                  <StatusBadge status={app.status} />
                </div>
                <p className="text-sm text-ink/50 mt-1">{app.job.location} • {app.job.type}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-line-light">
      <p className="text-ink/40">{text}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    APPLIED: 'bg-violet/10 text-violet',
    SHORTLISTED: 'bg-brass-soft text-brass',
    HIRED: 'bg-forest-soft text-forest',
    REJECTED: 'bg-rust/10 text-rust',
  };
  return (
    <span className={`text-xs font-medium px-3 py-1 rounded-full ${styles[status] || 'bg-line-light text-ink/50'}`}>
      {status}
    </span>
  );
}