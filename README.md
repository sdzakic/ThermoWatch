# ThermoWatch

ThermoWatch is a modern, real-time web dashboard built specifically to monitor and analyze Centrometal biological heating systems (e.g., BioTec-L). It provides an intuitive, detailed visualization of your home's heating infrastructure, including boiler temperatures, buffer tanks, radiators, and pump statuses.

## Features

- **Real-Time System Dashboard:** Visualizes the entire heating system with live data fetching.
- **Dynamic Heating Diagram:** Shows the current room temperature alongside target settings (calculated with base setting + correction values).
- **Backend Integrations:** Built with Firebase Functions to periodically scrape and poll the official Centrometal web portal. Data is then saved to Firestore for real-time frontend access.
- **Live Updates:** Uses Firebase Firestore listeners (`onSnapshot`) to push updates instantly to the dashboard without refreshing the page.
- **Secure Authentication:** Integrated with Firebase Authentication to protect viewing system data behind a login page.

## Architecture & Technologies

ThermoWatch is split into two main components:

1. **Frontend Application:**
   - **Framework:** React + Vite
   - **Language:** TypeScript
   - **Styling:** Tailwind CSS + shadcn/ui components
   - **State Management & Routing:** React Context (for Auth) and React Router DOM.
   - **Data Fetching:** Custom React hooks listening directly to Firestore.

2. **Backend (Firebase Functions):**
   - **Environment:** Node.js + TypeScript
   - **Authentication Simulator:** A specialized utility (`centrometal-api.ts`) that manages login sessions with the Centrometal web portal and gracefully handles CSRF tokens and cookies.
   - **Cron Jobs:** Periodically fetches boiler parameters, parses the data, and stores it in Firestore (`boilerReadings/latest` and historical log documents).

## Running the Project Locally

### Prerequisites
- Node.js & npm installed
- Firebase CLI installed (`npm install -g firebase-tools`)
- A Firebase project set up with Firestore Database, Authentication (Email/Password), and Firebase Hosting.

### Quick Start

1. Install dependencies for the frontend application:
   ```bash
   npm install
   ```
2. Set up your `.env.local` file in the root based on `.env.example`, providing your Firebase configuration details:
   ```bash
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Backend Configuration

To run the Firebase functions locally or deploy them, you must set the Centrometal authentication parameter secrets:

1. Navigate to the `functions/` directory and install dependencies:
   ```bash
   cd functions
   npm install
   ```
2. Configure your Centrometal login parameters (these will be safely managed in Secret Manager upon deployment):
   ```bash
   firebase functions:secrets:set CENTROMETAL_EMAIL
   firebase functions:secrets:set CENTROMETAL_PASSWORD
   ```
3. To test functions locally:
   ```bash
   npm run build
   firebase emulators:start
   ```

## Deployment

The project contains GitHub Actions workflows to automate deployment to Firebase Hosting and Firebase Functions whenever code is merged into the `main` branch. 

- Pushing a new branch or creating a Pull Request will generate an automatic preview channel via Firebase Hosting.
- Pushing to `main` will build the frontend (`dist/`), run `tsc` over the `functions`, and deploy the latest app and cloud functions.
