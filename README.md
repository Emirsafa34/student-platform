# Student Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Description

A web application for computer engineering students to view and manage courses and Q\&A, featuring role-based access (admin and user), built with Vue.js for the frontend and Node.js/Express with MongoDB for the backend.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Running Tests](#running-tests)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Prerequisites

- Node.js v16 or higher
- npm v6 or higher
- MongoDB (local or Atlas cluster)

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Emirsafa34/student-platform.git
cd student-platform

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Environment Variables

Create a `.env` file in the `backend/` directory based on `.env.example` and set the following variables:

```bash
PORT=3000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-secret-key>
```

## Running the Application

### Development

1. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend server:

   ```bash
   cd ../frontend
   npm run dev
   ```

3. Open your browser at `http://localhost:5173` (frontend) and `http://localhost:3000` (API).

### Production

Build and serve the frontend, ensure the backend is running in production mode:

```bash
# Build frontend
cd frontend
npm run build

# Serve frontend (e.g., with a static server)
npm install -g serve
serve -s dist
```

## Running Tests

Currently, basic unit tests are configured for the backend. To run tests:

```bash
cd backend
npm test
```

## Deployment

### Docker

1. Build Docker images:

   ```bash
   docker build -t student-platform-backend backend/
   docker build -t student-platform-frontend frontend/
   ```

2. Run containers:

   ```bash
   docker run -d -p 3000:3000 --name backend -e MONGO_URI=<your-mongo-uri> -e JWT_SECRET=<your-secret> student-platform-backend
   docker run -d -p 80:80 --name frontend student-platform-frontend
   ```

### Vercel / Heroku

- Frontend can be deployed directly via Vercel by connecting the `frontend/` directory.
- Backend can be deployed to Heroku; set config vars `MONGO_URI` and `JWT_SECRET` in Heroku dashboard.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request. Ensure code follows styling conventions and includes relevant tests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

Emir Safa Çalışkan – [esafac34@gmail.com](mailto:esafac34@gmail.com)

Project Link: [https://github.com/Emirsafa34/student-platform](https://github.com/Emirsafa34/student-platform)
