'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function RecruiterDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    requirements: '',
    location: '',
    type: 'FULL_TIME',
    salaryMin: '',
    salaryMax: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  const loadJobs = () => {
    fetch('/api/recruiter/jobs')
      .then((res) => res.json())
      .then((data) => {
        setJobs(data.jobs || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (session) loadJobs();
  }, [session]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        salaryMin: form.salaryMin ? parseInt(form.salaryMin) : null,
        salaryMax: form.salaryMax ? parseInt(form.salaryMax) : null,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setJobs((prev) => [{ ...data.job, _count: { applications: 0 } }, ...prev]);
      setForm({
        title: '', description: '', requirements: '', location: '',
        type: 'FULL_TIME', salaryMin: '', salaryMax: '',
      });
      setShowForm(false);
    }
  };

  const viewApplicants = (job) => {
    setSelectedJob(job);
    fetch(`/api/recruiter/applications?jobId=${job.id}`)
      .then((res) => res.json())
      .then((data) => setApplicants(data.applications || []));
  };

  const updateStatus = async (appId, newStatus) => {
    const res = await fetch(`/api/applications/${appId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setApplicants((prev) => prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a)));
    }
  };

  if (status === 'loading' || !session) {
    return <div className="min-h-screen flex items-center justify-center bg-paper text-ink/50">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-paper">
      <nav className="bg-ink">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="font-display text-lg font-semibold text-text-hi">CareerHub — Recruiter</span>
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

      <main className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-rise">
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-display text-xl font-medium text-ink">Your Job Postings</h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-brass text-ink rounded-full text-sm font-medium glow-on-hover"
            >
              {showForm ? 'Cancel' : '+ Post New Job'}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-line-light mb-6 grid gap-3 animate-rise">
              <input
                type="text" placeholder="Job Title"
                className="border border-line-light rounded-lg p-2.5 text-ink placeholder-ink/30 focus:outline-none focus:border-brass transition-base"
                value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required
              />
              <textarea
                placeholder="Description"
                className="border border-line-light rounded-lg p-2.5 text-ink placeholder-ink/30 focus:outline-none focus:border-brass transition-base"
                value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required
              />
              <textarea
                placeholder="Requirements"
                className="border border-line-light rounded-lg p-2.5 text-ink placeholder-ink/30 focus:outline-none focus:border-brass transition-base"
                value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} required
              />
              <input
                type="text" placeholder="Location"
                className="border border-line-light rounded-lg p-2.5 text-ink placeholder-ink/30 focus:outline-none focus:border-brass transition-base"
                value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required
              />
              <select
                className="border border-line-light rounded-lg p-2.5 text-ink focus:outline-none focus:border-brass transition-base"
                value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="CONTRACT">Contract</option>
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number" placeholder="Min Salary"
                  className="border border-line-light rounded-lg p-2.5 text-ink placeholder-ink/30 focus:outline-none focus:border-brass transition-base"
                  value={form.salaryMin} onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
                />
                <input
                  type="number" placeholder="Max Salary"
                  className="border border-line-light rounded-lg p-2.5 text-ink placeholder-ink/30 focus:outline-none focus:border-brass transition-base"
                  value={form.salaryMax} onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
                />
              </div>
              <button type="submit" className="bg-forest text-white p-2.5 rounded-full font-medium hover:bg-forest/90 transition-base">
                Post Job
              </button>
            </form>
          )}

          {loading ? (
            <p className="text-ink/50">Loading...</p>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-line-light">
              <p className="text-ink/40">You haven&apos;t posted any jobs yet.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className={`bg-white p-5 rounded-2xl border cursor-pointer transition-base ${
                    selectedJob?.id === job.id ? 'border-brass ring-1 ring-brass' : 'border-line-light hover:border-ink/20'
                  }`}
                  onClick={() => viewApplicants(job)}
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium text-ink">{job.title}</h3>
                    <span className="text-xs text-ink/40">{job._count?.applications || 0} applicants</span>
                  </div>
                  <p className="text-sm text-ink/50 mt-1">{job.location} • {job.type}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="font-display text-xl font-medium mb-6 text-ink">
            {selectedJob ? `Applicants — ${selectedJob.title}` : 'Select a job to view applicants'}
          </h2>

          {selectedJob && (
            applicants.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-line-light">
                <p className="text-ink/40">No applicants yet.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {applicants.map((app) => (
                  <div key={app.id} className="bg-white p-5 rounded-2xl border border-line-light">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-ink">{app.candidate.name}</h3>
                        <p className="text-sm text-ink/50">{app.candidate.email}</p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>

                    {app.candidate.candidateProfile?.experience != null && (
                      <p className="text-xs text-ink/50 mt-2">
                        {app.candidate.candidateProfile.experience} years of experience
                      </p>
                    )}

                    {app.candidate.candidateProfile?.bio && (
                      <p className="text-sm text-ink/70 mt-3 leading-relaxed">
                        {app.candidate.candidateProfile.bio}
                      </p>
                    )}

                    {app.candidate.candidateProfile?.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {app.candidate.candidateProfile.skills.map((skill, i) => (
                          <span key={i} className="text-xs bg-violet/10 text-violet px-2 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {app.candidate.candidateProfile?.resumeUrl ? (
                      <a
                        href={app.candidate.candidateProfile.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block text-sm text-brass underline mt-3"
                      >
                        View Resume
                      </a>
                    ) : (
                      <p className="text-xs text-ink/30 mt-3">No resume uploaded</p>
                    )}

                    <div className="mt-4 flex gap-2">
                      <button onClick={() => updateStatus(app.id, 'SHORTLISTED')} className="text-xs bg-brass-soft text-brass px-3 py-1.5 rounded-full hover:brightness-95 transition-base">
                        Shortlist
                      </button>
                      <button onClick={() => updateStatus(app.id, 'HIRED')} className="text-xs bg-forest-soft text-forest px-3 py-1.5 rounded-full hover:brightness-95 transition-base">
                        Hire
                      </button>
                      <button onClick={() => updateStatus(app.id, 'REJECTED')} className="text-xs bg-rust/10 text-rust px-3 py-1.5 rounded-full hover:brightness-95 transition-base">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </main>
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