import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Load ChatWidget only on the client to avoid SSR issues with jsx-in-js styles
const ChatWidget = dynamic(() => import('../components/ChatWidget'), { ssr: false });

export default function Home() {
  const [isDark, setIsDark] = useState(true);

  // Auto-detect time-of-day on first load (7pm–7am = dark)
  useEffect(() => {
    const h = new Date().getHours();
    setIsDark(h >= 19 || h <= 7);
  }, []);

  // Apply light/dark class to <html> so body background & all vars cascade correctly
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  return (
    <>
      <Head>
        <title>Kylla Gelaga | Data Analyst & Automation Specialist</title>
        <meta
          name="description"
          content="Data Analyst and Automation Specialist with expertise in Python, SQL, n8n, and AI-powered workflows."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Fira+Code:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div>
        {/* ── Navbar ─────────────────────────────── */}
        <nav className="navbar">
          <div className="navbar__links">
            <a href="#hero" className="navbar__link">Profile</a>
            <a href="#tools" className="navbar__link">Tools</a>
            <a href="#projects" className="navbar__link">Projects</a>
          </div>
          <button
            className="theme-toggle"
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3v1m0 16v1m8.66-9h-1M4.34 12h-1m15.07-6.07-.71.71M6.34 17.66l-.71.71m12.02 0-.71-.71M6.34 6.34l-.71-.71M12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z" />
                </svg>
                Light
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79z" />
                </svg>
                Dark
              </>
            )}
          </button>
        </nav>

        <main>
          {/* ── Left Social Bar ────────────────────── */}
          <div className="social-bar">
            <a
              href="https://www.linkedin.com/in/kylla-gelaga/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              {/* LinkedIn */}
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452H16.89v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a1.982 1.982 0 0 1-1.981-1.981 1.981 1.981 0 1 1 1.981 1.981zm1.707 13.019H3.63V9h3.414v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            <a
              href="https://github.com/KyllaGelaga"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              {/* GitHub */}
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
              </svg>
            </a>
            <a
              href="mailto:kyllamarizgelaga@gmail.com"
              aria-label="Email"
            >
              {/* Email */}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </a>
            <div className="social-bar__line" />
          </div>

          {/* ── Hero ───────────────────────────────── */}
          <section className="hero" id="hero">
            <div className="container hero__inner">
              <div className="hero__text">
                <p className="hero__overline">Hi there! I&apos;m</p>

                <h1 className="hero__name">Kylla Mariz.</h1>

                <h2 className="hero__tagline">
                  I like to analyze data and automate the rest.
                </h2>

                <p className="hero__description">
                  I&apos;m a Data Analyst and Automation Specialist who turns
                  messy data into clear decisions. With Python, SQL, and BI
                  tools, I build intelligent workflows and AI-powered automation
                  that actually get used — from detecting ₱54M in insurance
                  fraud to streamlining real estate pipelines for U.S. clients.
                </p>

                <a
                  href="https://mail.google.com/mail/?view=cm&to=kyllamarizgelaga@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero__cta"
                >
                  Get in touch
                </a>
              </div>

              <div className="hero__photo-wrap">
                <Image
                  src="/profile.jpg"
                  alt="Kylla Mariz"
                  width={320}
                  height={320}
                  className="hero__photo"
                  priority
                />
              </div>
            </div>
          </section>

          {/* ── Tools ─────────────────────────────── */}
          <section className="section" id="tools">
            <div className="container">
              <div className="section__header">
                <h2 className="section__title">
                  <span className="section__number">02.</span>
                  Tools
                </h2>
                <div className="section__line" />
              </div>

              <p className="section__intro">
                A snapshot of the tools and technologies I work with to analyze data, build workflows, and ship AI-powered solutions.
              </p>

              <div className="tools-grid">
                {[
                  { cat: 'Data & Analytics', items: ['Python', 'SQL', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn'] },
                  { cat: 'BI & Reporting', items: ['Power BI', 'Tableau', 'Google Looker Studio', 'Excel / Google Sheets'] },
                  { cat: 'Automation & AI', items: ['n8n', 'Make (Integromat)', 'OpenAI API', 'LangChain', 'Zapier'] },
                  { cat: 'Infrastructure', items: ['PostgreSQL', 'MySQL', 'Git & GitHub', 'Docker (basics)', 'Vercel'] },
                ].map(({ cat, items }) => (
                  <div key={cat} className="tools-card">
                    <h3 className="tools-card__cat">{cat}</h3>
                    <ul className="tools-card__list">
                      {items.map(item => (
                        <li key={item} className="tools-card__item">
                          <span className="tools-card__bullet">▹</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Projects ───────────────────────────── */}
          <section className="section" id="projects">
            <div className="container">
              <div className="section__header">
                <h2 className="section__title">
                  <span className="section__number">03.</span>
                  Projects
                </h2>
                <div className="section__line" />
              </div>

              <div className="projects-grid">
                {[
                  {
                    title: 'Insurance Fraud Detection',
                    desc: 'Built a Python-based anomaly detection pipeline that surfaced ₱54M in fraudulent insurance claims. Combined statistical profiling with rule-based flagging across 200k+ records.',
                    tags: ['Python', 'Pandas', 'SQL', 'Anomaly Detection'],
                    links: { youtube: '#', presentation: '#', overview: '#' },
                  },
                  {
                    title: 'Real Estate Automation Pipeline',
                    desc: 'Designed an end-to-end n8n workflow for a U.S. real estate client — automating lead capture, CRM updates, follow-up emails, and weekly reporting with zero manual input.',
                    tags: ['n8n', 'Make', 'CRM', 'Automation'],
                    links: { youtube: '#', presentation: '#', overview: '#' },
                  },
                  {
                    title: 'AI Portfolio Chatbot',
                    desc: 'This very site! Built with Next.js 14 and Groq (LLaMA 3), the chatbot answers questions about my background, projects, and skills using a system prompt grounded in my resume.',
                    tags: ['Next.js', 'Groq', 'LLaMA 3', 'TypeScript'],
                    links: { youtube: '#', presentation: '#', overview: '#' },
                  },
                  {
                    title: 'BI Dashboard Suite',
                    desc: 'Created a suite of Power BI dashboards for operations teams — covering KPI tracking, headcount trends, and SLA compliance, replacing 12 manual weekly reports.',
                    tags: ['Power BI', 'DAX', 'SQL', 'Excel'],
                    links: { youtube: '#', presentation: '#', overview: '#' },
                  },
                ].map(({ title, desc, tags, links }) => (
                  <div key={title} className="project-card">
                    <div className="project-card__top">
                      <svg className="project-card__folder" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                      </svg>
                    </div>
                    <h3 className="project-card__title">{title}</h3>
                    <p className="project-card__desc">{desc}</p>
                    <ul className="project-card__tags">
                      {tags.map(t => <li key={t}>{t}</li>)}
                    </ul>

                    {/* Hover overlay */}
                    <div className="project-card__overlay">
                      <a href={links.youtube} target="_blank" rel="noopener noreferrer" className="project-card__action">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z"/>
                        </svg>
                        YouTube
                      </a>
                      <a href={links.presentation} target="_blank" rel="noopener noreferrer" className="project-card__action">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="3" width="20" height="14" rx="2"/>
                          <path d="M8 21h8M12 17v4"/>
                        </svg>
                        Presentation
                      </a>
                      <a href={links.overview} target="_blank" rel="noopener noreferrer" className="project-card__action">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        Overview
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Floating Chat Widget ───────────────── */}
          <ChatWidget />
        </main>

        {/* ── Footer ─────────────────────────────── */}
        <footer className="footer">
          <p>Customized by Kylla Mariz Gelaga · {new Date().getFullYear()}</p>
          <p className="footer__tribute">
            Design inspired by{' '}
            <a
              href="https://github.com/bchiang7"
              target="_blank"
              rel="noopener noreferrer"
            >
              Brittany Chiang
            </a>
          </p>
        </footer>
      </div>

    </>
  );
}
