import { useEffect, useMemo, useState } from "react"
import confetti from "canvas-confetti"

import "./App.css"
import csBase from "./data/sequences/cs_base_sequence.json"

import Home from "./components/Home"
import Roadmap from "./components/Roadmap"

function buildStops(sequence) {
  const terms = sequence.terms.map((t) => ({ type: "TERM", ...t }))

  const stops = []
  for (let i = 0; i < terms.length; i++) {
    stops.push(terms[i])

    // Co-op after 4th and 6th (edit as needed)
    if (terms[i].term === "4th" || terms[i].term === "6th") {
      stops.push({
        type: "COOP",
        term: "Co-op",
        courses: ["Work Term (Co-op)"],
      })
    }
  }

  stops.push({ type: "GRAD", term: "Graduation", courses: [] })
  return stops
}

export default function App() {
  const stops = useMemo(() => buildStops(csBase), [])
  const [page, setPage] = useState("home")

  // TERM completion
  const termStops = stops.filter((s) => s.type === "TERM")
  const allTermNames = termStops.map((t) => t.term)
  const totalTermsCount = termStops.length

  const [completedTerms, setCompletedTerms] = useState([])

  function toggleTerm(termName) {
    setCompletedTerms((prev) =>
      prev.includes(termName) ? prev.filter((t) => t !== termName) : [...prev, termName]
    )
  }

  const completedTermsCount = completedTerms.length
  const allDone = allTermNames.every((t) => completedTerms.includes(t))

  // Confetti when done
  useEffect(() => {
    if (allDone) {
      confetti({ particleCount: 140, spread: 80, origin: { y: 0.6 } })
    }
  }, [allDone])

  return (
    <>
      {page === "home" && (
        <Home
          onStart={() => setPage("roadmap")}
          completedTermsCount={completedTermsCount}
          totalTermsCount={totalTermsCount}
        />
      )}

      {page === "roadmap" && (
        <div style={{ padding: 24 }}>
          <button onClick={() => setPage("home")} style={{ marginBottom: 12 }}>
            ← Back
          </button>

          <Roadmap
            stops={stops}
            completedTerms={completedTerms}
            onToggleTerm={toggleTerm}
            allDone={allDone}
          />
        </div>
      )}
    </>
  )
}
