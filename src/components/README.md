# 🔥 Issra Mrabet — Portfolio

A spectacular, Lando-Norris-level personal portfolio built with **React + Vite + GSAP + Framer Motion + Tailwind CSS v4**.

## ⚡ Features

- **Custom magnetic cursor** — glowing blob that trails your mouse
- **Animated preloader** — "IM" initials with counting loader
- **Glitch text effect** on your name (hero section)
- **Typewriter** cycling through your roles
- **Floating profile photo** with animated conic gradient border
- **Neural network particles** background (interactive — repulse on hover, push on click)
- **Scroll reveal animations** on every section
- **Project cards** → click to open full modal with GitHub button
- **Skill tags** with hover glow per category
- **Smooth scroll** powered by Lenis
- **Scan line** decoration (subtle, cinematic)
- **Mobile responsive**

## 🛠️ Tech Stack

| Library | Purpose |
|---|---|
| React + Vite | Frontend framework + dev server |
| Tailwind CSS v4 | Utility classes |
| Framer Motion | Page animations, modals |
| GSAP | Advanced animations |
| tsParticles | Neural network particle field |
| Lenis | Ultra-smooth scroll |
| React Icons | Icon pack |

## 🚀 Setup

```bash
# In Git Bash, navigate to where you want the project:
cd ~/Desktop

# Install dependencies
npm install

# Start dev server
npm run dev
# → Open http://localhost:5173
```

## 📁 Files You Need to Add to `/public/`

| File | Description |
|---|---|
| `issra.png` | Your photo with **no background** (use remove.bg or Canva background remover) |
| `cv_issra.pdf` | Your CV — the download button will fetch this |
| `robot.png` | Optional — if you want a robot swap effect later |

## 🔗 Links to Update in Code

Open `src/components/Hero.jsx` and update the social links:
- GitHub URL
- LinkedIn URL  
- Instagram URL

Open `src/data/projects.js` and update:
- GitHub links for each project (replace the placeholder URLs)

Open `src/components/Contact.jsx` and update:
- Phone number if needed

## 🌐 Deploy to Vercel (free, takes 2 minutes)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts → your site will be live at yourname.vercel.app
```

## 🎨 Color Palette

| Variable | Color | Usage |
|---|---|---|
| `--violet` | `#8b5cf6` | Primary accent |
| `--cyan` | `#06b6d4` | Secondary accent |
| `--pink` | `#ec4899` | Tertiary / gradient |
| `--bg` | `#04040f` | Main background |

To change the palette, edit `src/styles/index.css` `:root` variables.

## ➕ Adding More Projects

Open `src/data/projects.js` and add a new object to the `projects` array:

```js
{
  id: 6,
  title: "MyNewProject",
  subtitle: "What it does",
  description: "Full description here...",
  tech: ["React", "Python", "etc"],
  github: "https://github.com/IssraMrabet/myproject",
  color: "#10b981",
  glow: "rgba(16,185,129,0.3)",
  icon: "🚀",
  badge: null, // or "Award", "Featured", etc
}
```
