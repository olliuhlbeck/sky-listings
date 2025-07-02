# React + TypeScript + TailwindCSS Starter

A simple property selling app that allows users to browse, search, and list real estate properties with a responsive design and secure login.

### Screenshots

| Home Page (XL)                                             | Home Page (Mobile)                                            | Property Browsing Page                                            |
| ---------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------- |
| ![Home XL](./frontend/public/screenshots/xl-home-page.jpg) | ![Home SM](./frontend/public/screenshots/small-home-page.jpg) | ![Browse](./frontend/public/screenshots/xl-browse-properties.jpg) |

- Frontend: React, TypeScript, Vite and TailwindCSS
- Backend: Node.js (TypeScript) with a PostgreSQL database

  > **Note on apps image handling:**
  > The current approach to handling images in this project is not ideal. Images are embedded as base64-strings, which isn't aligned with best practices for performance and scalability. This was a conscious trade-off made to simplify development and keep the project lightweight

## Getting Started

### Prerequisites:

- Node.js installed
- PostgreSQL installed and running
- PostgreSQL database created and accesible
- `.env` file which has correct `DATABASE_URL` that connects to said database

```env
# Example of DATABASE_URL for PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/yourdb"
```

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
npm install
npm run db:init
npm run dev
```

# Project Structure

```bash
root/
 ├── backend/   # API server
 └── frontend/  # React app
```

# Tech Stack

- React
- TypeScript
- TailwindCSS
- Node.js
- PostgreSQL database (managed with Prisma ORM)
- Jest for testing
- Code formatting with Prettier
