# StockPilot Frontend

The React frontend for **StockPilot**, an inventory management application built with React and Laravel.

The frontend provides an authenticated dashboard for viewing and managing product and category data through the StockPilot API.

## Features

* Admin and user authentication
* Dashboard with inventory statistics
* Product management
* Category management
* Product image uploads
* Role-based interface
* Read-only access for regular users
* Admin-only create, update, and delete actions
* API integration with Laravel Sanctum
* Responsive inventory management interface

## Tech Stack

* **React**
* **Vite**
* **JavaScript**
* **CSS**
* **Lucide React**

## Project Structure

```text
frontend/
├── src/
│   ├── assets/
│   ├── api.js
│   ├── App.jsx
│   ├── App.css
│   ├── CategoryManager.jsx
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── ProductManager.jsx
│   └── main.jsx
├── .env.example
├── package.json
├── package-lock.json
└── vite.config.js
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the API URL

Create a `.env` file based on `.env.example`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

The `.env` file should not be committed to the repository.

### 3. Start the development server

```bash
npm run dev
```

The frontend will be available at the local URL provided by Vite.

### 4. Build for production

```bash
npm run build
```

## Backend

The frontend communicates with the Laravel backend located in the `backend/` directory.

The backend provides:

* Authentication with Laravel Sanctum
* User roles
* Category management
* Product management
* Product image storage
* Protected API endpoints

## Authentication

The frontend stores the Sanctum access token in browser local storage and sends it with authenticated API requests.

Administrative actions are restricted by the backend to users with the `admin` role.

## Project Status

StockPilot is a portfolio project focused on practical full-stack development, API integration, authentication, authorization, and inventory management.

## Author

**Somar Hassn**

IT Engineering — Cybersecurity
