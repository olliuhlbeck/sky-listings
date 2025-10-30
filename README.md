# Sky Listings - Full stack project

Sky Listings is a full-stack real estate application that allows users to browse, search, and list properties.
It includes secure authentication, a responsive design, and an intuitive user experience built with React, TypeScript, and TailwindCSS on the frontend, and Node.js + Express + PostgreSQL on the backend.

### Screenshots

| Home Page (XL)                                                          | Home Page (Mobile)                                                         |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| <img src="./frontend/public/screenshots/xl-home-page.jpg" width="600"/> | <img src="./frontend/public/screenshots/small-home-page.jpg" width="300"/> |

| Browse properties                                                               | Inspect single property information                                                        |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| <img src="./frontend/public/screenshots/xl-browse-properties.jpg" width="600"/> | <img src="./frontend/public/screenshots/single-property-inspection-page.jpg" width="600"/> |

- Frontend: React with TypeScript using Vite as the build tool. Styling with TailwindCSS.
- Backend: Node.js with TypeScript and Express, connected to a PostgreSQL database using Prisma as the ORM.

  > **Note on apps image handling:**
  > The current approach to handling images in this project is not ideal. Images are embedded as base64-strings, which isn't aligned with best practices for performance and scalability. This was a conscious trade-off made to simplify development and keep the project lightweight

## Features

### 🔑 Authentication

- Register and log in securely
- Passwords hashed using bcrypt
- JWT-based session management

### 🏠 Property browsing

- Browse and search all properties
- Filter by location, price, or property type
- View detailed property information pages with sellers contact information

### 🧑‍💼 User dashboard

- Create, edit, and delete your own property listings
- Upload property images
- Update user profile details

### 📱 Responsive Design

- Responsive layout optimized for desktop and mobile
- TailwindCSS-based UI design for consistent styling

## Getting Started

### Prerequisites for running locally:

- Node.js installed
- PostgreSQL installed and running
- PostgreSQL database created and accessible
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
