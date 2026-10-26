import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Award, Box, BrainCircuit, Braces, ChevronLeft, Code2, Database, Download,
  Eye, FileCode2, Github, Globe, GraduationCap, Home, Layers, Linkedin,
  Mail, MapPin, Moon, Radio, Server, Sparkles, Sun, Terminal, User, Wrench,
} from 'lucide-react';
import './styles.css';

const projects = [
  {
    id: 'visioneye',
    category: 'AI · Accessibility',
    type: 'Wearable System',
    icon: BrainCircuit,
    title: 'VisionEye',
    description: 'A wearable navigation and obstacle-avoidance system for people with visual impairments, combining computer vision, GPS, and real-time voice guidance.',
    about: 'VisionEye is built to help people with visual impairments move through the world with more confidence. It fuses on-device object detection, GPS context, and spoken guidance so obstacles and path changes can be understood in real time.',
    achievement: 'Designed an end-to-end prototype spanning computer vision, embedded hardware, and accessible voice feedback.',
    stack: ['YOLOv8', 'Raspberry Pi', 'GPS', 'Python'],
    link: 'https://github.com/akshan2004/VisionEye.git',
    accent: '#f0b429',
  },
  {
    id: 'moneymanager',
    category: 'Full stack · Fintech',
    type: 'Web Application',
    icon: Code2,
    title: 'Money Manager',
    description: 'A personal finance tracker with secure sign-in, visual spending dashboards, and a responsive interface for staying on top of everyday finances.',
    about: 'Money Manager helps people see where their money goes. It combines secure authentication, spending dashboards, and a clean mobile-first interface so everyday finances stay easy to review.',
    achievement: 'Built a full-stack tracker with auth, persistent records, and visual reports for daily budgeting.',
    stack: ['Flask', 'SQLite', 'Chart.js', 'Bootstrap'],
    link: 'https://github.com/akshan2004/Money-Management.git',
    accent: '#7dd3fc',
  },
  {
    id: 'jnanagpt',
    category: 'Generative AI · Web app',
    type: 'Web Application',
    icon: Sparkles,
    title: 'JnanaGPT',
    description: 'An AI-powered chat experience for text and image generation, with a community layer for sharing creative work.',
    about: 'JnanaGPT is a generative AI workspace for conversation and image creation. It focuses on a fast chat flow, useful generation tools, and a community layer for sharing what people make.',
    achievement: 'Shipped a React + Node experience connected to Gemini APIs for both text and image generation.',
    stack: ['React', 'Node.js', 'MongoDB', 'Gemini API'],
    link: 'https://github.com/akshan2004/JnanaGPT.git',
    accent: '#c4b5fd',
  },
  {
    id: 'chatapp',
    category: 'Full stack · Real time',
    type: 'Web Application',
    icon: Radio,
    title: 'Realtime Chat',
    description: 'A real-time messaging app with typing indicators, delivery status, and familiar read receipts, powered by Socket.IO.',
    about: 'A familiar messaging product with live delivery, typing indicators, and read receipts. The focus was reliable realtime communication and a UI that feels immediate without getting in the way.',
    achievement: 'Implemented Socket.IO rooms, presence states, and message delivery status across a React client.',
    stack: ['React', 'Node.js', 'Socket.IO', 'MongoDB'],
    link: 'https://github.com/akshan2004/Chat-App.git',
    accent: '#86efac',
  },
];

const tools = [
  { name: 'Python', icon: FileCode2 },
  { name: 'Java', icon: Braces },
  { name: 'JavaScript', icon: Code2 },
  { name: 'React', icon: Layers },
  { name: 'Node.js', icon: Server },
  { name: 'FastAPI', icon: Terminal },
  { name: 'Flask', icon: Globe },
  { name: 'Django', icon: Box },
  { name: 'MySQL', icon: Database },
  { name: 'MongoDB', icon: Database },
  { name: 'YOLOv8', icon: Eye },
  { name: 'Git', icon: Github },
];

const languages = [
  { name: 'Python', level: 90 },
  { name: 'JavaScript', level: 85 },
  { name: 'Java', level: 75 },
  { name: 'SQL', level: 80 },
];

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'summary', label: 'Summary', icon: User },
  { id: 'experience', label: 'Experience', icon: FileCode2 },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'links', label: 'Links', icon: Globe },
];

