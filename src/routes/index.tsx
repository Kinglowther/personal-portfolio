import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "David Njau — Full-Stack Developer & Trading Automation Engineer" },
      { name: "description", content: "Portfolio of David Njau — full-stack developer, IT expert, and trading bot engineer based in Nairobi, Kenya." },
      { property: "og:title", content: "David Njau — Developer Portfolio" },
      { property: "og:description", content: "Full-Stack Developer | IT Expert | Trading Automation Engineer." },
    ],
  }),
  component: Index,
});

const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

const ROLES = ["Full-Stack Developer", "IT Expert", "Trading Bot Engineer"];

const PROJECTS = [
  {
    name: "SummerJ Scalp Engine",
    stack: "MQL5 · MetaTrader 5",
    desc: "High-frequency scalping EA with adaptive risk control and session filters.",
    snippet: `void OnTick() {\n  if (!session.active()) return;\n  signal = engine.scan(M1);\n  if (signal.confidence > 0.82)\n    trade.open(signal);\n}`,
  },
  {
    name: "Summer J AI System",
    stack: "Python · OpenClaw · FastAPI",
    desc: "Multi-agent AI pipeline orchestrating market analysis and automation system.",
    snippet: `async def decide(ctx):\n  feats = await collect(ctx)\n  pred  = model.infer(feats)\n  return Action.from_logits(pred)`,
  },
  {
    name: "Abacus IT Systems",
    stack: "Node.js · React · Docker",
    desc: "Internal tooling and infrastructure for Abacus Property Consultants.",
    snippet: `app.get('/health', (_, res) =>\n  res.json({ ok: true,\n    uptime: process.uptime() }))`,
  },
  {
    name: "Client Web Solutions",
    stack: "WordPress · React · Three.js",
    desc: "Custom websites and 3D experiences shipped for clients across East Africa.",
    snippet: `const scene = new Scene();\nscene.add(mesh);\nrenderer.setAnimationLoop(() =>\n  renderer.render(scene, cam));`,
  },
];

const SKILLS = [
  { title: "Frontend", items: ["HTML", "CSS", "JavaScript", "React", "Three.js", "Tailwind"] },
  { title: "Backend", items: ["Node.js", "Python", "FastAPI", "REST", "PostgreSQL"] },
  { title: "Trading & AI", items: ["MQL5", "MetaTrader", "OpenClaw", "ML Pipelines", "Backtesting"] },
  { title: "Tools", items: ["Docker", "Git", "Linux", "WordPress", "CI/CD"] },
];

const STATS = [
  { value: 6, suffix: "+", label: "Years coding" },
  { value: 40, suffix: "+", label: "Projects shipped" },
  { value: 12, suffix: "+", label: "SYSTEMS DEPLOYED" },
  { value: 99, suffix: "%", label: "Uptime delivered" },
];

