# Sky Listings - Full stack project

A real estate React app that allows users to browse, search, and list properties. Features secure user authentication and a fully responsive design. Aiming for a clean, intuitive UI built with React, TypeScript, and TailwindCSS.

### Screenshots

| Home Page (XL)                                             | Home Page (Mobile)                                            | Property Browsing Page                                            |
| ---------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------------------------------- |
| ![Home XL](./frontend/public/screenshots/xl-home-page.jpg) | ![Home SM](./frontend/public/screenshots/small-home-page.jpg) | ![Browse](./frontend/public/screenshots/xl-browse-properties.jpg) |

- Frontend: React with TypeScript using Vite as the build tool. Styling with TailwindCSS.
- Backend: Node.js with TypeScript and Express, connected to a PostgreSQL database using Prisma as the ORM.

  > **Note on apps image handling:**
  > The current approach to handling images in this project is not ideal. Images are embedded as base64-strings, which isn't aligned with best practices for performance and scalability. This was a conscious trade-off made to simplify development and keep the project lightweight

## Getting Started

### Prerequisites:

- Node.js installed
- PostgreSQL installed and running
- PostgreSQL database created and accesible
- `.env` file which has correct `DATABASE_URL` that connects to said database
- `.env` file must also have `SECRET` defined

```env
# Example of DATABASE_URL for PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/yourdb"

# Example of SECRET for password hashing
SECRET=your-very-secret-key-1234567890
```

```bash
# Backend
cd backend
npm install
npm run db:init
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

Three users (user1, user2, user3) will be seeded to database. They all have properties to control and all have the same password(password).

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
- PostgreSQL database using Prisma as the ORM
- Jest for testing
- Code formatting with Prettier