function getInitialTheme() {
  try {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {
    /* ignore */
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function Starfield({ theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let raf = 0;
    let stars = [];
    let falling = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((window.innerWidth * window.innerHeight) / 5200);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 1.8 + 0.35,
        tw: Math.random() * Math.PI * 2,
        sp: 0.01 + Math.random() * 0.025,
      }));
    };

    const spawnFalling = () => {
      falling.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        len: 70 + Math.random() * 110,
        speed: 4.2 + Math.random() * 5.5,
        angle: Math.random() * Math.PI * 2,
        life: 1,
      });
    };

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      const starColor = theme === 'light' ? '255, 186, 90' : '255, 236, 210';
      stars.forEach((star) => {
        const a = 0.25 + Math.abs(Math.sin(star.tw)) * 0.75;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${starColor}, ${a})`;
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
        star.tw += star.sp;
      });

      falling.forEach((s) => {
        const dx = Math.cos(s.angle) * s.len;
        const dy = Math.sin(s.angle) * s.len;
        const grad = ctx.createLinearGradient(s.x, s.y, s.x + dx, s.y + dy);
        const head = theme === 'light' ? 'rgba(180, 90, 20, 0)' : 'rgba(255, 244, 220, 0)';
        const tail = theme === 'light' ? `rgba(232, 140, 40, ${0.85 * s.life})` : `rgba(255, 248, 230, ${0.95 * s.life})`;
        grad.addColorStop(0, head);
        grad.addColorStop(1, tail);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + dx, s.y + dy);
        ctx.stroke();
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.life -= 0.008;
      });
      falling = falling.filter((s) => s.life > 0 && s.y < h + 80);

      frame += 1;
      if (!reduceMotion && frame % 18 === 0) {
        spawnFalling();
        if (Math.random() < 0.35) spawnFalling();
      }
      if (!reduceMotion) raf = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      resize();
      if (reduceMotion) draw();
    };

    resize();
    if (!reduceMotion) {
      spawnFalling();
      spawnFalling();
      spawnFalling();
    }
    draw();
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}

function DownloadCV() {
  return (
    <a className="cv-btn" href="/Akshan_B_Resume.pdf" download>
      <Download size={14} />
      Download CV
    </a>
  );
}

function PillNav({ view, onChange }) {
  return (
    <nav className="pill-nav" aria-label="Portfolio sections">
      {navItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={view === id ? 'is-active' : ''}
          onClick={() => onChange(id)}
          type="button"
          aria-current={view === id ? 'true' : undefined}
        >
          <Icon size={16} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

function HomeView() {
  return (
    <section className="page-section home-view" id="home">
      <div className="home-copy">
        <p className="role-kicker">Software Engineer</p>
        <h1>Akshan B.</h1>
        <p className="home-lede">Computer Science graduate building useful products for the web, and beyond.</p>
        <ul className="contact-meta">
          <li>
            <Mail size={14} />
            <a href="mailto:akshankual398@gmail.com">akshankual398@gmail.com</a>
          </li>
          <li>
            <Linkedin size={14} />
            <a href="https://www.linkedin.com/in/akshan-b-96683a291/" target="_blank" rel="noreferrer">linkedin.com/in/akshan-b</a>
          </li>
          <li>
            <Github size={14} />
            <a href="https://github.com/akshan2004" target="_blank" rel="noreferrer">github.com/akshan2004</a>
          </li>
          <li>
            <MapPin size={14} />
            <span>Bengaluru, India</span>
          </li>
        </ul>
      </div>
      <div className="portrait-wrap">
        <img src="/profile.jpg" alt="Portrait of Akshan B." />
      </div>
    </section>
  );
}

function SummaryView() {
  return (
    <section className="page-section panel-view" id="summary">
      <p className="view-kicker">About</p>
      <h2>Curiosity first.<br />Impact always.</h2>
      <div className="summary-grid">
        <div className="summary-copy">
          <p>I’m a Computer Science Engineering graduate from Sir M Visvesvaraya Institute of Technology, Bengaluru. I enjoy working across the stack—from building intuitive interfaces to shaping the systems behind them.</p>
          <p>My interests include AI, accessible technology, and practical products that solve everyday problems. I bring care, curiosity, and a steady problem-solving mindset to every project.</p>
        </div>
        <div className="fact-grid">
          <div><strong>8.6</strong><span>Cumulative GPA</span></div>
          <div><strong>04</strong><span>Selected projects</span></div>
          <div><strong>B.E.</strong><span>Computer Science</span></div>
          <div><strong>’26</strong><span>Graduating class</span></div>
        </div>
      </div>
    </section>
  );
}

function ExperienceView({ onOpen }) {
  return (
    <section className="page-section panel-view" id="experience">
      <p className="view-kicker">Selected work</p>
      <h2>A few things I’ve built.</h2>
      <div className="project-list">
        {projects.map((project) => {
          const Icon = project.icon;
          return (
            <button key={project.id} className="project-row" type="button" onClick={() => onOpen(project.id)}>
              <span className="project-icon"><Icon size={16} /></span>
              <span className="project-copy">
                <span className="project-cat">{project.category}</span>
                <strong>{project.title}</strong>
                <em>{project.description}</em>
              </span>
              <span className="project-open">View</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ProjectDetail({ project, onBack }) {
  const Icon = project.icon;
  return (
    <div className="project-detail" id="project-detail">
      <button className="back-link" type="button" onClick={onBack}>
        <ChevronLeft size={16} /> Back to Experience
      </button>
      <div className="project-hero" style={{ '--accent': project.accent }}>
        <div className="project-stage">
          <div className="device-card">
            <Icon size={28} />
            <span>{project.title}</span>
          </div>
          <div className="device-phone">
            <span>{project.type}</span>
            <strong>{project.title}</strong>
          </div>
        </div>
      </div>
      <p className="view-kicker">{project.type}</p>
      <h2>{project.title}</h2>
      <div className="detail-block">
        <h3>About The Project</h3>
        <p>{project.about}</p>
      </div>
      <div className="detail-block">
        <h3>Achievements</h3>
        <p>{project.achievement}</p>
      </div>
      <div className="detail-tags">
        {project.stack.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      <a className="detail-link" href={project.link} target="_blank" rel="noreferrer">
        View on GitHub
      </a>
    </div>
  );
}

function SkillsView() {
  return (
    <section className="page-section panel-view skills-view" id="skills">
      <p className="view-kicker">Toolkit</p>
      <h2>Skills & education.</h2>
      <div className="tool-grid">
        {tools.map(({ name, icon: Icon }) => (
          <div className="tool-item" key={name}>
            <span><Icon size={20} /></span>
            {name}
          </div>
        ))}
      </div>
      <div className="skill-block">
        <h3>Languages</h3>
        {languages.map(({ name, level }) => (
          <div className="lang-row" key={name}>
            <span>{name}</span>
            <div className="lang-bar"><i style={{ width: `${level}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="skill-block">
        <h3>Education & Certificates</h3>
        <ul className="edu-list">
          <li>
            <GraduationCap size={15} />
            <div>
              <strong>Sir M Visvesvaraya Institute of Technology</strong>
              <p>Bachelor of Engineering in Computer Science — 2022 to 2026 · CGPA 8.6</p>
            </div>
          </li>
          <li>
            <Award size={15} />
            <div>
              <strong>AI Violence Detection Hackathon</strong>
              <p>Built a real-time AI violence detection system in an 8-hour hackathon</p>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}

