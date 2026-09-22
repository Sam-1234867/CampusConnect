# CampusConnect

CampusConnect is a Smart Student Activity and Attendance Management System.

## Problem Statement

CampusConnect helps students, teachers, and administrators manage attendance, campus events, announcements, and user information in one system.

## Features

* Student registration and login
* Teacher and admin login
* Role-based access
* Protected routes
* Student attendance history
* Teacher attendance management
* Campus events
* Event create, edit, and delete
* Campus announcements
* Announcement create, edit, and delete
* Admin user management
* Form validation
* Loading and error messages
* Responsive design
* 404 page
* Unauthorized access protection

## User Roles

### Student

* Register and login
* View personal attendance
* View upcoming events
* View announcements
* View student dashboard

### Teacher

* Login
* Create attendance sessions
* Mark student attendance
* View student attendance records
* Create, edit, and delete events
* Create, edit, and delete announcements
* View teacher dashboard

### Admin

* Login
* Manage users
* Create attendance sessions
* Mark attendance
* View attendance records
* Create, edit, and delete events
* Create, edit, and delete announcements
* View admin dashboard

## Tech Stack

* React
* JavaScript
* Vite
* Firebase Authentication
* Cloud Firestore
* React Router
* CSS
* GitHub
* Vercel

## Architecture / Folder Structure

```text
src/
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── Loader.jsx
│   └── ProtectedRoute.jsx
│
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── StudentDashboard.jsx
│   ├── TeacherDashboard.jsx
│   ├── AdminDashboard.jsx
│   ├── Attendance.jsx
│   ├── Events.jsx
│   ├── Announcements.jsx
│   ├── UserManagement.jsx
│   ├── NotFound.jsx
│   └── NotAuthorized.jsx
│
├── context/
│   ├── AuthContext.jsx
│   └── UserContext.jsx
│
├── services/
│   ├── firebase.js
│   └── firestore.js
│
├── styles/
│   └── Theme.css
│
├── App.jsx
└── main.jsx
```

## Firebase Collections

### users

Stores user information.

Fields:

* name
* email
* role
* status
* createdAt

### attendanceSessions

Stores attendance sessions.

Fields:

* title
* date
* createdBy
* status
* createdAt

Attendance records contain:

* studentId
* status
* markedBy
* markedAt

### events

Stores campus events.

Fields:

* title
* date
* time
* location
* description
* createdBy
* createdAt

### announcements

Stores campus announcements.

Fields:

* title
* message
* audience
* createdBy
* createdAt

## Local Setup

Install the dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

## Environment Variables

Create a `.env` file in the project root.

Required variables:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

The `.env` file must not be committed to GitHub.

Use `.env.example` as the template.

## Test Accounts

### Student

Email: `alikhan.student@gmail.com`

### Teacher

Email: `teacher@campusconnect.com`

### Admin

Email: `admin@campusconnect.com`

Passwords are provided separately for testing and are not stored in this README.

## Deployment

The application is prepared for deployment using Vercel.

Production URL:

To be added after deployment.

GitHub Repository:

To be added if required.

## Team Members and Responsibilities

### Sam Khan

* Project planning
* React development
* Firebase setup
* Authentication
* Firestore database
* Role-based access
* Attendance
* Events
* Announcements
* Testing
* Deployment

## Known Limitations

* Dashboard summary information is currently basic.
* Some existing Firebase records were created during development and testing.
* Advanced charts and reports are not included.

## Future Improvements

* Attendance charts
* Search and filtering
* CSV attendance export
* Pagination
* Profile images
* Automated tests
* Audit logs

## Developer

Sam Khan

## Project

CampusConnect — Smart Student Activity and Attendance Management System
