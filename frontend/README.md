# WSP Solver Frontend

This is the frontend for the Workflow Satisfiability Problem (WSP) Solver, built with React, TypeScript, and Chakra UI.

## Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher) or yarn
- Backend server running (see backend README for setup)

## Getting Started

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file in the frontend directory with the following content:
   ```
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

3. **Running the development server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code linting
- `npm run type-check` - Check TypeScript types

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── layout/      # Layout components (header, sidebar, etc.)
│   ├── pages/       # Page components
│   └── shared/      # Shared components used across the app
├── services/        # API service and other services
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── hooks/           # Custom React hooks
├── context/         # React context providers
└── constants/       # Application constants
```

## Tech Stack

- **React** - UI library
- **TypeScript** - Type checking
- **Chakra UI** - Component library
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **Zod** - Schema validation
- **Vite** - Build tool and dev server