function Index() {
  const [active, setActive] = useState("hero");
  const [roleIdx, setRoleIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [openProject, setOpenProject] = useState<number | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const fragRef = useRef<HTMLDivElement>(null);

  // rAF-throttled scroll: write directly to DOM (no React re-renders).
  useEffect(() => {
    let ticking = false;
    const apply = () => {
      ticking = false;
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? y / h : 0;
      if (progressRef.current) progressRef.current.style.width = `${p * 100}%`;
      if (heroRef.current) {
        const scale = Math.max(0.85, 1 - y / 2400);
        heroRef.current.style.transform = `translate3d(0, ${y * 0.35}px, 0) scale(${scale})`;
        heroRef.current.style.opacity = String(Math.max(0, 1 - y / 700));
      }
      if (fragRef.current) {
        fragRef.current.style.setProperty("--sy", String(y));
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Loader
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);

  // Typing effect for roles
  useEffect(() => {
    const role = ROLES[roleIdx];
    let i = 0;
    let deleting = false;
    const tick = () => {
      if (!deleting) {
        i++;
        setTyped(role.slice(0, i));
        if (i === role.length) {
          setTimeout(() => { deleting = true; loop(); }, 1400);
          return;
        }
      } else {
        i--;
        setTyped(role.slice(0, i));
        if (i === 0) {
          setRoleIdx((r) => (r + 1) % ROLES.length);
          return;
        }
      }
      loop();
    };
    const loop = () => setTimeout(tick, deleting ? 40 : 80);
    const id = setTimeout(tick, 200);
    return () => clearTimeout(id);
  }, [roleIdx]);

  // Section observer
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setActive(e.target.id);
            e.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.35 },
    );
    document.querySelectorAll<HTMLElement>("[data-section]").forEach((el) => obs.observe(el));
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Particle network + code rain
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = window.innerWidth < 768;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const N = mobile ? 24 : 45;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3 * dpr,
      vy: (Math.random() - 0.5) * 0.3 * dpr,
    }));

    const chars = "01{}</>=>;".split("");
    const cols = Math.floor(window.innerWidth / (mobile ? 36 : 26));
    const drops = Array.from({ length: cols }, () => Math.random() * -200);
    const colStep = mobile ? 36 : 26;

    let paused = false;
    const onVis = () => { paused = document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    let frame = 0;

    const draw = () => {
      if (paused || reduce) { raf = requestAnimationFrame(draw); return; }
      frame++;
      ctx.fillStyle = "rgba(10,10,10,0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // code rain (every other frame on mobile)
      if (!mobile || frame % 2 === 0) {
        ctx.fillStyle = "rgba(0,255,90,0.35)";
        ctx.font = `${12 * dpr}px JetBrains Mono, monospace`;
        for (let i = 0; i < drops.length; i++) {
          const ch = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(ch, i * colStep * dpr, drops[i] * dpr);
          drops[i] = drops[i] > window.innerHeight && Math.random() > 0.975 ? 0 : drops[i] + 14;
        }
      }

      // network
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }
      const maxD = 140 * dpr;
      const maxD2 = maxD * maxD;
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxD2) {
            const d = Math.sqrt(d2);
            ctx.strokeStyle = `rgba(0,255,90,${(1 - d / maxD) * 0.25})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.fillStyle = "rgba(0,255,90,0.8)";
      for (const p of pts) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5 * dpr, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {loading && <Loader />}

      {/* Scroll progress */}
      <div
        ref={progressRef}
        className="pointer-events-none fixed left-0 top-0 z-50 h-[2px]"
        style={{
          width: `0%`,
          background: "linear-gradient(90deg, transparent, var(--neon))",
          boxShadow: "0 0 12px var(--neon)",
          transition: "width 0.12s linear",
        }}
      />

      {/* Background layers */}
      <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0 opacity-60" />
      <FloatingFragments innerRef={fragRef} />
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-10 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, var(--neon), transparent)",
          boxShadow: "0 0 12px var(--neon)",
          animation: "scanline 7s linear infinite",
        }}
      />

      {/* Sidebar nav */}
      <nav className="fixed left-0 top-0 z-40 hidden h-screen w-20 flex-col items-center justify-between border-r border-border/60 bg-background/40 py-8 backdrop-blur md:flex lg:w-28">
        <div className="neon-text font-display text-lg font-bold">DN<span className="text-foreground">/</span></div>
        <ul className="flex flex-col gap-6">
          {SECTIONS.map((s, i) => (
            <li key={s.id}>
              <button
                onClick={() => scrollTo(s.id)}
                className={`group flex flex-col items-center gap-1 font-mono text-xs transition ${
                  active === s.id ? "neon-text" : "text-foreground/50 hover:text-foreground"
                }`}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span
                  className="h-8 w-px transition-all"
                  style={{
                    background: active === s.id ? "var(--neon)" : "currentColor",
                    height: active === s.id ? "32px" : "12px",
                  }}
                />
                <span className="hidden lg:block [writing-mode:vertical-rl]">{s.label}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="font-mono text-[10px] text-foreground/40">NRB</div>
      </nav>

      {/* Mobile header */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between border-b border-border/60 bg-background/70 px-5 py-4 backdrop-blur md:hidden">
        <div className="neon-text font-display text-lg font-bold">DN<span className="text-foreground">/</span></div>
        <button
          aria-label="Menu"
          onClick={() => setMenuOpen((o) => !o)}
          className="neon-text font-mono text-sm"
        >
          {menuOpen ? "[ close ]" : "[ menu ]"}
        </button>
      </header>
      {menuOpen && (
        <div className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-6 bg-background/95 backdrop-blur md:hidden">
          {SECTIONS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className="font-display text-3xl font-bold"
            >
              <span className="neon-text font-mono text-sm">{String(i + 1).padStart(2, "0")}.</span>{" "}
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <main className="scene-3d relative z-20 md:pl-20 lg:pl-28">
        {/* HERO */}
        <section
          id="hero"
          data-section
          className="flex min-h-screen items-center px-6 pt-24 md:px-16 md:pt-0"
        >
          <div
            ref={heroRef}
            className="w-full max-w-5xl"
            style={{ willChange: "transform, opacity" }}
          >
            <p className="neon-text mb-6 font-mono text-sm tracking-widest">
              {"// initializing portfolio..."}
            </p>
            <h1 className="font-display text-6xl font-bold leading-[0.95] tracking-tight md:text-8xl lg:text-9xl">
              David
              <br />
              <span className="neon-text">Njau.</span>
            </h1>
            <div className="mt-8 font-mono text-xl md:text-2xl">
              <span className="text-foreground/50">{"const role = "}</span>
              <span className="neon-text">&quot;{typed}&quot;</span>
              <span
                className="ml-1 inline-block w-3"
                style={{ background: "var(--neon)", animation: "blink 1s steps(1) infinite" }}
              >
                &nbsp;
              </span>
            </div>
            <p className="mt-8 max-w-xl font-mono text-sm text-foreground/60 md:text-base">
              Building reliable software, infrastructure, and automation systems from Nairobi, Kenya.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => scrollTo("projects")}
                className="neon-glow group flex items-center gap-2 border border-[var(--neon)] bg-[color-mix(in_oklab,var(--neon)_10%,transparent)] px-6 py-3 font-mono text-sm transition hover:bg-[color-mix(in_oklab,var(--neon)_20%,transparent)]"
              >
                <span className="neon-text">&lt;</span>
                view projects
                <span className="neon-text">/&gt;</span>
              </button>
              <button
                onClick={() => scrollTo("contact")}
                className="group flex items-center gap-2 border border-border px-6 py-3 font-mono text-sm transition hover:border-[var(--neon)]"
              >
                <span className="text-foreground/50">&lt;</span>
                get in touch
                <span className="text-foreground/50">/&gt;</span>
              </button>
            </div>
            <div className="mt-20 flex items-center gap-4 font-mono text-xs text-foreground/40">
              <span className="h-px w-12 bg-foreground/30" />
              scroll to explore
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section
          id="about"
          data-section
          className="min-h-screen px-6 py-32 md:px-16"
        >
          <SectionHeader num="02" title="About" />
          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <div data-reveal className="rounded-md border border-border bg-[var(--code-bg)] p-6 font-mono text-sm leading-relaxed shadow-2xl">
              <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
                <span className="h-3 w-3 rounded-full bg-red-500/70" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <span className="h-3 w-3 rounded-full bg-green-500/70" />
                <span className="ml-3 text-foreground/50">developer.ts</span>
              </div>
              <pre className="whitespace-pre-wrap">
<span className="text-purple-400">interface</span> <span className="text-yellow-300">Developer</span> {"{"}{"\n"}
{"  "}<span className="text-sky-300">name</span>: <span className="neon-text">&quot;David Njau Githehu&quot;</span>;{"\n"}
{"  "}<span className="text-sky-300">role</span>: <span className="neon-text">&quot;Full-Stack DEV + Ai Expert&quot;</span>;{"\n"}
{"  "}<span className="text-sky-300">based</span>: <span className="neon-text">&quot;Nairobi, KE&quot;</span>;{"\n"}
{"  "}<span className="text-sky-300">company</span>: <span className="neon-text">&quot;Enterpreure&quot;</span>;{"\n"}
{"  "}<span className="text-sky-300">stack</span>: <span className="text-orange-300">string</span>[];{"\n"}
{"  "}<span className="text-sky-300">availableForWork</span>: <span className="text-orange-300">true</span>;{"\n"}
{"}"}{"\n"}
              </pre>
            </div>
            <div data-reveal className="flex flex-col justify-center">
              <p className="font-display text-2xl leading-snug md:text-3xl">
                I design and ship <span className="neon-text">end-to-end systems</span> — from web
                apps to autonomous trading engines.
              </p>
              <p className="mt-6 font-mono text-sm leading-relaxed text-foreground/70">
                Currently engineering internal tooling and infrastructure at Abacus Property
                Consultants, while building algorithmic systems and AI agents on the side.
                I care about reliability, clean abstractions, and shipping things that actually run
                in production.
              </p>
              <div className="mt-10 grid grid-cols-2 gap-6">
                {STATS.map((s) => (
                  <Stat key={s.label} {...s} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" data-section className="min-h-screen px-6 py-32 md:px-16">
          <SectionHeader num="03" title="Selected Projects" />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {PROJECTS.map((p, i) => (
              <ProjectCard key={p.name} idx={i} {...p} onOpen={() => setOpenProject(i)} />
            ))}
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" data-section className="min-h-screen px-6 py-32 md:px-16">
          <SectionHeader num="04" title="Stack & Skills" />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {SKILLS.map((cat) => (
              <div
                key={cat.title}
                data-reveal
                className="group rounded-md border border-border bg-background/40 p-8 backdrop-blur transition hover:border-[var(--neon)]"
              >
                <div className="mb-6 flex items-center gap-3 font-mono text-sm text-foreground/50">
                  <span className="neon-text">{"//"}</span>
                  <span>{cat.title.toLowerCase()}.module</span>
                </div>
                <h3 className="mb-6 font-display text-3xl font-bold">{cat.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((s) => (
                    <span
                      key={s}
                      className="border border-border bg-background/60 px-3 py-1 font-mono text-xs text-foreground/80 transition group-hover:border-[var(--neon-dim)]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" data-section className="min-h-screen px-6 py-32 md:px-16">
          <SectionHeader num="05" title="Contact" />
          <div data-reveal className="mt-12 max-w-3xl">
            <h2 className="font-display text-4xl font-bold leading-tight md:text-6xl">
              Let&apos;s build something
              <br />
              <span className="neon-text">that actually ships.</span>
            </h2>
            <p className="mt-6 font-mono text-sm text-foreground/60">
              {"return "}<span className="neon-text">connect</span>(<span className="neon-text">&quot;david&quot;</span>);
            </p>
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            <ContactCard label="Email" value="pdnjau710@gmail.com" href="mailto:pdnjau710@gmail.com" />
            <ContactCard label="GitHub" value="@Kinglowther" href="https://github.com/Kinglowther" />
            <ContactCard label="LinkedIn" value="David Njau Githehu" href="https://www.linkedin.com/in/david-njau-githehu-9048831b9/" />
            <ContactCard label="WHATSAPP" value="Whatsapp Me</>" href="https://wa.me/254743049871" />
          </div>
          <footer className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8 font-mono text-xs text-foreground/40">
            <span>{"// © " + new Date().getFullYear() + " david njau. all systems operational."}</span>
            <span className="neon-text">[ NRB · KE ]</span>
          </footer>
        </section>
      </main>
      {openProject !== null && (
        <ProjectModal project={PROJECTS[openProject]} idx={openProject} onClose={() => setOpenProject(null)} />
      )}
    </div>
  );
}

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div data-reveal className="flex items-end gap-4">
      <span className="neon-text font-mono text-sm">{num}.</span>
      <h2 className="font-display text-4xl font-bold md:text-5xl">{title}</h2>
      <span className="mb-2 h-px flex-1 bg-border" />
    </div>
  );
}

function Stat({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const dur = 1400;
        const start = performance.now();
        const step = (t: number) => {
          const p = Math.min(1, (t - start) / dur);
          setN(Math.floor(p * value));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.disconnect();
      }
    });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);
  return (
    <div ref={ref}>
      <div className="neon-text font-display text-4xl font-bold md:text-5xl">
        {n}
        {suffix}
      </div>
      <div className="mt-1 font-mono text-xs uppercase tracking-widest text-foreground/50">
        {label}
      </div>
    </div>
  );
}

function ProjectCard({
  name,
  stack,
  desc,
  snippet,
  idx,
  onOpen,
}: {
  name: string;
  stack: string;
  desc: string;
  snippet: string;
  idx: number;
  onOpen: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const rafRef = useRef(0);
  const onEnter = () => {
    if (ref.current) rectRef.current = ref.current.getBoundingClientRect();
  };
  const onMove = (e: ReactMouseEvent) => {
    const el = ref.current;
    const r = rectRef.current;
    if (!el || !r) return;
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      el.style.setProperty("--ry", `${x * 18}deg`);
      el.style.setProperty("--rx", `${-y * 18}deg`);
      el.style.setProperty("--mx", `${(x + 0.5) * 100}%`);
      el.style.setProperty("--my", `${(y + 0.5) * 100}%`);
    });
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
  };
  return (
    <div
      ref={ref}
      onMouseEnter={onEnter}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onOpen}
      data-reveal
      className="tilt-card group relative cursor-pointer overflow-hidden rounded-md border border-border bg-background/40 backdrop-blur hover:border-[var(--neon)]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(400px circle at var(--mx,50%) var(--my,50%), color-mix(in oklab, var(--neon) 22%, transparent), transparent 60%)",
        }}
      />
      <div className="border-b border-border bg-[var(--code-bg)] p-5">
        <div className="mb-3 flex items-center justify-between font-mono text-[10px] text-foreground/50">
          <span>{`project_${String(idx + 1).padStart(2, "0")}.ts`}</span>
          <span className="neon-text">●</span>
        </div>
        <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-foreground/80">
          {snippet}
        </pre>
      </div>
      <div className="p-6">
        <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-foreground/50">
          {stack}
        </div>
        <h3 className="font-display text-2xl font-bold">{name}</h3>
        <p className="mt-2 font-mono text-sm text-foreground/60">{desc}</p>
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-6 opacity-0 transition group-hover:opacity-100">
        <span className="neon-text font-mono text-sm">view project →</span>
      </div>
    </div>
  );
}

function ContactCard({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <a
      data-reveal
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center justify-between border border-border bg-background/40 p-6 backdrop-blur transition hover:border-[var(--neon)]"
    >
      <div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-foreground/50">
          {label}
        </div>
        <div className="mt-1 font-display text-xl font-semibold group-hover:[color:var(--neon)]">
          {value}
        </div>
      </div>
      <span className="neon-text font-mono text-lg transition group-hover:translate-x-1">→</span>
    </a>
  );
}

function FloatingFragments({ innerRef }: { innerRef?: React.RefObject<HTMLDivElement | null> }) {
  const frags = ["{ }", "</>", "=>", "01", "fn()", "[ ]", "&&", "//", "::"];
  const items = Array.from({ length: 14 }, (_, i) => ({
    ch: frags[i % frags.length],
    left: (i * 73) % 100,
    delay: (i * 1.7) % 12,
    dur: 14 + ((i * 3) % 10),
    size: 14 + ((i * 7) % 18),
    factor: 0.1 + ((i % 5) * 0.06),
    drift: ((i % 4) - 1.5) * 20,
  }));
  return (
    <div ref={innerRef} className="pointer-events-none fixed inset-0 z-0 overflow-hidden" style={{ ["--sy" as never]: "0" }}>
      {items.map((f, i) => (
        <span
          key={i}
          className="neon-text absolute font-mono"
          style={{
            left: `${f.left}%`,
            bottom: "-10vh",
            fontSize: f.size,
            opacity: 0.25,
            animation: `float-frag ${f.dur}s linear ${f.delay}s infinite`,
            transform: `translate3d(calc(var(--sy) * ${f.drift * 0.001}px), calc(var(--sy) * ${f.factor}px), 0)`,
            willChange: "transform",
          }}
        >
          {f.ch}
        </span>
      ))}
    </div>
  );
}

function ProjectModal({
  project,
  idx,
  onClose,
}: {
  project: { name: string; stack: string; desc: string; snippet: string };
  idx: number;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-background/80 p-4 backdrop-blur-md"
      onClick={onClose}
      style={{ animation: "fade-in 0.2s ease-out" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="neon-glow relative w-full max-w-2xl overflow-hidden rounded-md border border-[var(--neon)] bg-background"
        style={{ animation: "scale-in 0.25s ease-out" }}
      >
        <div className="flex items-center justify-between border-b border-border bg-[var(--code-bg)] px-5 py-3">
          <div className="flex items-center gap-2 font-mono text-xs text-foreground/60">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-green-500/70" />
            <span className="ml-3">{`project_${String(idx + 1).padStart(2, "0")}.ts`}</span>
          </div>
          <button onClick={onClose} className="neon-text font-mono text-sm hover:opacity-70">
            [ esc ]
          </button>
        </div>
        <div className="p-6">
          <div className="font-mono text-[11px] uppercase tracking-widest text-foreground/50">
            {project.stack}
          </div>
          <h3 className="mt-2 font-display text-3xl font-bold">{project.name}</h3>
          <p className="mt-3 font-mono text-sm text-foreground/70">{project.desc}</p>
          <pre className="mt-6 overflow-x-auto rounded-md border border-border bg-[var(--code-bg)] p-4 font-mono text-xs leading-relaxed text-foreground/90">
{project.snippet}
          </pre>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 font-mono text-xs">
            <div className="rounded-md border border-border p-3">
              <div className="text-foreground/40">status</div>
              <div className="neon-text mt-1">deployed · operational</div>
            </div>
            <div className="rounded-md border border-border p-3">
              <div className="text-foreground/40">role</div>
              <div className="neon-text mt-1">design · engineering · ops</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Loader() {
  const text = `const dev = {\n  name: "David Njau",\n  ready: true,\n};`;
  const [n, setN] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setN((v) => Math.min(text.length, v + 2)), 25);
    return () => clearInterval(id);
  }, [text.length]);
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
      <pre className="neon-text font-mono text-sm md:text-base">
        {text.slice(0, n)}
        <span style={{ animation: "blink 1s steps(1) infinite" }}>▌</span>
      </pre>
    </div>
  );
}
