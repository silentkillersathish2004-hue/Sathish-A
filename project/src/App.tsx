import { useEffect, useRef, useState, useCallback } from 'react';
import {
  Github, Mail, Phone, MapPin, Code2, Database, Wrench, BookOpen,
  Trophy, Briefcase, GraduationCap, Layers, Terminal, Star, Zap,
  ChevronDown, ExternalLink, Award, Globe, Cpu
} from 'lucide-react';

// ─── Intersection observer hook ───────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('revealed'); }),
      { threshold: 0.12 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });
}

// ─── Skill bar animation ───────────────────────────────────────────────────────
function useSkillBars() {
  useEffect(() => {
    const bars = document.querySelectorAll('.skill-bar-fill');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('animate'); }),
      { threshold: 0.3 }
    );
    bars.forEach((b) => observer.observe(b));
    return () => observer.disconnect();
  });
}

// ─── Counter animation hook ────────────────────────────────────────────────────
function useCounter(target: number, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        let start = 0;
        const step = Math.ceil(target / (duration / 16));
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(start);
        }, 16);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

// ─── Particles ────────────────────────────────────────────────────────────────
const SYMBOLS = ['{ }', '</>', '( )', '=>', '[ ]', '##', '**', '01', 'def', 'fn()', 'git'];

function Particles() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    symbol: SYMBOLS[i % SYMBOLS.length],
    left: `${(i * 5.5) % 100}%`,
    delay: `${(i * 0.7) % 8}s`,
    duration: `${8 + (i * 1.3) % 10}s`,
    size: 10 + (i % 4) * 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            bottom: '-20px',
            fontSize: `${p.size}px`,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ id, children, className = '' }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto ${className}`}>
      {children}
    </section>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────
function SectionHeading({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="reveal flex items-center gap-4 mb-12">
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
        <Icon size={18} className="text-cyan-400" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-bold text-white">{title}</h2>
      <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/40 to-transparent" />
    </div>
  );
}

// ─── Skill badge ──────────────────────────────────────────────────────────────
function SkillBadge({ label }: { label: string }) {
  return <span className="badge">{label}</span>;
}

// ─── Skill bar ────────────────────────────────────────────────────────────────
function SkillBar({ label, pct, color = '#00d4aa' }: { label: string; pct: number; color?: string }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-300 font-mono">{label}</span>
        <span className="text-xs text-cyan-400 font-mono">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className="skill-bar-fill h-full rounded-full"
          style={{ '--target-width': `${pct}%`, background: color } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

// ─── Timeline item ────────────────────────────────────────────────────────────
function TimelineItem({
  period, title, org, points, delay = 0,
}: { period: string; title: string; org: string; points: string[]; delay?: number }) {
  return (
    <div className={`reveal delay-${delay * 100} flex gap-6 mb-10`}>
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-cyan-400 glow-border mt-1 shrink-0" />
        <div className="w-px flex-1 timeline-line mt-2" />
      </div>
      <div className="pb-4">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded">
            {period}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-cyan-300 font-medium mb-3">{org}</p>
        <ul className="space-y-1.5">
          {points.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-gray-400">
              <span className="text-cyan-500 mt-0.5 shrink-0">›</span>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ─── Project card ─────────────────────────────────────────────────────────────
function ProjectCard({
  title, tech, year, points, delay = 0,
}: { title: string; tech: string; year: string; points: string[]; delay?: number }) {
  return (
    <div className={`reveal-scale delay-${delay * 100} project-card rounded-xl border border-white/10 bg-white/[0.03] p-6`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-white">{title}</h3>
          <p className="text-xs text-cyan-400 font-mono mt-0.5">{year}</p>
        </div>
        <ExternalLink size={14} className="text-gray-600 mt-1" />
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {tech.split(',').map((t) => (
          <span key={t} className="text-xs px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono">
            {t.trim()}
          </span>
        ))}
      </div>
      <ul className="space-y-1.5">
        {points.map((p, i) => (
          <li key={i} className="flex gap-2 text-xs text-gray-400">
            <span className="text-green-400 mt-0.5 shrink-0">▸</span>
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ target, label, suffix = '+' }: { target: number; label: string; suffix?: string }) {
  const { count, ref } = useCounter(target);
  return (
    <div className="reveal-scale text-center p-6 rounded-xl border border-white/10 bg-white/[0.03]">
      <div className="text-4xl font-bold gradient-text mb-1">
        <span ref={ref}>{count}</span>{suffix}
      </div>
      <p className="text-sm text-gray-400">{label}</p>
    </div>
  );
}

// ─── Typewriter effect ────────────────────────────────────────────────────────
function Typewriter({ texts }: { texts: string[] }) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[idx];
    if (!deleting && displayed.length < current.length) {
      const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
      return () => clearTimeout(t);
    }
    if (!deleting && displayed.length === current.length) {
      const t = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx((i) => (i + 1) % texts.length);
    }
  }, [displayed, deleting, idx, texts]);

  return (
    <span className="text-cyan-400 font-mono">
      {displayed}<span className="cursor" />
    </span>
  );
}

// ─── Nav dots ────────────────────────────────────────────────────────────────
const NAV_SECTIONS = ['hero', 'skills', 'experience', 'projects', 'education', 'achievements'];

function NavDots() {
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { threshold: 0.5 }
    );
    NAV_SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 hidden sm:flex">
      {NAV_SECTIONS.map((id) => (
        <button
          key={id}
          title={id}
          onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
          className={`nav-dot w-2 h-2 rounded-full border border-cyan-400/50 ${active === id ? 'active' : 'bg-transparent'}`}
        />
      ))}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  useReveal();
  useSkillBars();

  return (
    <div className="min-h-screen grid-bg" style={{ background: 'var(--bg-primary)' }}>
      <NavDots />

      {/* ── HERO ── */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden"
      >
        <Particles />

        {/* Radial glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[600px] h-[600px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #00d4aa 0%, transparent 70%)' }}
          />
        </div>

        {/* Avatar ring */}
        <div className="relative mb-8">
          <div className="spin-slow absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/30" />
          <div className="w-28 h-28 rounded-full border-2 border-cyan-400/60 flex items-center justify-center glow-border bg-gradient-to-br from-cyan-900/40 to-blue-900/40">
            <Terminal size={44} className="text-cyan-400" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-500 border-2 border-[#0d1117] flex items-center justify-center">
            <span className="text-[9px] font-bold text-white">ON</span>
          </div>
        </div>

        {/* Name */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-3">
          <span className="gradient-text">Sathish A</span>
        </h1>

        {/* Typewriter roles */}
        <p className="text-lg sm:text-xl text-gray-400 mb-2 font-mono">
          &lt;<Typewriter texts={['Python Developer', 'Full Stack Engineer', 'Backend Developer', 'ML Enthusiast', 'REST API Builder']} />&gt;
        </p>

        {/* Contact row */}
        <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-gray-400">
          {[
            { icon: Phone, label: '93449-30652' },
            { icon: Mail, label: 'sathishgrillworks@gmail.com' },
            { icon: MapPin, label: 'Tiruvannamalai, TN' },
            { icon: Github, label: 'GitHub' },
          ].map(({ icon: Icon, label }) => (
            <span key={label} className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
              <Icon size={14} className="text-cyan-500" />
              {label}
            </span>
          ))}
        </div>

        {/* Tech strip */}
        <div className="flex flex-wrap justify-center gap-2 mt-8">
          {['Python', 'Django', 'REST API', 'SQL', 'JavaScript', 'OpenCV', 'ML', 'HTML5', 'CSS3'].map((t) => (
            <SkillBadge key={t} label={t} />
          ))}
        </div>

        {/* Scroll cue */}
        <button
          onClick={() => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-600 hover:text-cyan-400 transition-colors animate-bounce"
        >
          <ChevronDown size={28} />
        </button>
      </section>

      {/* ── ABOUT ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="reveal rounded-2xl border border-white/10 bg-white/[0.02] p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-transparent" />
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 mt-1">
              <Globe size={18} className="text-cyan-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white mb-2">Career Objective</h2>
              <p className="text-gray-400 leading-relaxed text-sm sm:text-base">
                Computer Science and Engineering student <span className="text-cyan-400 font-semibold">(2026)</span> with strong programming skills in Python, Django, REST APIs, SQL, and frontend technologies. Completed <span className="text-cyan-400">Python Full Stack certification</span> from Besant Technology, Bangalore. Experienced in startup environments through hands-on development roles. Seeking an entry-level Software Developer role in <span className="text-white">backend development, full stack engineering, automation, or data analytics</span>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── SKILLS ── */}
      <Section id="skills">
        <SectionHeading icon={Code2} title="Technical Skills" />
        <div className="grid sm:grid-cols-2 gap-8">
          {/* Left: bars */}
          <div className="reveal-left">
            <h3 className="text-xs font-mono uppercase tracking-widest text-gray-500 mb-5">Proficiency</h3>
            <SkillBar label="Python" pct={90} />
            <SkillBar label="Django / REST API" pct={82} color="#58a6ff" />
            <SkillBar label="SQL / MySQL" pct={80} color="#3fb950" />
            <SkillBar label="HTML5 / CSS3 / Bootstrap" pct={85} />
            <SkillBar label="JavaScript" pct={70} color="#f78166" />
            <SkillBar label="Machine Learning" pct={65} color="#d2a8ff" />
          </div>

          {/* Right: categories */}
          <div className="reveal-right space-y-6">
            {[
              { icon: Code2, label: 'Languages', items: ['Python', 'JavaScript', 'SQL', 'HTML5', 'CSS3'] },
              { icon: Layers, label: 'Frameworks & APIs', items: ['Django', 'REST API Development', 'Bootstrap'] },
              { icon: Database, label: 'Databases', items: ['MySQL', 'SQL – CRUD', 'Joins', 'Aggregations'] },
              { icon: Cpu, label: 'Data & ML', items: ['Pandas', 'NumPy', 'OpenCV', 'Scikit-Learn'] },
              { icon: Wrench, label: 'Tools & Platforms', items: ['GitHub', 'VS Code', 'Jupyter Notebook', 'Postman', 'Tableau'] },
              { icon: BookOpen, label: 'Concepts', items: ['OOP', 'Data Structures', 'MVC', 'File Handling', 'Exception Handling'] },
            ].map(({ icon: Icon, label, items }) => (
              <div key={label}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={13} className="text-cyan-400" />
                  <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">{label}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((item) => <SkillBadge key={item} label={item} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── EXPERIENCE ── */}
      <Section id="experience" className="border-t border-white/5">
        <SectionHeading icon={Briefcase} title="Experience" />
        <TimelineItem
          period="2024 – 2025"
          title="Python Developer"
          org="CyberWolf – Startup, Tiruvannamalai"
          delay={1}
          points={[
            'Developed Python-based web features with structured backend logic and data handling',
            'Debugged scripts and tested application modules to fix errors and improve performance',
            'Collaborated in an agile startup team gaining practical Python development experience',
          ]}
        />
        <TimelineItem
          period="2025"
          title="Web Designer & Content Editor"
          org="Boni Bytes – Startup, Tiruvannamalai"
          delay={2}
          points={[
            'Built frontend web pages using HTML, CSS, and Bootstrap as UI components for Python-backed applications',
            'Structured content layouts and improved usability across application interfaces',
          ]}
        />
        <TimelineItem
          period="2023 – 2024"
          title="Content Editor"
          org="CTTech Solutions – Startup, Tiruvannamalai"
          delay={3}
          points={[
            'Reviewed technical documentation and data reports ensuring accuracy before stakeholder delivery',
          ]}
        />
      </Section>

      {/* ── PROJECTS ── */}
      <Section id="projects" className="border-t border-white/5">
        <SectionHeading icon={Terminal} title="Projects" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProjectCard
            title="Hand Gesture Recognition System"
            tech="Python, OpenCV, Scikit-Learn, ML Pipeline"
            year="2026"
            delay={1}
            points={[
              'Real-time hand gesture recognition using OOP and modular Python scripts',
              'Integrated OpenCV for frame processing + SVM/KNN classification models',
              'Full pipeline: input capture → preprocessing → model inference → live display',
            ]}
          />
          <ProjectCard
            title="EV Monitoring Dashboard"
            tech="Python, Pandas, SQL, Tableau, CSV Pipeline"
            year="May 2025"
            delay={2}
            points={[
              'Loaded, cleaned, and transformed raw EV datasets from CSV files using Pandas',
              'Used SQL queries to filter and aggregate Electric Vehicle data for analysis',
              'Exported results to Tableau for visual performance dashboards',
            ]}
          />
          <ProjectCard
            title="Personal Portfolio Website"
            tech="HTML, CSS, Bootstrap, JavaScript, GitHub Pages"
            year="2024"
            delay={3}
            points={[
              'Built and deployed a responsive portfolio website with clean design',
              'Used GitHub for version control and GitHub Pages for continuous deployment',
            ]}
          />
        </div>
      </Section>

      {/* ── EDUCATION ── */}
      <Section id="education" className="border-t border-white/5">
        <SectionHeading icon={GraduationCap} title="Education & Certification" />
        <TimelineItem
          period="2022 – 2026"
          title="B.E. – Computer Science & Engineering"
          org="SKP Engineering College, Tiruvannamalai"
          delay={1}
          points={['Key subjects: Data Structures, Python, DBMS, Machine Learning, Web Technologies, IoT']}
        />
        <TimelineItem
          period="2026"
          title="Python Full Stack Development – Certification"
          org="Besant Technology, BTM Layout, Bangalore"
          delay={2}
          points={[
            'Covered Python, Django, REST APIs, HTML, CSS, JavaScript, Bootstrap, SQL, and deployment',
            'Built and deployed end-to-end web applications combining Python backend with responsive frontend',
          ]}
        />
        <TimelineItem
          period="2021 – 2022"
          title="12th Standard (66%)"
          org="Maharishi Higher Secondary School, Chengam"
          delay={3}
          points={['Completed Higher Secondary education with 66% aggregate']}
        />
        <TimelineItem
          period="2019 – 2020"
          title="10th Standard (79%)"
          org="Maharishi Higher Secondary School, Chengam"
          delay={4}
          points={['Completed Secondary education with 79% aggregate']}
        />
      </Section>

      {/* ── ACHIEVEMENTS ── */}
      <Section id="achievements" className="border-t border-white/5">
        <SectionHeading icon={Trophy} title="Achievements" />

        {/* Stat counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <StatCard target={5} label="Hackathons Won" suffix="+" />
          <StatCard target={10} label="Technical Papers" suffix="+" />
          <StatCard target={3} label="Projects Deployed" suffix="" />
          <StatCard target={100} label="Teams Competed Against" suffix="+" />
        </div>

        {/* Achievement list */}
        <div className="space-y-4">
          {[
            { icon: Trophy, text: 'Won 5 national-level hackathons competing against 100+ teams for innovative technical solutions' },
            { icon: Star, text: 'Presented 10 technical papers at national-level symposiums on Python, ML, IoT, and Web Technologies' },
            { icon: Award, text: 'Secured top positions in coding contests and technical quizzes at inter-college events' },
            { icon: Zap, text: 'Completed Python Full Stack certification from Besant Technology, one of India\'s leading IT training institutes' },
            { icon: Globe, text: 'Deployed 3 independent projects (EV Dashboard, Gesture Recognition, Portfolio) as a self-learner' },
            { icon: Github, text: 'Active GitHub contributor with clean commit history and structured documentation across repositories' },
          ].map(({ icon: Icon, text }, i) => (
            <div key={i} className={`reveal delay-${(i + 1) * 100} flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-300`}>
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <Icon size={14} className="text-cyan-400" />
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── LANGUAGES ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="reveal grid sm:grid-cols-2 gap-4">
          {[
            { lang: 'Tamil', level: 'Native', pct: 100 },
            { lang: 'English', level: 'Read, Write & Speak', pct: 80 },
          ].map(({ lang, level, pct }) => (
            <div key={lang} className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-white">{lang}</span>
                <span className="text-xs text-cyan-400 font-mono">{level}</span>
              </div>
              <SkillBar label="" pct={pct} />
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/10 py-10 text-center">
        <p className="font-mono text-sm text-gray-600">
          <span className="text-cyan-500">{'>'}</span>{' '}
          Made with <span className="text-red-400">♥</span> by{' '}
          <span className="text-white font-semibold">Sathish A</span>
          {' '}·{' '}
          <span className="text-gray-500">sathishgrillworks@gmail.com</span>
        </p>
        <p className="text-xs text-gray-700 mt-2 font-mono">
          # Python · Django · REST API · SQL · Full Stack · ML
        </p>
      </footer>
    </div>
  );
}
