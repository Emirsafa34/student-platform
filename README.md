Student Platform


Description
A web application for computer engineering students to view and manage courses and Q&A, featuring role-based access (admin and user), built with Vue.js for the frontend and Node.js/Express with MongoDB for the backend.

Table of Contents
Prerequisites

Installation

Environment Variables

Running the Application

API Endpoints

Deployment

Contributing

License

Contact

Prerequisites
Node.js v16 or higher

npm v6 or higher

MongoDB (local or Atlas cluster)

Installation
git clone https://github.com/Emirsafa34/student-platform.git
cd student-platform

Backend
cd backend
npm install

Frontend
cd ../frontend
npm install

Environment Variables
Create a .env file in the backend/ directory based on .env.example with:

PORT=3000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
CORS_ORIGIN=http://localhost:5173

For production, set CORS_ORIGIN to your frontend’s live URL (see Deployment).

Running the Application
Development
Backend
cd backend
npm run dev

Frontend
cd ../frontend
npm run dev

Open browser:

Frontend at http://localhost:5173

API at http://localhost:3000

API Endpoints
All protected routes require:
Authorization: Bearer <token>

Method	Route	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login and receive JWT token
GET	/api/courses	List courses
POST	/api/courses	Create course (admin only)
PUT	/api/courses/:id	Update course (admin only)
DELETE	/api/courses/:id	Delete course (admin only)
GET	/api/qas	List Q&A entries
POST	/api/qas	Create Q&A (authenticated)
GET	/api/announcements	List announcements
POST	/api/announcements	Create announcement (admin)
GET	/healthz	Health check ({"status":"ok"})

Deployment
Frontend (Render Static Site)
Build:
cd frontend
npm run build

Live URL:
https://student-platform-frontend-xxxxx.onrender.com

Backend (Render Web Service)
Push your code to GitHub; Render will auto-build.

Configure environment variables on Render Dashboard → Services → Environment:

MONGO_URI

JWT_SECRET

CORS_ORIGIN=https://student-platform-frontend-xxxxx.onrender.com

Live URL:
https://student-platform-eaip.onrender.com

Contributing
Contributions are welcome!

Fork the repo

Create a feature branch (git checkout -b feature/YourFeature)

Commit your changes (git commit -m "Add YourFeature")

Push to your branch (git push origin feature/YourFeature)

Open a Pull Request

License
This project is licensed under the MIT License. See the LICENSE file for details.

Contact
Emir Safa Çalışkan – esafac34@gmail.com
Project Link: https://github.com/Emirsafa34/student-platform







