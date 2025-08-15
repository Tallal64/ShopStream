## Project Overview

This is a full-stack e-commerce web application called ShopStream. It is built with the MERN stack (MongoDB, Express.js, React, Node.js).

**Key Technologies:**

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB (with Mongoose)
  - JSON Web Tokens (JWT) for authentication
  - Cloudinary for image storage
  - Multer for file uploads
  - cors
  - dotenv for .env files
  - bcrypt for passwords encryption
  - cookie-parser for handling the cookies
  - nodemon (in development)
- **Frontend:**
  - React
  - Vite
  - React Router for routing
  - Zustand for state management
  - Tailwind CSS for styling
  - Shadcn UI

**Architecture:**
The project is a monorepo with a `backend` and a `frontend` directory. The backend exposes a RESTful API that the frontend consumes. The backend is also configured to serve the static frontend files in a production environment.

## Building and Running

### Prerequisites

- Node.js and npm
- MongoDB database
- A Cloudinary account

### Setup

1.  **Clone the repository.**
2.  **Install backend dependencies:**
    `npm install`
3.  **Install frontend dependencies:**
    `cd frontend && npm install`
4.  **Create a `.env` file** in the root of the directory by copying the `.env.sample` file. Populate it with your environment variables, including your MongoDB connection string, JWT secret, and Cloudinary credentials.

### Development

To run the application in development mode:

- **Backend**

  - `npm run dev` in the root directory for backend

- **Frontend**
  - `cd frontend && npm run dev`

This will start the backend server and the frontend development server

### Production

To build the application for production:

```bash
npm run build
```

This will create an optimized build of the frontend in the `frontend/dist` directory and install all necessary dependencies.

To run the application in production mode:

```bash
npm run start
```

This will start the backend server, which will also serve the frontend files.

## Folder Structure

- **Backend**

  - **Database Models**: The Mongoose models are defined in the `backend/src/models` directory.
  - **Backend API Routes**: The backend API routes are defined in the `backend/src/routes` directory.
  - **Backend Controllers**: The backend controllers are defined in the `backend/src/controllers` directory.
  - **Backend middleware**: The backend middleware are defined in the `backend/src/middleware` directory.

- **Frontend**

  - **Styling**: The frontend uses Tailwind CSS for utility-first styling, along with Shadcn-UI for styled, accessible components.
  - **Custom Components**: Some components that are custom made are defined in `frontend/src/components/`
  - **Shadcn Folder**: Shadcn uses styled components and are defined in `frontend/src/components/ui`
  - **Routing**: Frontend uses react-router-dom for routing and are defind in `frontend/src/App.jsx`
  - **Frontend Endpoints and state management**: The frontend uses Zustand for endpoints and global state management, particularly for authentication `frontend/src/store/auth` and products `frontend/src/store/product`.
