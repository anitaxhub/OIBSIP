# Anita Bashir | Personal Portfolio

**Oasis Infobyte Internship (OIBSIP) | Web Development | Level 1, Task 2**
**Intern:** Anita Bashir

A responsive personal portfolio website that works as a digital résumé. It presents my profile, skills, projects, journey and contact details. Built with HTML5 and CSS3, with a little JavaScript for navigation enhancements.

## Objective
Create a personal portfolio website that showcases skills, projects and contact information, effectively a digital résumé.

## Sections
- [x] **Profile / hero:** name, role title (Frontend Developer and AI Enthusiast), short introduction and a profile photo placeholder
- [x] **About:** short story, education, focus, languages and location
- [x] **Skills:** grouped as Frontend, Tools, Learning and interests, and People skills
- [x] **Projects:** 6 project cards with descriptions, tech tags and links to the code on GitHub
- [x] **Journey:** timeline of internship, education and tutoring experience
- [x] **Contact:** email, GitHub and LinkedIn cards
- [x] **Footer** with copyright and a back-to-top link

## Features
- Sticky navigation bar with the current section highlighted while scrolling
- Mobile menu (hamburger) that opens and closes with the button, the Escape key or a link click
- Smooth scrolling between sections
- Fully responsive: 3 columns on desktop, 2 on tablets, 1 on phones (tested at 390 px)
- Dark theme with a lime accent, and different background shades to separate sections
- Semantic HTML, keyboard friendly focus styles and `prefers-reduced-motion` support

## Tech Stack
- HTML5 (semantic tags: `header`, `nav`, `main`, `section`, `article`, `figure`, `footer`)
- CSS3 (custom properties, Flexbox, Grid, media queries)
- JavaScript (vanilla): mobile menu, active link highlighting with `IntersectionObserver`, footer year
- Google Fonts: Space Grotesk and IBM Plex Sans

## Colour Palette
| Name | Hex |
|------|-----|
| Background | `#0e110e` |
| Section shade | `#151a15` |
| Card | `#1c231c` |
| Accent lime | `#c6f432` |
| Text | `#eef2e9` |

## Project Structure
```
WebDev-L1-Portfolio/
├── index.html
├── style.css
├── script.js
├── README.md
├── images/
│   └── profile.jpg
└── screenshots/
    ├── desktop-full.png
    ├── mobile-full.png
    └── mobile-menu.png
```

## How to Run
1. Download or clone the repository.
2. Open `WebDev-L1-Portfolio/index.html` in any modern browser.

No installation or build step is needed.

## Screenshots
| Desktop | Mobile | Mobile menu |
|---------|--------|-------------|
| ![Desktop](screenshots/desktop-full.png) | ![Mobile](screenshots/mobile-full.png) | ![Menu](screenshots/mobile-menu.png) |

## What I Learned
- Planning a one-page site with clear sections and a consistent theme
- Building a responsive navigation with a mobile menu
- Using `IntersectionObserver` to highlight the active section
- Presenting projects and skills so a visitor understands them quickly
