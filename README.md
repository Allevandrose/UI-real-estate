markdown
# Home254 Frontend — Kenyan Property Marketplace

React frontend for Home254, a property listing platform for Kenya. Built with React, Vite, Tailwind CSS, and Redux.

🔗 **Live Demo:** [https://home254.netlify.app](https://home254.netlify.app)

---

## ⚠️ Important Note About Backend

This frontend consumes the [Home254 API](https://github.com/Allevandrose/realEstate), which runs on **Render's free tier**.

| Behavior | Impact |
|----------|--------|
| Backend spins down after 15 minutes of inactivity | First request takes 20-50 seconds to wake up |
| API hosted in US/EU | Adds latency for Kenyan users |

**What this means for users:** The first page load or property search may be slow. After the first request, performance returns to normal.

🔗 **Backend Repository:** [realEstate](https://github.com/Allevandrose/realEstate)

---

## Overview

This frontend provides:

- **User authentication** (login/register with JWT)
- **Property browsing** with advanced filters
- **Property detail pages** with images and descriptions
- **Admin dashboard** for property management (role-based)
- **AI chat assistant** for natural language property search
- **Responsive design** for mobile and desktop

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 18 |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| State Management | Redux Toolkit |
| Routing | React Router DOM |
| HTTP Client | Axios |
| Icons | Remix Icon |
| Hosting | Netlify |

---

## Key Features

- **JWT Authentication** — Secure login/register with token storage
- **Advanced Property Filters** — County, town, price range, bedrooms, bathrooms
- **AI Chat Assistant** — Natural language search (e.g., *"3-bedroom apartments under 5M in Westlands"*)
- **Admin Dashboard** — Create, edit, delete property listings (role-based access)
- **Responsive Layout** — Works on mobile, tablet, and desktop
- **Image Gallery** — Property photos with Cloudinary optimization

---

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=https://home254.onrender.com/api
For production, create .env.production with the same variable.

⚠️ Never commit .env files to GitHub. They are already in .gitignore.

Local Setup
bash
# Clone the repository
git clone https://github.com/Allevandrose/UI-real-estate.git
cd UI-real-estate

# Install dependencies
npm install

# Create .env file with your API URL (see above)

# Start development server
npm run dev
The app will run at http://localhost:5173

Build for Production
bash
npm run build
The built files will be in the dist/ directory, ready for deployment to Netlify.

Deployment Architecture
text
User
  ↓
Netlify (Frontend) — Global CDN, fast
  ↓
Render (Backend API) — Free tier, cold starts possible
  ↓
MongoDB Atlas (Frankfurt)
Frontend is fast. Any slowness comes from the backend waking up from free tier sleep.

Project Structure
text
UI-real-estate/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Page components (Home, Login, Register, Admin, etc.)
│   ├── redux/           # Redux slices and store
│   │   ├── slices/      # Auth, properties, chat slices
│   │   └── store.js     # Redux store configuration
│   ├── services/        # API service functions (axios calls)
│   ├── utils/           # Helper functions
│   ├── App.jsx          # Main app component with routes
│   ├── main.jsx         # Entry point
│   └── index.css        # Tailwind imports
├── .env.production      # Production environment variables
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
Key Pages
Route	Page	Description	Auth Required
/	Home	Property listing with filters	No
/property/:id	Property Details	Single property view	No
/login	Login	User authentication	No (redirects if logged in)
/register	Register	New user registration	No
/admin	Admin Dashboard	Manage properties	Yes (admin role only)
/dashboard	User Dashboard	User's saved/favorited properties	Yes
State Management (Redux)
Slice	Purpose
auth	User authentication state (user, token, loading, error)
properties	Property listings, filters, pagination
chat	AI chat assistant messages and responses
API Integration
This frontend communicates with the backend API at https://home254.onrender.com/api

Endpoint	Used In
POST /api/auth/login	Login page
POST /api/auth/register	Register page
GET /api/properties	Home page (property listing)
GET /api/properties/:id	Property details page
POST /api/properties	Admin dashboard (create property)
PUT /api/properties/:id	Admin dashboard (update property)
DELETE /api/properties/:id	Admin dashboard (delete property)
POST /api/chat	AI chat assistant
What I Learned
Building this frontend taught me:

Structuring a React app with Vite for fast builds

Managing global state with Redux Toolkit

Implementing role-based routing (admin vs. regular user)

Handling JWT token storage and authenticated requests

Building responsive UI with Tailwind CSS

Deploying to Netlify with _redirects for SPA routing

Consuming a REST API with proper error handling

Future Improvements
Add property favoriting/saving for logged-in users

Implement infinite scroll for property listings

Add dark mode support

Write unit tests with React Testing Library

Add PWA support for offline browsing

Backend Repository
The API that powers this frontend is available at:

🔗 realEstate (Backend)

Troubleshooting
Issue	Solution
Properties not loading	Backend may be waking up from free tier. Wait 30 seconds and refresh.
Login fails	Check that backend API is running and .env has correct VITE_API_URL
Blank page on Netlify	Ensure _redirects file exists in public/ for SPA routing
CORS errors	Backend CORS is configured to allow requests from Netlify domain
Contact
Built by Ibrahim Mulei — ibrahimmulei@gmail.com

GitHub: @Allevandrose

📌 Live Demo: https://home254.netlify.app
🔗 Backend Repo: realEstate
