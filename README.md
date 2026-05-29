# TaskOrbit — Minimal Project Management System

<div align="center">

![TaskOrbit Banner](https://res.cloudinary.com/drxigac9l/image/upload/v1780042608/TaskOrbit_fvgfcm.png)

[![Live Client](https://img.shields.io/badge/Live%20Client-task--orbit--client.vercel.app-4F46E5?style=for-the-badge&logo=vercel)](https://task-orbit-client.vercel.app/)
[![Live Server](https://img.shields.io/badge/Live%20API-task--orbit--server.vercel.app-10B981?style=for-the-badge&logo=render)](https://task-orbit-server.vercel.app/)
[![Client Repo](https://img.shields.io/badge/GitHub-Client-181717?style=for-the-badge&logo=github)](https://github.com/shalauddinahmedshipon/task-orbit-client)
[![Server Repo](https://img.shields.io/badge/GitHub-Server-181717?style=for-the-badge&logo=github)](https://github.com/shalauddinahmedshipon/task-orbit-server)

A full-stack project management system with role-based dashboards, sprint planning, kanban boards, time tracking, and real-time approval workflows.

</div>

---

## Table of Contents

- [Overview](#overview)
- [Live Demo & Credentials](#live-demo--credentials)
- [Entity Relationship Diagram](#entity-relationship-diagram)
- [Tech Stack](#tech-stack)
- [Features](#features)
  - [Admin / Manager Panel](#admin--manager-panel)
  - [Member Panel](#member-panel)
- [Project Structure](#project-structure)
  - [Backend](#backend-structure)
  - [Frontend](#frontend-structure)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#environment-variables)
  - [Backend `.env`](#backend-env)
  - [Frontend `.env.local`](#frontend-envlocal)
- [Authentication Flow](#authentication-flow)
- [Role-Based Access Control](#role-based-access-control)
- [Deployment](#deployment)

---

## Overview

TaskOrbit is a compact, production-minded project management system built as a recruitment task for [DataPollex Limited](https://www.datapollex.com). It supports two main panels:

- **Admin / Manager Dashboard** — create and manage projects, sprints, tasks, teams, and reports.
- **Member Panel** — consume assigned work, update task status, log time, and track personal and project progress.

---

## Live Demo & Credentials

| Role    | Email               | Password |
|---------|---------------------|----------|
| Admin   | admin@email.com     | 123456   |
| Manager | manager@email.com   | 123456   |
| Member  | member@email.com    | 123456   |

> **Client:** [https://task-orbit-client.vercel.app](https://task-orbit-client.vercel.app/)  
> **API Base URL:** [https://task-orbit-server.vercel.app/api](https://task-orbit-server.vercel.app/)

---

## Entity Relationship Diagram

[![ERD Diagram](https://res.cloudinary.com/drxigac9l/image/upload/v1780042608/TaskOrbit_fvgfcm.png)](https://lucid.app/lucidchart/96840aa6-c87a-421e-9845-4408cf5d3df8/edit?viewport_loc=-2509%2C-977%2C3219%2C1504%2C0_0&invitationId=inv_d5175b31-4a5a-4292-95d7-256de8a91cb2)

[View full interactive ERD on LucidChart →](https://lucid.app/lucidchart/96840aa6-c87a-421e-9845-4408cf5d3df8/edit?viewport_loc=-2509%2C-977%2C3219%2C1504%2C0_0&invitationId=inv_d5175b31-4a5a-4292-95d7-256de8a91cb2)

**Core entities:** `User` · `Project` · `Sprint` · `Task` · `Subtask` · `Attachment` · `Comment` · `TimeLog` · `ActivityLog`

---

## Tech Stack

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| TypeScript | Type safety across the entire codebase |
| MongoDB + Mongoose | Database and ODM |
| Zod | Request validation and schema inference |
| JSON Web Tokens (JWT) | Stateless authentication via HTTP-only cookies |
| Bcrypt | Password hashing |
| Cloudinary | Image and file attachment storage |
| Multer | Multipart file upload handling |

### Frontend

| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | React framework with file-based routing |
| TypeScript | End-to-end type safety |
| Redux Toolkit + RTK Query | Global state management and data fetching/caching |
| shadcn/ui | Accessible UI component library |
| Tailwind CSS | Utility-first styling |
| React Hook Form + Zod | Form management and client-side validation |
| @hello-pangea/dnd | Drag-and-drop Kanban board |
| date-fns | Date formatting and manipulation |
| Sonner | Toast notifications |

---

## Features

### Admin / Manager Panel

#### Project Management
- Create projects with title, client, description, dates, budget, status, and optional thumbnail
- Project list with grid and table views, filtering by status and client
- Quick stats per project card (tasks total / completed)
- Full CRUD with dynamic routing to project detail

#### Sprint Management
- Create sprints with auto-incremented sprint numbers per project
- Sprint switcher strip for quick navigation between sprints
- Sprint CRUD with start/end dates and order management
- Sprint progress bar showing task completion percentage

#### Task Management
- Rich task fields: title, description, assignees, estimated hours, priority, status, due date, attachments, and optional subtasks
- Task list with full column set and row-level actions
- **Kanban board** with drag-and-drop status updates (extra credit feature)
- Review approval workflow: tasks with `reviewApproval: true` require manager action before moving to Done
- Inline approve / reject buttons in the Review Queue on the admin dashboard
- File attachments (PDF and images) uploaded to Cloudinary
- Subtask progress tracking with checkboxes

#### Team Management
- Create users with temporary passwords (forced change on first login)
- Edit role, department, skills, and block/unblock status
- Role-based restrictions: managers cannot assign admin or manager roles
- User table with avatar, skill tags, joined date, and status badges

#### Reports
- Per-project: percent complete, tasks by status, hours logged, sprint count
- Per-member: total tasks, completion rate, hours logged, task breakdown chart
- Tabbed interface with project picker and member picker dropdowns

#### Admin Dashboard Overview
- Live stat cards: total projects, tasks, team size, pending reviews, overdue tasks
- **Review Queue** — all tasks in `review` status with `reviewApproval: true`, inline approve/reject
- Project progress list with quick percentage bars

### Member Panel

#### Dashboard
- Personalised greeting with today's task summary
- Highlighted **To Do** tasks sorted by overdue first, then high priority
- Weekly hours bar chart (Mon–Sun) from logged time entries
- My projects progress overview
- Overdue alert banner

#### My Tasks
- Filterable list of all personally assigned tasks
- Status, priority, due date, and subtask progress visible at a glance

#### Sprint & Task Pages
- Project → Sprint → Task navigation identical to admin panel
- Members can update task status, add comments, upload attachments
- Members cannot move tasks to Done when `reviewApproval: true` — must go through Review first

#### Time Logging
- Log hours per task with date and optional note
- Weekly summary view
- Personal time log history with delete capability

#### Profile & Settings
- Update display name and avatar
- Change password with old/new/confirm fields

---

## Project Structure

### Backend Structure

```
task-orbit-server/
├── src/
│   ├── app/
│   │   ├── config/          # Environment config, Cloudinary, Multer
│   │   ├── DB/              # Seed admin on first boot
│   │   ├── error/           # AppError class
│   │   ├── middlewares/     # auth, validateRequest, globalErrorHandler, notFound
│   │   ├── modules/
│   │   │   ├── auth/        # Login, logout, getMe, changePassword
│   │   │   ├── user/        # CRUD, profile update, block/unblock
│   │   │   ├── project/     # Project CRUD, member management
│   │   │   ├── sprint/      # Sprint CRUD with order
│   │   │   ├── task/        # Task CRUD, status update, approval, attachments
│   │   │   ├── comment/     # Task comments CRUD
│   │   │   ├── timeLog/     # Time logging per task
│   │   │   ├── activityLog/ # Automatic activity tracking on task changes
│   │   │   └── report/      # Project and user report aggregations
│   │   ├── routes/          # Central router
│   │   └── utils/           # catchAsync, sendResponse, uploadToCloudinary
│   ├── app.ts               # Express app with CORS and middleware
│   └── server.ts            # MongoDB connection and server boot
```



---

## API Reference

All endpoints are prefixed with `/api`.

### Authentication — `/api/auth`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/login` | Public | Login, sets HTTP-only cookie |
| POST | `/auth/logout` | Any | Clears cookie |
| GET | `/auth/get-me` | Any | Current user from token |
| PATCH | `/auth/change-password` | Any | Change own password |

### Users — `/api/users`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/users/create-user` | Admin, Manager | Create new user |
| GET | `/users` | Admin, Manager | List all users |
| GET | `/users/my-profile` | Any | Own full profile |
| GET | `/users/:userId` | Admin, Manager | Single user |
| PATCH | `/users/update-profile` | Any | Update own name / avatar (multipart) |
| PATCH | `/users/:userId` | Admin, Manager | Edit role, dept, skills, status |
| DELETE | `/users/:userId` | Admin only | Delete user |

### Projects — `/api/projects`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/projects` | Admin, Manager | Create project |
| GET | `/projects` | Any | List projects (members see own) |
| GET | `/projects/:projectId` | Any | Single project |
| PATCH | `/projects/:projectId` | Admin, Manager | Update project |
| DELETE | `/projects/:projectId` | Admin, Manager | Delete project |
| POST | `/projects/:projectId/members` | Admin, Manager | Add members |
| DELETE | `/projects/:projectId/members/:memberId` | Admin, Manager | Remove member |

### Sprints — `/api/sprints`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/sprints` | Admin, Manager | Create sprint |
| GET | `/sprints` | Any | List sprints (`?projectId=`) |
| GET | `/sprints/:sprintId` | Any | Single sprint |
| PATCH | `/sprints/:sprintId` | Admin, Manager | Update sprint |
| DELETE | `/sprints/:sprintId` | Admin, Manager | Delete sprint |

### Tasks — `/api/tasks`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/tasks` | Any | All tasks (members see own) |
| POST | `/tasks/project/:projectId` | Admin, Manager | Create task |
| GET | `/tasks/:taskId` | Any | Single task (populated) |
| PATCH | `/tasks/:taskId` | Admin, Manager | Full task update |
| PATCH | `/tasks/:taskId/status` | Member | Status + subtask update only |
| PATCH | `/tasks/:taskId/approve` | Admin, Manager | Approve or reject review |
| POST | `/tasks/:taskId/attachments` | Any | Upload file (multipart) |
| DELETE | `/tasks/:taskId/attachments` | Any | Remove attachment by publicId |
| DELETE | `/tasks/:taskId` | Admin, Manager | Delete task |

### Comments — `/api/comments`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/comments/task/:taskId` | Any | Task comments |
| POST | `/comments/task/:taskId` | Any | Add comment |
| PATCH | `/comments/:commentId` | Own or Admin/Manager | Edit comment |
| DELETE | `/comments/:commentId` | Own or Admin/Manager | Delete comment |

### Time Logs — `/api/time-log`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/time-log/task/:taskId` | Any | Log time on a task |
| GET | `/time-log/task/:taskId` | Any | Time logs for a task |
| GET | `/time-log/my` | Any | Own all time logs |
| PATCH | `/time-log/:logId` | Own or Admin/Manager | Update log entry |
| DELETE | `/time-log/:logId` | Own or Admin/Manager | Delete log entry |

### Reports — `/api/reports`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/reports/me` | Any | Own task stats and hours |
| GET | `/reports/user/:userId` | Admin, Manager | Any user's stats |
| GET | `/reports/project/:projectId` | Admin, Manager | Project progress report |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB Atlas cluster (or local MongoDB 6+)
- Cloudinary account (free tier is sufficient)

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/shalauddinahmedshipon/task-orbit-server.git
cd task-orbit-server

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Fill in your values — see Environment Variables section below

# Run in development mode (ts-node-dev with hot reload)
npm run dev

# Build for production
npm run build
npm start
```

The server starts at `http://localhost:5000`. On first boot, the seed function creates an admin account using the credentials in your `.env` file.

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/shalauddinahmedshipon/task-orbit-client.git
cd task-orbit-client

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL to your backend URL

# Run development server
npm run dev

# Build for production
npm run build
npm start
```

The client starts at `http://localhost:3000`.

---

## Environment Variables

### Backend `.env`

```env
NODE_ENV=development
PORT=5000

# MongoDB Atlas connection string
DATABASE_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?appName=Cluster0

# JWT
JWT_ACCESS_SECRET=your_super_secret_key_here
ACCESS_TOKEN_EXPIRES_IN=7d

# Bcrypt
BCRYPT_SOLT=10

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Seed admin (created on first boot if no admin exists)
ADMIN_EMAIL=admin@email.com
ADMIN_PASSWORD=123456
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

> For production, set `NEXT_PUBLIC_API_URL` to your deployed backend URL, e.g. `https://task-orbit-server.vercel.com/api`.

---

## Authentication Flow

1. User submits email and password to `POST /api/auth/login`
2. Server validates credentials, generates a signed JWT, and sets it as an **HTTP-only cookie** (`accessToken`)
3. All subsequent requests automatically include the cookie — no manual token management on the frontend
4. The Redux `authSlice` stores the user object (name, email, role) returned from the login response
5. On app boot, `GET /api/auth/get-me` re-hydrates the auth state from the cookie
6. Logout calls `POST /api/auth/logout` which clears the cookie server-side

> Cookies are set with `httpOnly: true`, `secure: true` in production, and `sameSite: 'none'` to support cross-origin requests between Vercel (client) and Render (server).

---

## Role-Based Access Control

| Feature | Admin | Manager | Member |
|---|:---:|:---:|:---:|
| Create / delete projects | ✅ | ✅ | ❌ |
| Create / delete sprints | ✅ | ✅ | ❌ |
| Create / edit / delete tasks | ✅ | ✅ | ❌ |
| Update task status | ✅ | ✅ | ✅ (own tasks only) |
| Approve / reject review tasks | ✅ | ✅ | ❌ |
| Upload / delete attachments | ✅ | ✅ | ✅ |
| Add / edit / delete comments | ✅ | ✅ | ✅ (own only) |
| Log / delete time entries | ✅ | ✅ | ✅ (own only) |
| Manage team members | ✅ | ✅ (members only) | ❌ |
| Delete users | ✅ | ❌ | ❌ |
| View reports | ✅ | ✅ | Own only |
| View all projects | ✅ | ✅ | Assigned only |
| View all tasks | ✅ | ✅ | Assigned only |

Route guards are enforced both server-side (auth middleware checks JWT role) and client-side (Next.js layout guards redirect based on Redux `authSlice` role).

---

## Deployment

### Backend — Vercel.com



### Frontend — Vercel

---

## License

This project was built as a recruitment task for [DataPollex Limited](https://www.datapollex.com).

---

<div align="center">
  Built with ❤️ by <a href="https://github.com/shalauddinahmedshipon">Shalauddin Ahmed Shipon</a>
</div>
