import { useMemo, useState } from "react"
import "./Home.css"

export default function Home({
  onStart,
  completedTermsCount = 0,
  totalTermsCount = 8,
}) {
  const [mode, setMode] = useState("core") // "core" | "specialization"

  const progressPct = useMemo(() => {
    if (!totalTermsCount) return 0
    const pct = Math.round((completedTermsCount / totalTermsCount) * 100)
    return Math.max(0, Math.min(100, pct))
  }, [completedTermsCount, totalTermsCount])

  // These can be real later — for demo they can be simple
  const termsDone = completedTermsCount
  const termsLeft = Math.max(0, totalTermsCount - completedTermsCount)

  return (
    <div className="homePage">
      {/* HERO */}
      <section className="hero">
        <h1 className="heroTitle">Your Academic Journey</h1>
        <p className="heroSubtitle">Navigate your degree with efficiency</p>
      </section>

      {/* MAIN CARD */}
      <section className="panelWrap">
        <div className="panel">
          {/* Toggle Buttons */}
          <div className="toggleRow">
            <button
              className={`toggleBtn ${mode === "core" ? "active" : ""}`}
              onClick={() => setMode("core")}
            >
              Core Program
            </button>

            <button
              className={`toggleBtn ${mode === "specialization" ? "active" : ""}`}
              onClick={() => setMode("specialization")}
            >
              With Specialization
            </button>
          </div>

          {/* Stats */}
          <div className="statsRow">
            <div className="statCard statCard--completed">
              <div className="statTop">
                <span className="statLabel">COMPLETED</span>
                <span className="statDot statDot--green" />
              </div>

              <div className="statNumber">{termsDone}</div>
              <div className="statDesc">Terms finished</div>
            </div>

            <div className="statCard statCard--remaining">
              <div className="statTop">
                <span className="statLabel">REMAINING</span>
                <span className="statDot statDot--blue" />
              </div>

              <div className="statNumber">{termsLeft}</div>
              <div className="statDesc">Terms to go</div>
            </div>
          </div>

          {/* CTA */}
          <div className="ctaRow">
            <button className="ctaBtn" onClick={onStart}>
              Start your path →
            </button>
            <div className="ctaHint">
              Mode: <strong>{mode === "core" ? "Core Program" : "With Specialization"}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRESS SECTION */}
      <section className="progressWrap">
        <div className="progressBar">
          <div className="progressFill" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="progressText">Overall progress: {progressPct}%</div>

        <div className="footerLine">Your path to graduation starts here.</div>
      </section>
    </div>
  )
}
