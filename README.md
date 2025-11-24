# MLV Product Management Associate Program Website

A stunning, interactive website for MLV's Product Management Associate internship program built with Next.js 14, TypeScript, Tailwind CSS, Framer Motion, and React Three Fiber.

## Features

- **3D Hero Section**: Animated floating geometric shapes using React Three Fiber
- **Interactive Timeline**: Scroll-triggered animations with month-by-month progression
- **Compensation Calculator**: Interactive revenue share calculator
- **Glassmorphism Design**: Modern frosted glass effects on cards
- **Parallax Effects**: Smooth parallax scrolling throughout
- **Responsive Design**: Mobile-first approach with full responsiveness
- **Dark Theme**: Professional dark navy color scheme with gradient accents

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **3D Graphics**: React Three Fiber / Three.js
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
├── app/
│   ├── globals.css      # Global styles and Tailwind directives
│   ├── layout.tsx       # Root layout with metadata
│   └── page.tsx         # Main landing page
├── components/
│   ├── Hero.tsx              # 3D hero section
│   ├── Navigation.tsx        # Sticky navigation bar
│   ├── ProgramOverview.tsx   # Program phase cards
│   ├── Timeline.tsx          # Monthly timeline
│   ├── Compensation.tsx      # Revenue share calculator
│   ├── IdealCandidate.tsx    # Candidate requirements
│   ├── SuccessMetrics.tsx    # Animated metrics
│   ├── WeeklyBreakdown.tsx   # Schedule breakdown
│   ├── ApplicationProcess.tsx # Application steps
│   ├── FAQ.tsx               # Accordion FAQs
│   ├── Footer.tsx            # Footer with links
│   └── FloatingCTA.tsx       # Floating apply button
├── public/               # Static assets
├── tailwind.config.ts    # Tailwind configuration
├── next.config.js        # Next.js configuration
└── tsconfig.json         # TypeScript configuration
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically

### Manual Build

```bash
npm run build
npm start
```

## Customization

### Colors

Edit `tailwind.config.ts` to modify the color palette:

- `primary`: Purple (#7C3AED)
- `secondary`: Orange (#FF6B35)
- `dark`: Navy (#0A0E27)
- `accent-cyan`: Cyan (#06B6D4)
- `accent-pink`: Pink (#EC4899)

### Content

Update component files to modify:
- Timeline content in `Timeline.tsx`
- FAQ questions in `FAQ.tsx`
- Application requirements in `ApplicationProcess.tsx`

## License

MIT License - feel free to use for your own projects.
