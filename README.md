# 📝 Smart Notes - Frontend

A modern, responsive web application for managing notes efficiently, built with React and cutting-edge technologies.

![Smart Notes](https://img.shields.io/badge/React-18-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8) ![Vite](https://img.shields.io/badge/Vite-8.1-646cff) ![License](https://img.shields.io/badge/License-MIT-green)

## 🚀 Features

### 🔐 Authentication & Authorization
- User registration with profile image upload
- Secure login with JWT tokens
- Protected routes with automatic redirect
- Auto-logout on token expiration
- Profile management with image update

### 📝 Notes Management
- Full CRUD operations (Create, Read, Update, Delete)
- Rich text content with descriptions
- Color-coded notes (Yellow, Green, Blue, Pink, Purple, Orange)
- Tag management system
- Pin important notes to top
- Archive old notes
- Soft delete functionality
- View counter for each note

### 🔍 Advanced Search & Filtering
- Real-time search in titles and content
- Filter by category (Work, Personal, Ideas, Tasks, Other)
- Filter by status (Draft, Published, Archived)
- Sort by date, title, or views
- Pagination support (10 notes per page)

### 🎨 User Experience
- Dark/Light theme toggle
- Fully responsive design (Mobile, Tablet, Desktop)
- Toast notifications for user feedback
- Form validation with React Hook Form + Zod
- Loading states and error handling
- Smooth transitions and animations

### 📊 Dashboard
- Statistics overview (Total, Published, Pinned, Archived notes)
- Recent notes display
- Quick access to create new notes

## 🛠️ Tech Stack

### Core Technologies
- **Framework:** React 18
- **Build Tool:** Vite 8.1
- **Language:** JavaScript (ES6+)

### State Management & Data Fetching
- **Redux Toolkit:** Global state management
- **TanStack Query v5:** Server state management and caching
- **Axios:** HTTP client with interceptors

### Routing & Navigation
- **React Router v6:** Client-side routing
- Protected routes implementation
- Nested layouts

### Forms & Validation
- **React Hook Form:** Performant form handling
- **Zod:** Schema validation
- **@hookform/resolvers:** Integration layer

### Styling & UI
- **Tailwind CSS 3:** Utility-first CSS framework
- **Lucide React:** Modern icon library
- **React Hot Toast:** Toast notifications

### Development Tools
- ESLint for code quality
- Hot Module Replacement (HMR)
- Fast Refresh

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v24) - [Download](https://nodejs.org/)
- **npm** package manager
- **Backend API** running (see [Backend Repository](https://github.com/muhammedmtk/smart-notes-backend))

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/muhammedmtk/smart-notes-frontend.git
