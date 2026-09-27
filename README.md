# Polyform — Polynomial Calculator

A responsive React app for building and evaluating polynomials. Choose a degree, enter its coefficients, evaluate the polynomial at one point, and calculate its derivative at another.

## Features

- Set a polynomial degree from 0 to 12
- Enter a coefficient for each power of `x`
- See the polynomial expression update as you type
- Evaluate the polynomial at any real value
- Generate the first derivative and evaluate it at a separate point
- Responsive layout for desktop and mobile

## Built with

- React
- Vite
- JavaScript
- CSS

## Getting started

Requirements: Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production build:

```bash
npm run build
```

## Math

For a polynomial `P(x) = aₙxⁿ + … + a₁x + a₀`, the app evaluates `P(x)` using Horner’s method. It calculates the first derivative using the power rule:

```text
P′(x) = n·aₙxⁿ⁻¹ + … + 2·a₂x + a₁
```

## Project structure

```text
polynomial/
├── index.html
├── package.json
└── src/
    ├── App.jsx
    ├── App.css
    ├── index.css
    └── main.jsx
```
