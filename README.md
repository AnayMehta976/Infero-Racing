# 🔥 Inferno Racing

> **Engineering Speed. Igniting Innovation.**

[![Live Site](https://img.shields.io/badge/Live%20Site-infero--racing.vercel.app-ff2a00?style=for-the-badge&logo=vercel&logoColor=white)](https://infero-racing.vercel.app)
[![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)](https://greensock.com/gsap/)

---

## 📖 Overview

**Inferno Racing** is a high-performance racing team showcase website built to represent the team's engineering excellence, car design, aerodynamics development process, race strategy, and roster of engineers. The site features a dark, aggressive motorsport aesthetic with smooth scroll animations, parallax effects, and interactive UI elements — all crafted with vanilla HTML, CSS, and JavaScript.

---

## ✨ Features

- **Custom Cursor** — A dual-layer cursor (dot + follower ring) that reacts to hoverable elements with a smooth GSAP-powered lag effect.
- **Parallax Hero Section** — Full-bleed background image with scroll-driven parallax and fade-out title animation via GSAP ScrollTrigger.
- **Interactive Car Showcase** — An annotated image of the Inferno Racing car with animated hotspot callouts for the Front Wing, Wheels & Suspension, and Rear Wing.
- **Engineering Timeline** — A 4-phase scroll-animated timeline covering Concept → Wind Tunnel → Track Tests → Race Day.
- **Race Strategy Cards** — Three animated strategy cards covering Sponsorships, Budgeting, and Marketing.
- **Team Grid** — Scroll-revealed team member profiles with grayscale-to-color photo transitions on hover.
- **Infinite Sponsor Ticker** — A looping horizontal marquee of sponsor logos powered by GSAP.
- **Smooth Scrolling** — Lenis smooth scroll library integrated with GSAP's requestAnimationFrame loop.
- **Carbon Fiber Background** — CSS radial-gradient pattern simulating a carbon fiber texture across the entire page.
- **Glassmorphism Navbar** — Fixed navigation bar with backdrop blur, scroll transparency, and a Sponsors CTA button.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Page structure and semantic markup |
| **CSS3** | Styling, layout (Grid & Flexbox), animations, custom properties |
| **Vanilla JavaScript** | Cursor logic, event handling, animation orchestration |
| **[GSAP 3.12](https://greensock.com/gsap/)** | Scroll-triggered animations, tweens, timelines |
| **[GSAP ScrollTrigger](https://greensock.com/scrolltrigger/)** | Viewport-aware animation triggers tied to scroll position |
| **[Lenis](https://github.com/studio-freight/lenis)** | Smooth, inertia-based scroll behaviour |
| **[Google Fonts](https://fonts.google.com/)** | Syncopate (headings) · Inter (body text) |
| **[Vercel](https://vercel.com/)** | Hosting and continuous deployment |

---

## 📁 Project Structure

```
Infero-Racing/
├── assets/
│   ├── hero_background.png       # Hero section background image
│   ├── inferno_racing_car.png    # Main car showcase image
│   ├── anay.jpeg                 # Team member photo
│   ├── uv.jpeg                   # Team member photo
│   ├── daksh.jpeg                # Team member photo
│   ├── vishesh.jpeg              # Team member photo
│   └── ansh2.jpeg                # Team member photo
├── index.html                    # Main HTML document
├── style.css                     # All styles and CSS variables
└── main.js                       # GSAP animations, Lenis scroll, cursor logic
```

---

## 🚀 Getting Started

No build tools or dependencies are required. This is a pure static site.

### Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AnayMehta976/Infero-Racing.git
   cd Infero-Racing
   ```

2. **Open in browser:**
   - Simply open `index.html` in any modern browser, **or**
   - Use a local server for best results (avoids CORS issues with assets):

   ```bash
   # Using VS Code Live Server (recommended)
   # Install the "Live Server" extension and click "Go Live"

   # Or using Python
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `--bg-dark` | `#0a0a0a` | Page background |
| `--text-main` | `#f0f0f0` | Primary text |
| `--text-muted` | `#888888` | Secondary / caption text |
| `--accent-red` | `#ff2a00` | Primary accent, borders, highlights |
| `--accent-orange` | `#ff6600` | Secondary accent, hover states |
| `--accent-yellow` | `#ffcc00` | Timeline dots, card labels |
| `--font-heading` | `'Syncopate'` | All headings, logo, nav |
| `--font-body` | `'Inter'` | Body copy, descriptions |

---

## 📐 Sections

### 1. Hero
Full-screen section with a parallax background, large gradient title, and an animated scroll indicator. The title fades and shifts upward as the user scrolls down.

### 2. The Machine
An interactive car diagram with three annotated component callouts — **Front Wing**, **Wheels & Suspension**, and **Rear Wing** — each fading in with a spring-easing effect as the user scrolls into view.

### 3. Aerodynamics & Evolution
A centered vertical timeline documenting the car's development through four phases:
- **Phase 1 – Concept:** CFD analysis and monocoque design
- **Phase 2 – Wind Tunnel:** Turbulence identification and bargeboard optimization
- **Phase 3 – Track Tests:** 3D-printed manufacturing and physical validation
- **Phase 4 – Race Day:** Final performance validation under race conditions

### 4. Race Strategy
Three strategy cards covering the team's off-track operations: Sponsorships, Budgeting, and Marketing. Cards animate upward on scroll with a staggered delay.

### 5. The Engineers
A responsive grid showcasing the five core team members with role labels. Photos are displayed in grayscale and reveal full color on hover.

| Name | Role |
|---|---|
| Anay Mehta | Design Engineer |
| Yuvraj Nikum | Manufacturing Engineer |
| Daksh Firoda | Research & Development |
| Vishesh Dagra | Aerodynamics Engineer |
| Ansh Agrawal | Sponsorship & Marketing Manager |

### 6. Sponsors
An infinitely scrolling horizontal ticker featuring sponsor logos (Velocity Tech, Apex Dynamics, Quantum Aero, Redline Energy, Synergy Labs).

---

## 🌐 Deployment

The site is deployed on **Vercel** with automatic deployments triggered on every push to the `main` branch.

**Live URL:** [https://infero-racing.vercel.app](https://infero-racing.vercel.app)

To deploy your own fork:
1. Fork this repository
2. Import the repo into [Vercel](https://vercel.com/new)
3. Deploy — no build configuration needed (static site)

---

## 👥 Team

| Member | Role | GitHub |
|---|---|---|
| **Anay Mehta** | Design Engineer & Web Developer | [@AnayMehta976](https://github.com/AnayMehta976) |
| **Yuvraj Nikum** | Manufacturing Engineer | — |
| **Daksh Firoda** | Research & Development | — |
| **Vishesh Dagra** | Aerodynamics Engineer | — |
| **Ansh Agrawal** | Sponsorship & Marketing Manager | — |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  <strong>© 2026 Inferno Racing — Engineering Speed.</strong>
</p>
