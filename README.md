# Smart Library & Resource Management System (SLRMS)

## Project Description

Smart Library & Resource Management System (SLRMS) is a full-stack web application designed to help libraries and educational institutions manage books, digital resources, members, borrowing workflows, reservations, and fines efficiently. The system supports role-based access control, complete resource lifecycle management, and automated fine calculation.

This project is being developed as part of the **SESD course** and follows proper **software engineering and system design principles**, with a strong focus on backend development.

---

## Tech Stack

### Backend (Primary Focus)

- Node.js
- Express.js
- TypeScript
- JWT Authentication
- RESTful APIs
- PostgreSQL
- Prisma ORM

### Frontend

- React
- Axios
- HTML, CSS, JavaScript

---

## Key Features

- User authentication and authorization (JWT)
- Role-based access control (Admin, Librarian, Member)
- Book and resource cataloguing
- Borrowing, reservation, and return workflow management
- Borrowing status lifecycle (Reserved → Issued → Returned / Overdue)
- Automatic fine generation and payment tracking
- Notification system for due dates and overdue alerts
- Clean and scalable backend architecture

---

## Project Structure

```bash
SESD-SLRMS/
│
├── idea.md
├── useCaseDiagram.md
├── sequenceDiagram.md
├── classDiagram.md
├── ErDiagram.md
│
├── backend/
│   └── src/
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       ├── models/
│       ├── routes/
│       ├── middlewares/
│       └── config/
│
└── frontend/
    └── src/
```

---

## Software Engineering Practices Used

- Object-Oriented Programming (OOP)
- SOLID principles
- MVC architecture
- Service and Repository patterns
- Factory and Strategy design patterns
- Proper error handling and validation
- Layered backend design

---

## Setup Instructions

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

---

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL="PostgreSQL://user:password@localhost:3306/slrms_db"
JWT_SECRET="your_jwt_secret"
PORT=5000
FINE_RATE_PER_DAY=5
```

---
