# SecretForge Frontend

Privacy-first deployment portal for Secret Network services.

## Features

- Next.js 14 with TypeScript
- Static site export (no server required)
- Tailwind CSS for styling
- Dark/light mode support
- Docker-compose configuration generator
- Responsive design

## Setup

### Prerequisites

- Node.js 20+ and npm

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Run development server
npm run dev
```

Visit http://localhost:3000

### Build for Production

```bash
# Build and export static site
npm run build

# Output will be in /out directory
```

## Structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── configure/       # Configuration page
│   │   └── page.tsx
│   └── deploy/          # Deployment page
│       └── page.tsx
├── components/
│   ├── Button.tsx       # Button component
│   ├── Card.tsx         # Card component
│   ├── CodeBlock.tsx    # Code display with copy
│   ├── ConfigForm.tsx   # VM configuration form
│   └── ThemeToggle.tsx  # Dark/light mode toggle
├── lib/
│   ├── generator.ts     # Docker-compose generator
│   └── utils.ts         # Utility functions
├── styles/
│   └── globals.css      # Global styles
└── types/
    └── index.ts         # TypeScript definitions
```

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### GitHub Pages

```bash
# Build
npm run build

# Deploy /out directory to GitHub Pages
```

### Custom Server

```bash
# Build
npm run build

# Serve /out directory with any static file server
npx serve out
```

## Configuration

The portal generates docker-compose files based on user selections:

- **VM Size**: small/medium/large
- **Chat History**: enabled/disabled

## User Flow

1. **Home** (`/`) - Landing page with features
2. **Configure** (`/configure`) - Select deployment options
3. **Deploy** (`/deploy`) - View generated config and instructions

## Design System

- **Colors**: Black, gray, white
- **Themes**: Dark mode default, light mode available
- **Typography**: System sans-serif stack
- **Spacing**: 8px base scale
- **Components**: Minimal, clean, professional

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Lint code

## License

TBD
