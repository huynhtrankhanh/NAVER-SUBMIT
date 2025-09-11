# UniFlow - Student Task Management System

UniFlow is a comprehensive task management application designed for students to organize their coursework, track deadlines, and receive timely notifications.

## Features

- **Task Management**: Full CRUD operations for tasks and courses
- **Persistent Storage**: Data persisted in localStorage
- **AI Integration**: Smart task suggestions and deadline collision detection
- **Push Notifications**: Scheduled notifications 15 minutes before task deadlines
- **Time/Date Handling**: Robust date/time management with internationalization support
- **Responsive Design**: Modern, clean interface built with React and Tailwind CSS
- **Multi-view Interface**: Dashboard, Course-based, and Calendar views

## Architecture

### Server (Node.js/Express/TypeScript)
- **Port**: 5001
- **Purpose**: Notification scheduler and API backend
- **Dependencies**: Express, CORS, node-schedule, TypeScript

### Client (React/Vite/Tailwind/TypeScript)  
- **Port**: 5173 (development)
- **Purpose**: Frontend user interface
- **Dependencies**: React, React Router, Headless UI, Heroicons, date-fns, uuid

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation & Setup

1. **Run the setup script**:
   ```bash
   ./setup.sh
   ```

2. **Start the server** (in one terminal):
   ```bash
   cd server
   npm start
   ```

3. **Start the client** (in another terminal):
   ```bash
   cd client
   npm run dev
   ```

4. **Access the application**:
   - Frontend: http://localhost:5173
   - Server API: http://localhost:5001

### Manual Setup

If you prefer to set up manually:

1. **Server setup**:
   ```bash
   cd server
   npm install
   npm run build
   npm start
   ```

2. **Client setup**:
   ```bash
   cd client
   npm install
   npm run build
   npm run dev
   ```

## Usage

### Creating Tasks
1. Navigate to any view (Dashboard, Courses, or Calendar)
2. Click "Add Task" button
3. Fill in task details: title, course, due date, and priority
4. Tasks will automatically schedule notifications 15 minutes before the deadline

### Managing Courses
1. Go to "Môn Học (Courses)" view
2. Click the "+" button next to "My Courses"
3. Add course name and choose a color tag
4. Organize tasks by course for better management

### AI Features
- **Focus Task Suggester**: Dashboard shows the highest priority task based on urgency and importance
- **Deadline Collision Detection**: Warns when multiple high-priority tasks or 4+ tasks are due on the same day

### Notification System
- Notifications are automatically scheduled when tasks are created or updated
- Scheduled 15 minutes before the task deadline
- Notifications are cancelled when tasks are completed or deleted
- Server must be running for notifications to work

## API Endpoints

### POST /schedule
Schedule a notification for a task.
```json
{
  "taskId": "unique-task-id",
  "message": "Notification message",
  "time": "2024-01-01T10:00:00.000Z"
}
```

### POST /cancel
Cancel a scheduled notification.
```json
{
  "taskId": "unique-task-id"
}
```

### GET /
Health check endpoint showing active notification jobs.

## Development

### Server Development
```bash
cd server
npm run dev  # Uses ts-node-dev for hot reloading
```

### Client Development
```bash
cd client
npm run dev  # Vite development server with hot reloading
```

### Building for Production
```bash
# Server
cd server
npm run build

# Client
cd client
npm run build
```

## File Structure

```
├── server/
│   ├── src/
│   │   └── index.ts          # Main server application
│   ├── package.json          # Server dependencies
│   └── tsconfig.json         # TypeScript configuration
├── client/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── contexts/         # React context providers
│   │   ├── layouts/          # Page layouts
│   │   ├── models/           # TypeScript type definitions
│   │   ├── services/         # API and storage services
│   │   ├── utils/            # Utility functions (AI features)
│   │   ├── views/            # Main page components
│   │   └── main.tsx          # React application entry point
│   ├── public/               # Static assets
│   ├── package.json          # Client dependencies
│   └── vite.config.ts        # Vite configuration
└── setup.sh                 # Quick setup script
```

## Technologies Used

- **Backend**: Node.js, Express, TypeScript, node-schedule
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **Date Handling**: date-fns
- **Storage**: localStorage (client), in-memory (server notifications)
- **Build Tools**: TypeScript Compiler, Vite
- **Styling**: Tailwind CSS with custom color scheme

## Requirements Fulfilled

1. ✅ **Full CRUD Operations**: Create, read, update, delete tasks and courses
2. ✅ **Persistent Storage**: localStorage for application data, in-memory for notifications
3. ✅ **Responsive Design**: Mobile-friendly interface using Tailwind CSS
4. ✅ **Time/Date Handling**: Comprehensive date management with date-fns
5. ✅ **Support for 20+ Items**: Optimized rendering and performance considerations
6. ✅ **Creativity & AI Integration**: Smart task suggestions and deadline collision detection
7. ✅ **Push Notification System**: Scheduled notifications with backend service

## License

This project was created as part of a coding assessment and is for educational purposes.