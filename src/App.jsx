import { useMemo, useState } from 'react'
import './App.css'

const MAX_DEGREE = 12

function cleanNumber(value) {
  const rounded = Number(Number(value).toFixed(6))
  return Object.is(rounded, -0) ? 0 : rounded
}

function pretty(value) {
  return cleanNumber(value).toString()
}

function polynomialText(coefficients, degree) {
  const terms = []
  for (let power = degree; power >= 0; power -= 1) {
    const coefficient = cleanNumber(Number(coefficients[power] ?? 0))
    if (!coefficient) continue
    const magnitude = Math.abs(coefficient)
    const variable = power === 0 ? '' : power === 1 ? 'x' : `x^${power}`
    const number = power > 0 && magnitude === 1 ? '' : pretty(magnitude)
    const body = `${number}${variable}` || '0'
    if (!terms.length) terms.push(coefficient < 0 ? `−${body}` : body)
    else terms.push(`${coefficient < 0 ? '−' : '+'} ${body}`)
  }
  return terms.length ? terms.join(' ') : '0'
}

function evaluate(coefficients, degree, x) {
  let result = 0
  for (let power = degree; power >= 0; power -= 1) {
    result = result * x + Number(coefficients[power] ?? 0)
  }
  return result
}

function App() {
  const [degree, setDegree] = useState(3)
  const [coefficients, setCoefficients] = useState({ 3: '2', 2: '-3', 1: '0', 0: '4' })
  const [point, setPoint] = useState('2')
  const [derivativePoint, setDerivativePoint] = useState('1')

  const derivativeCoefficients = useMemo(() => {
    const result = {}
    for (let power = 1; power <= degree; power += 1) {
      result[power - 1] = Number(coefficients[power] ?? 0) * power
    }
    return result
  }, [coefficients, degree])

  const polynomial = polynomialText(coefficients, degree)
  const derivative = polynomialText(derivativeCoefficients, Math.max(0, degree - 1))
  const value = evaluate(coefficients, degree, Number(point) || 0)
  const derivativeValue = degree === 0 ? 0 : evaluate(derivativeCoefficients, degree - 1, Number(derivativePoint) || 0)

  function changeDegree(event) {
    const nextDegree = Math.max(0, Math.min(MAX_DEGREE, Number(event.target.value) || 0))
    setDegree(nextDegree)
    setCoefficients((current) => {
      const next = { ...current }
      for (let power = 0; power <= nextDegree; power += 1) {
        if (next[power] === undefined) next[power] = '0'
      }
      return next
    })
  }

  function changeCoefficient(power, value) {
    setCoefficients((current) => ({ ...current, [power]: value }))
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Polyform home"><span className="brand-icon">P</span><span>polyform<span className="brand-period">.</span></span></a>
        <span className="top-label"><i /> Polynomial workspace</span>
      </header>

      <section className="hero">
        <div className="eyebrow"><span className="eyebrow-star">✳</span> A LITTLE ALGEBRA, A LOT CLEARER</div>
        <h1>Polynomials,<br /><span>made practical.</span></h1>
        <p>Build a polynomial, evaluate it at a point, and see its derivative in action.</p>
      </section>

      <section className="workspace" aria-label="Polynomial calculator">
        <div className="workspace-heading">
          <div><div className="step-label"><span>01</span> DEFINE YOUR POLYNOMIAL</div><p>Choose a degree, then enter a coefficient for every power of x.</p></div>
          <label className="degree-control"><span>DEGREE</span><input aria-label="Polynomial degree" type="number" min="0" max={MAX_DEGREE} step="1" value={degree} onChange={changeDegree} /></label>
        </div>

        <div className="polynomial-preview"><span className="preview-label">YOUR POLYNOMIAL</span><strong>P(x) <i>=</i> {polynomial}</strong><span className="degree-chip">DEGREE {degree}</span></div>

        <div className="coefficients-heading"><span>COEFFICIENTS</span><span>Enter values from the highest power down</span></div>
        <div className="coefficient-grid">{Array.from({ length: degree + 1 }, (_, index) => degree - index).map((power) => (
          <label className="coefficient-field" key={power}>
            <span className="power-label">{power === 0 ? 'CONSTANT' : `x${power > 1 ? `^${power}` : ''} COEFFICIENT`}</span>
            <div className="coefficient-input"><input aria-label={`Coefficient of x to the power ${power}`} type="number" step="any" value={coefficients[power] ?? '0'} onChange={(event) => changeCoefficient(power, event.target.value)} /><span>{power === 0 ? 'a₀' : `a${power}`}</span></div>
          </label>
        ))}</div>

        <div className="step-label evaluate-heading"><span>02</span> EVALUATE YOUR POLYNOMIAL</div>
        <div className="evaluation-card">
          <div className="evaluation-copy"><span className="math-badge">P</span><div><strong>Polynomial value</strong><small>Find P(x) at your chosen point</small></div></div>
          <div className="evaluation-controls"><label><span>x =</span><input aria-label="Point to evaluate polynomial" type="number" step="any" value={point} onChange={(event) => setPoint(event.target.value)} /></label><span className="equals">=</span><output aria-live="polite">{pretty(value)}</output></div>
        </div>

        <div className="step-label derivative-heading"><span>03</span> DERIVATIVE</div>
        <div className="derivative-card">
          <div className="derivative-top"><div className="evaluation-copy"><span className="math-badge derivative-badge">d/dx</span><div><strong>First derivative</strong><small>Differentiate each term by its power</small></div></div><span className="formula-label">POWER RULE</span></div>
          <div className="derivative-formula"><span>P′(x)</span><i>=</i><strong>{derivative}</strong></div>
          <div className="derivative-result"><div><span>Evaluate derivative at</span><div className="derivative-point"><span>x =</span><input aria-label="Point to evaluate derivative" type="number" step="any" value={derivativePoint} onChange={(event) => setDerivativePoint(event.target.value)} /></div></div><span className="equals">=</span><output aria-live="polite">{pretty(derivativeValue)}</output></div>
        </div>
        <div className="method-note"><span>✦</span> Values are calculated instantly using Horner’s method.</div>
      </section>

      <footer><span className="footer-mark">P</span><span>POLYFORM</span><span className="footer-right">A simple space for polynomial math <i>·</i> Built with React</span></footer>
    </main>
  )
}

export default App
