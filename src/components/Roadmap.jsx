import { useEffect, useRef, useState } from "react"
import "./Roadmap.css"

export default function Roadmap({ stops, completedTerms, onToggleTerm, allDone }) {
  const stopRefs = useRef([])
  const [tourIndex, setTourIndex] = useState(null)
  const [tourRunning, setTourRunning] = useState(false)

  function startJourney() {
    setTourRunning(true)
    setTourIndex(0)
  }

  function stopJourney() {
    setTourRunning(false)
    setTourIndex(null)
  }

  // Scroll + advance stop-by-stop
  useEffect(() => {
    if (!tourRunning) return
    if (tourIndex === null) return

    const el = stopRefs.current[tourIndex]
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" })
    }

    // End when we hit last stop
    if (tourIndex >= stops.length - 1) {
      const t = setTimeout(() => stopJourney(), 1200)
      return () => clearTimeout(t)
    }

    const timer = setTimeout(() => {
      setTourIndex((i) => i + 1)
    }, 1200)

    return () => clearTimeout(timer)
  }, [tourRunning, tourIndex, stops.length])

  return (
    <div className="roadmap">
      <div className="roadControls">
        {!tourRunning ? (
          <button className="startBtn" onClick={startJourney}>
            Start Journey 🚗
          </button>
        ) : (
          <button className="startBtn" onClick={stopJourney}>
            Stop
          </button>
        )}
      </div>

      {/* Car sits on the road while the tour runs */}
      {tourRunning && <div className="car">🚘</div>}

      {/* ROAD */}
      <div className="road">
        <div className="roadEdge left"></div>
        <div className="roadEdge right"></div>
        <div className="centerLine"></div>
      </div>

      {/* STOPS */}
      <div className="stops">
        {stops.map((stop, idx) => {
          const sideClass = idx % 2 === 0 ? "left" : "right"

          // Title text
          let titleText
          if (stop.type === "GRAD") titleText = "🎓 GRADUATION!"
          else if (stop.type === "COOP") titleText = "CO-OP TERM"
          else titleText = "Semester " + stop.term

          // Completion (term toggles only; co-op/grad auto gray when allDone)
          let isComplete = false
          if (stop.type === "TERM") isComplete = completedTerms.includes(stop.term)
          else isComplete = allDone

          // Class names
          let rowClass = "stopRow " + sideClass
          if (tourRunning && tourIndex === idx) rowClass += " activeStop"

          let houseClass = "house"
          if (stop.type === "COOP") houseClass += " house--coop"
          if (stop.type === "GRAD") houseClass += " house--grad"
          if (isComplete) houseClass += " house--complete"

          return (
            <div
              ref={(el) => (stopRefs.current[idx] = el)}
              key={`${stop.type}-${stop.term}-${idx}`}
              className={rowClass}
            >
              <div className={houseClass}>
                <div className="house__roof"></div>

                <div className="house__body">
                  <div className="house__header">
                    <h3 className="house__title">{titleText}</h3>

                    {stop.type === "TERM" && (
                      <button
                        className="termCheck"
                        onClick={() => onToggleTerm(stop.term)}
                      >
                        {completedTerms.includes(stop.term) ? "✓ Done" : "Mark done"}
                      </button>
                    )}
                  </div>

                  {stop.courses?.length > 0 && (
                    <ul className="courseList">
                      {stop.courses.map((course) => (
                        <li key={course} className="courseItem">
                          {course}
                        </li>
                      ))}
                    </ul>
                  )}

                  {stop.type === "GRAD" && allDone && (
                    <p className="gradMsg">Congrats — you’re on track to graduate! 🎉</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
