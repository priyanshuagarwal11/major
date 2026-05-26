# AI Career Copilot

A modern React + TypeScript frontend scaffold for an AI-powered career assistant platform.

## Repository Structure

The frontend application has been consolidated inside the `frontend/` directory.

- `frontend/` - Self-contained frontend workspace
  - `src/components/` - Reusable UI components
  - `src/pages/` - Route-level feature pages
  - `src/context/` - Global state and career data management
  - `src/api/` - API integration scaffold and data services
  - `src/hooks/` - Shared custom hooks
  - `src/styles/` - Theming and layout styles
  - `src/types/` - TypeScript interface declarations

## Getting Started

You can install dependencies and run dev/build tasks either from the **repository root** or from within the **`frontend/` directory**.

### Option 1: Running from the Root (Recommended)

At the root directory, scripts automatically delegate down to the `frontend/` folder:

- `npm install` - Automatically triggers a post-install hook to install frontend dependencies.
- `npm run dev` - Runs the Vite dev server.
- `npm run build` - Verifies TypeScript files and compiles the production bundles.
- `npm run preview` - Runs Vite's local preview server.
- `npm run lint` - Lints the codebase using ESLint.

### Option 2: Running directly from the `frontend/` folder

Alternatively, you can navigate inside the folder and run standard scripts:

```bash
cd frontend
npm install
npm run dev
```

## Features

- React Router v6 for client-side navigation
- React Context for career state management
- Axios-based API integration scaffold
- Responsive dashboard and career workflows
- TypeScript-first structure for maintainability