function LinksView() {
  const links = [
    { href: 'mailto:akshankual398@gmail.com', label: 'Email', value: 'akshankual398@gmail.com', icon: Mail },
    { href: 'https://github.com/akshan2004', label: 'GitHub', value: 'github.com/akshan2004', icon: Github },
    { href: 'https://www.linkedin.com/in/akshan-b-96683a291/', label: 'LinkedIn', value: 'linkedin.com/in/akshan-b', icon: Linkedin },
    { href: '/Akshan_B_Resume.pdf', label: 'Résumé', value: 'Download PDF', icon: Download, download: true },
  ];
  return (
    <section className="page-section panel-view" id="links">
      <p className="view-kicker">Let’s connect</p>
      <h2>Open to new work.</h2>
      <p className="links-copy">I’m interested in software engineering roles, thoughtful collaborations, and interesting problems in web and AI.</p>
      <div className="link-list">
        {links.map(({ href, label, value, icon: Icon, download }) => (
          <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" download={download || undefined}>
            <span className="link-icon"><Icon size={16} /></span>
            <span>
              <small>{label}</small>
              <strong>{value}</strong>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [view, setView] = useState('home');
  const [projectId, setProjectId] = useState(null);
  const project = projects.find((item) => item.id === projectId);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('portfolio-theme', theme);
    } catch {
      /* Theme still works for this session when storage is unavailable. */
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f4ece0' : '#0b0908');
  }, [theme]);

  useEffect(() => {
    const ids = navItems.map((item) => item.id);
    const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setView(visible.target.id);
    }, { rootMargin: '-25% 0px -55% 0px', threshold: [0.15, 0.4, 0.7] });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [projectId]);

  const jumpTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 84;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  };

  const scrollTo = (id) => {
    const returning = Boolean(projectId);
    setProjectId(null);
    setView(id);
    window.setTimeout(() => jumpTo(id), returning ? 80 : 40);
  };

  const openProject = (id) => {
    setProjectId(id);
    setView('experience');
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 40);
  };

  return (
    <div className="app-shell">
      <Starfield theme={theme} />
      <div className="atmosphere" />
      <div className="atmosphere-glow" />
      <div className="glass-card">
        <div className="card-top">
          <span className="status-pill"><i /> Open to work</span>
          <div className="top-actions">
            <button
              className="theme-btn"
              type="button"
              onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <DownloadCV />
          </div>
        </div>

        <div className="card-body">
          {project ? (
            <ProjectDetail project={project} onBack={() => setProjectId(null)} />
          ) : (
            <>
              <HomeView />
              <SummaryView />
              <ExperienceView onOpen={openProject} />
              <SkillsView />
              <LinksView />
            </>
          )}
        </div>

        <PillNav view={project ? 'experience' : view} onChange={scrollTo} />
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
