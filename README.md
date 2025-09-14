[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/YHSq4TPZ)
# To-Do App – Preliminary Assignment Submission
⚠️ Please complete **all sections marked with the ✍️ icon** — these are required for your submission.

👀 Please Check ASSIGNMENT.md file in this repository for assignment requirements.

## 🚀 Project Setup & Usage
**How to install and run your project:**

### Quick Start (Recommended)
```bash
# Run the setup script to install dependencies and build everything
./setup.sh

# Start production server (serves both frontend and backend on port 5001)
./production.sh
```

### Manual Setup
```bash
# Install server dependencies
cd server && npm install

# Install client dependencies  
cd ../client && npm install

# Build the application
npm run build

# Start production server
cd ../server && NODE_ENV=production npm start
```

### Development Mode
```bash
# Terminal 1: Start server
cd server && npm run dev

# Terminal 2: Start client
cd client && npm run dev
```

Access the application at http://localhost:5001 (production) or http://localhost:5173 (development)

## 🔗 Deployed Web URL or APK file
Production server can be deployed on any Node.js hosting platform (Vercel, Heroku, Railway, etc.)

Live Demo: *[Will be updated with actual deployment URL]*


## 🎥 Demo Video
https://github.com/user-attachments/assets/af304aaa-09d6-4074-ac7b-2cc0d916be82


## 💻 Project Introduction

### a. Overview

**UniFlow** is a comprehensive task management system designed specifically for Vietnamese university students to better organize their coursework and navigate the chaos of student life. The application helps students track assignments, manage course deadlines, and receive proactive notifications to stay on top of their academic responsibilities.

UniFlow addresses the common problem of Vietnamese university students juggling multiple tasks across classes, group projects, and part-time work by providing a centralized platform with intelligent features that learn from user behavior and provide smart suggestions.

### b. Key Features & Function Manual

**Core Functionality:**
- **Task Management**: Full CRUD operations - Create, read, update, and delete tasks with due dates and priorities
- **Course Organization**: Create and manage courses with color-coded tags for visual organization
- **Multi-View Interface**: Three distinct views of the same data:
  - **Dashboard (Hôm Nay)**: Overview with AI suggestions and upcoming tasks
  - **Courses (Môn Học)**: Organize tasks by academic courses
  - **Calendar (Lịch Tuần)**: Weekly calendar view for deadline visualization

**Smart Features:**
- **Push Notifications**: Automatic notifications 15 minutes before task deadlines
- **AI Focus Suggestion**: Intelligent task prioritization based on urgency and importance
- **Deadline Collision Detection**: Warns when multiple high-priority tasks are due the same day
- **Persistent Storage**: All data saved locally with browser localStorage

**How to Use:**
1. **Adding Tasks**: Click "Add Task" button, fill in title, course, due date, and priority level
2. **Managing Courses**: Navigate to Courses view, click "+" to add new courses with custom colors
3. **Viewing Schedule**: Use Calendar view to see all tasks in a weekly format
4. **Completing Tasks**: Check off tasks as completed to track progress

### c. Unique Features (What’s special about this app?) 

**1. AI-Powered Task Prioritization**
- Smart "Focus Task" suggester that analyzes task priority and deadline proximity
- Calculates urgency scores considering overdue tasks, tasks due today, and upcoming deadlines
- Automatically highlights the most important task requiring immediate attention

**2. Proactive Deadline Collision Detection**
- Intelligent analysis that warns when 2+ high-priority tasks or 4+ total tasks are due the same day
- Helps students plan ahead and avoid overwhelming deadline pile-ups
- Real-time alerts as new tasks are added

**3. Integrated Notification System**
- Backend-powered scheduled notifications using node-schedule
- Automatic 15-minute deadline reminders without user intervention
- Server handles notification scheduling, updating, and cancellation

**4. Vietnamese-Optimized Interface**
- Navigation in Vietnamese (Hôm Nay, Môn Học, Lịch Tuần) tailored for Vietnamese students
- Cultural understanding of Vietnamese university semester structure

**5. Production-Ready Architecture**
- Single-server deployment serving both frontend and backend
- Optimized for easy deployment on any cloud platform
- Environment-aware configuration for development and production

### d. Technology Stack and Implementation Methods

**Frontend (Client):**
- **React 18** with TypeScript for type safety and modern component architecture
- **Vite** as build tool for fast development and optimized production builds
- **Tailwind CSS** for responsive, utility-first styling with custom color scheme
- **Headless UI** and **Heroicons** for accessible UI components and icons
- **React Router DOM** for client-side routing and navigation
- **date-fns** for robust date/time manipulation and formatting
- **UUID** for unique identifier generation

**Backend (Server):**
- **Node.js** with **Express.js** for REST API and static file serving
- **TypeScript** throughout for enhanced developer experience and type safety
- **node-schedule** for advanced notification scheduling and job management
- **CORS** middleware for cross-origin resource sharing

**Storage & Data:**
- **localStorage** for persistent client-side data storage (tasks, courses)
- **In-memory** storage for server notification job management
- **JSON-based** data structures for simple, lightweight persistence

**Build & Development:**
- **TypeScript Compiler** for server-side compilation
- **Vite** for client bundling with hot module replacement
- **PostCSS** and **Autoprefixer** for CSS processing
- Custom build scripts for unified production deployment

### e. Service Architecture & Database structure (when used)

