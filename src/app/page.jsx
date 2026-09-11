import Link from 'next/link';

const companies = [
  'Northline Studio', 'Voyage Labs', 'Harbor & Co.', 'Fieldstone',
  'Baymark', 'Cinder Digital', 'Anchorpoint', 'Lumeworks',
];

export default function Home() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="mesh-bg">
        <nav className="max-w-5xl mx-auto px-6 py-5 flex justify-between items-center">
          <span className="font-display text-xl font-semibold text-text-hi">CareerHub</span>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/login" className="text-text-soft hover:text-text-hi transition-base">
              Log in
            </Link>
            <Link href="/signup" className="px-4 py-2 bg-brass text-ink rounded-full font-medium glow-on-hover">
              Get started
            </Link>
          </div>
        </nav>

        <section className="max-w-5xl mx-auto px-6 py-24 md:py-32 grid md:grid-cols-[1.3fr_1fr] gap-12 items-center">
          <div className="animate-rise">
            <p className="text-sm text-brass font-medium mb-4 tracking-wide">A recruitment platform, built simply</p>
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-text-hi leading-[1.08] mb-6">
              Where careers meet{' '}
              <span className="bg-gradient-to-r from-brass via-amber-300 to-violet-400 bg-clip-text text-transparent">
                opportunity
              </span>.
            </h1>
            <p className="text-lg text-text-soft max-w-md mb-8 leading-relaxed">
              CareerHub connects job seekers and companies through one focused
              workflow — post roles, apply in minutes, and follow every
              application from first click to offer.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/signup" className="px-6 py-3 bg-brass text-ink rounded-full font-medium glow-on-hover">
                Find a job
              </Link>
              <Link href="/signup" className="px-6 py-3 glass text-text-hi rounded-full font-medium hover:bg-white/10 transition-base">
                Hire talent
              </Link>
            </div>
          </div>

          <div className="animate-rise animate-float glass rounded-2xl p-6" style={{ animationDelay: '0.15s' }}>
            <p className="text-xs text-text-soft mb-4">Recently posted</p>
            <div className="space-y-3">
              <JobPreview title="Product Designer" company="Northline Studio" type="Full-time" color="forest" />
              <JobPreview title="Backend Engineer" company="Voyage Labs" type="Contract" color="violet" />
              <JobPreview title="Marketing Lead" company="Harbor & Co." type="Full-time" color="brass" />
            </div>
          </div>
        </section>

        {/* Logo marquee */}
        <div className="border-t border-line py-8 marquee-mask overflow-hidden">
          <p className="text-center text-xs text-text-soft mb-5 tracking-wide">Trusted by teams at</p>
          <div className="flex w-max animate-marquee">
            {[...companies, ...companies].map((name, i) => (
              <span
                key={i}
                className="font-display text-xl text-text-hi/50 hover:text-text-hi transition-base mx-8 whitespace-nowrap"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6">
        {/* Animated office scene */}
        <section className="py-20">
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl font-semibold text-ink mb-3">Hiring, happening right now</h2>
            <p className="text-ink/60 max-w-md mx-auto">
              Real teams, real conversations — CareerHub keeps every hire moving.
            </p>
          </div>

          <div className="relative bg-ink rounded-3xl p-8 md:p-12 overflow-hidden h-72 md:h-80">
            <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-brass via-transparent to-violet" />

            {/* floor line */}
            <div className="absolute bottom-10 left-0 right-0 h-px bg-white/10" />

            {/* Desk 1 */}
            <div className="absolute left-[8%] bottom-10 anim-bob">
              <Desk color="var(--brass)" />
              <ChatBubble className="anim-pop" style={{ animationDelay: '0.5s' }} />
            </div>

            {/* Desk 2 */}
            <div className="absolute left-[38%] bottom-10 anim-bob-slow" style={{ animationDelay: '0.8s' }}>
              <Desk color="var(--forest)" glow />
            </div>

            {/* Desk 3 */}
            <div className="absolute right-[10%] bottom-10 anim-bob" style={{ animationDelay: '1.4s' }}>
              <Desk color="var(--violet)" />
              <ChatBubble className="anim-pop" style={{ animationDelay: '2.2s' }} />
            </div>

            {/* Walking figure */}
            <div className="absolute left-1/2 top-10 anim-walk">
              <Person />
            </div>
          </div>
        </section>

        <section className="py-16 border-t border-line-light grid md:grid-cols-3 gap-10">
          <Feature title="For candidates" desc="Build a profile once, upload your resume, and apply to roles in a single click." color="forest" />
          <Feature title="For recruiters" desc="Post openings and move candidates through your pipeline without the spreadsheet." color="violet" />
          <Feature title="Built for focus" desc="No noise, no distractions — just the tools a hiring workflow actually needs." color="brass" />
        </section>
      </main>

      <footer className="border-t border-line-light py-8">
        <div className="max-w-5xl mx-auto px-6 text-sm text-ink/60">CareerHub</div>
      </footer>
    </div>
  );
}

function Desk({ color, glow }) {
  return (
    <div className="relative w-20 h-16">
      <div className="absolute bottom-0 w-20 h-3 rounded-sm bg-white/15" />
      <div
        className="absolute bottom-3 left-3 w-14 h-9 rounded-t-md border-2"
        style={{ borderColor: color, boxShadow: glow ? `0 0 16px ${color}` : 'none' }}
      >
        <div className="absolute inset-1 rounded-sm anim-glow" style={{ background: color, opacity: 0.3 }} />
      </div>
      <div className="absolute bottom-11 left-6 w-8 h-8 rounded-full bg-white/25" />
    </div>
  );
}

function Person() {
  return (
    <div className="flex flex-col items-center opacity-70">
      <div className="w-4 h-4 rounded-full bg-white/40" />
      <div className="w-6 h-8 rounded-t-full bg-white/25 mt-0.5" />
    </div>
  );
}

function ChatBubble({ className, style }) {
  return (
    <div
      className={`absolute -top-4 left-8 bg-white/90 text-ink text-[10px] px-2 py-1 rounded-full ${className}`}
      style={style}
    >
      💬
    </div>
  );
}

function JobPreview({ title, company, type, color }) {
  const dot = { forest: 'bg-forest', violet: 'bg-violet', brass: 'bg-brass' }[color];
  return (
    <div className="flex justify-between items-center py-3 border-b border-line last:border-0">
      <div className="flex items-center gap-3">
        <span className={`w-2 h-2 rounded-full ${dot}`} />
        <div>
          <p className="text-sm font-medium text-text-hi">{title}</p>
          <p className="text-xs text-text-soft">{company}</p>
        </div>
      </div>
      <span className="text-xs px-2.5 py-1 rounded-full glass text-text-soft">{type}</span>
    </div>
  );
}

function Feature({ title, desc, color }) {
  const bar = { forest: 'bg-forest', violet: 'bg-violet', brass: 'bg-brass' }[color];
  return (
    <div className="group">
      <span className={`block w-10 h-1 rounded-full ${bar} mb-4 transition-base group-hover:w-16`} />
      <h3 className="font-display text-lg font-medium text-ink mb-2">{title}</h3>
      <p className="text-sm text-ink/60 leading-relaxed">{desc}</p>
    </div>
  );
}