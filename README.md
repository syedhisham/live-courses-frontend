# Online Learning Platform - Frontend

[![React](https://img.shields.io/badge/react-%5E18.0.0-blue)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/next.js-%5E13.0.0-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%5E3.0.0-green)](https://tailwindcss.com/)
[![Axios](https://img.shields.io/badge/axios-%5E1.0.0-blueviolet)](https://axios-http.com/)
[![Redux](https://img.shields.io/badge/redux-%5E8.0.0-purple)](https://redux.js.org/)
[![Stripe](https://img.shields.io/badge/stripe-integrated-yellow)](https://stripe.com/)


---

## Project Overview

This frontend app provides the user interface for the secure online learning platform where:

- **Students** can browse available courses, purchase courses, and access purchased course materials including video streaming.
- **Instructors** can create courses, upload course materials, and schedule live streaming sessions.
- Secure authentication & authorization is implemented, communicating with the backend API.
- Integration with Stripe for payments and Zoom for live streaming.
- Responsive, modern UI built with React (Next.js) and Tailwind CSS.

---

## Features

- User registration, login/logout with secure cookie-based tokens.
- Browse course listings, with purchase status.
- View purchased courses and access course materials via secure signed URLs.
- Enroll in courses via Stripe Checkout integration.
- Instructors can create courses, upload materials, and schedule Zoom live streams.
- Responsive design with light/dark mode support.
- Robust error handling and user feedback (toasts, loaders).

---

## Tech Stack

- **Next.js**
- **Tailwind CSS** for styling
- **Axios** for API requests
- **Stripe.js** for frontend payment handling
- Cookie-based JWT authentication
- Environment variables for config

---

## Getting Started

### Prerequisites

- Node.js v16 or higher
- Access to the backend API server
- Stripe publishable key
- Zoom credentials managed via backend

### Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/syedhisham/live-courses-frontend.git
   cd live-courses-frontend
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:

   ```env
   NEXT_PUBLIC_API_URL=your_backend_api_url
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3000`.

---

## Available Scripts

* `npm run dev` — runs the app in development mode.
* `npm run build` — builds the app for production.
* `npm start` — starts the production server.

---

## Important Notes

* Ensure backend API URL is correctly set in `.env.local`.
* Authentication tokens are stored in HTTP-only secure cookies for security.
* Frontend handles redirections after Stripe checkout and communicates securely with backend.
* Zoom live streaming sessions are accessed via backend-secured playback links.
* For production, set up HTTPS and proper environment variables.

---

## Contact

Syed Hisham Ali Shah — [syedhishamshah27@gmail.com](mailto:syedhishamshah27@gmail.com)