**System Architecture:**
```
┌─────────────────────────────────────────────────────┐
│                 Production Server                   │
│                 (Port 5001)                         │
├─────────────────────────────────────────────────────┤
│  Express.js Server (TypeScript)                     │
│  ├─ Static File Serving (React Build)               │
│  ├─ API Routes (/api/*)                            │
│  │   ├─ POST /api/schedule (Task notifications)     │
│  │   ├─ POST /api/cancel (Cancel notifications)     │
│  │   └─ GET /api/health (Server status)            │
│  └─ SPA Fallback (/* → index.html)                 │
└─────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│              Client Application                     │
│              (React + TypeScript)                   │
├─────────────────────────────────────────────────────┤
│  React Router (Client-side routing)                 │
│  ├─ Dashboard View (/)                              │
│  ├─ Courses View (/courses)                         │
│  └─ Calendar View (/calendar)                       │
│                                                     │
│  State Management (React Context)                   │
│  ├─ Tasks State                                     │
│  ├─ Courses State                                   │
│  └─ AI Analysis Results                             │
│                                                     │
│  Storage Layer (localStorage)                       │
│  ├─ tasks: Task[]                                   │
│  └─ courses: Course[]                               │
└─────────────────────────────────────────────────────┘
```

**Data Models:**
- **Task**: { id, title, courseId, dueDate, priority, isCompleted }
- **Course**: { id, name, color }
- **Priority**: Enum (High, Medium, Low)

**Notification System:**
- Server maintains in-memory Map of scheduled jobs
- Uses node-schedule for precise timing
- Automatic cleanup after notification delivery
- Handles job cancellation for completed/deleted tasks

**No Traditional Database Used:**
- Client data persisted in browser localStorage
- Server notification jobs stored in memory (reset on restart)
- Lightweight approach suitable for individual user data

## 🧠 Reflection

### a. If you had more time, what would you expand?

**1. Enhanced AI Features**
- **Smart Study Time Estimation**: Learn from user completion patterns to provide more accurate time estimates for tasks
- **Personalized Procrastination Patterns**: Track and analyze when users typically complete tasks vs. when they plan to
- **Adaptive Priority Adjustment**: Automatically adjust task priorities based on user behavior and historical completion rates
- **Intelligent Course Load Balancing**: Suggest optimal task distribution across different courses

**2. Advanced Collaboration Features**
- **Group Project Management**: Shared task lists and progress tracking for team assignments
- **Peer Study Coordination**: Connect with classmates for shared deadlines and study sessions
- **Professor Integration**: Allow instructors to push assignments directly to student task lists

**3. Enhanced User Experience**
- **Mobile App**: Native iOS/Android applications with offline synchronization
- **Advanced Calendar Integration**: Import/export with Google Calendar, Apple Calendar
- **Customizable Themes**: Dark mode, high contrast, and personalized color schemes
- **Advanced Filtering**: Search, sort, and filter tasks by multiple criteria simultaneously

**4. Analytics & Insights**
- **Productivity Analytics**: Detailed reports on completion rates, time management efficiency
- **Stress Level Tracking**: Identify peak stress periods and suggest workload adjustments
- **Performance Trends**: Long-term tracking of academic performance correlation with task management

**5. Integration Capabilities**
- **University LMS Integration**: Connect with Moodle, Canvas, or local Vietnamese university systems
- **Cloud Synchronization**: Real database backend with cross-device synchronization
- **Third-party Integrations**: Notion, Todoist, Microsoft Teams integration for Vietnamese universities


### b. If you integrate AI APIs more for your app, what would you do?

**1. Natural Language Processing (OpenAI GPT/Claude)**
- **Smart Task Creation**: "I have a math assignment due next Friday" → automatically create task with proper course, date, and priority
- **Intelligent Task Breakdown**: Automatically split complex assignments into smaller, manageable subtasks
- **Academic Writing Assistant**: Help with essay planning, research task organization, and citation management
- **Vietnamese Language Support**: Process tasks and instructions in Vietnamese for better local user experience

**2. Computer Vision APIs**
- **Syllabus Parsing**: Upload course syllabi images/PDFs to automatically extract assignment deadlines and create tasks
- **Handwritten Note Recognition**: Scan handwritten task lists and convert them to digital format
- **Schedule Screenshot Import**: Import class schedules from university portals automatically

**3. Machine Learning Recommendations**
- **Personalized Study Time Prediction**: Use historical data to predict optimal study times for different subjects
- **Deadline Risk Assessment**: ML models to predict which assignments are most likely to be submitted late
- **Course Difficulty Estimation**: Analyze task completion patterns to estimate course workload and difficulty

**4. Conversational AI Integration**
- **Voice Task Management**: "Hey UniFlow, add Math homework due tomorrow with high priority"
- **Smart Chatbot Assistant**: Answer questions about upcoming deadlines, suggest study plans
- **Academic Planning Advisor**: Provide semester planning advice based on course load and personal patterns

**5. Context-Aware AI**
- **Location-Based Reminders**: Remind about library books when near the library, group meetings when on campus
- **Adaptive Notification Timing**: Learn optimal notification times based on user response patterns
- **Smart Focus Mode**: Automatically detect when user is studying and adjust notifications accordingly

**6. Predictive Analytics**
- **Stress Level Prediction**: Anticipate high-stress periods and suggest workload redistribution
- **Grade Impact Analysis**: Predict how missing deadlines might affect overall course grades
- **Study Group Matching**: AI-powered matching with classmates based on similar course schedules and study patterns


## ✅ Checklist
- [x] Code runs without errors  
- [x] All required features implemented (add/edit/delete/complete tasks)  
- [x] All ✍️ sections are filled  
- [x] Full CRUD operations on tasks and courses
- [x] Persistent storage using localStorage
- [x] Three different views of data (Dashboard, Courses, Calendar)
- [x] Time/date handling with date-fns library
- [x] Support for 20+ items with efficient rendering
- [x] AI features: Focus suggestions and deadline collision detection
- [x] Push notification system with backend server
- [x] Production deployment configuration  
