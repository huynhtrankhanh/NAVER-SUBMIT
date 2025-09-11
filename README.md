This is a comprehensive implementation of the UniFlow application, separated into a frontend (Client) and a backend (Server) as specified.

## Server (Node.js/Express/TypeScript - Notification Scheduler)

This simple server handles the scheduling and cancellation of notifications. It simulates sending a notification by logging it to the console.

**server/package.json**

```json
{
  "name": "uniflow-server",
  "version": "1.0.0",
  "description": "Notification scheduler for UniFlow",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "ts-node-dev src/index.ts"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^20.12.12",
    "@types/node-schedule": "^2.1.7",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.4.5"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.19.2",
    "node-schedule": "^2.1.1"
  }
}
```

**server/tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**server/src/index.ts**

```typescript
import express from 'express';
import cors from 'cors';
import schedule from 'node-schedule';

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// In-memory storage for scheduled jobs (Requirement 2: Persistent Storage - In-memory for notifications)
const scheduledJobs = new Map<string, schedule.Job>();

const sendNotification = (message: string) => {
  console.log(`🔔 Notification Sent: ${message}`);
  // In a real application, this is where you would integrate with
  // a push notification service (e.g., Firebase Cloud Messaging or Web Push API).
};

// POST /schedule (Requirement 7: Push Notification System)
app.post('/schedule', (req, res) => {
  const { taskId, message, time } = req.body;

  if (!taskId || !message || !time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const notificationTime = new Date(time);

  // Requirement 4: Time/Date Handling
  if (isNaN(notificationTime.getTime())) {
    return res.status(400).json({ error: 'Invalid time format' });
  }

  if (notificationTime <= new Date()) {
    // Don't schedule if the time is already passed.
    return res.status(200).json({ message: 'Notification time is in the past, not scheduled.' });
  }

  // Cancel existing job if rescheduling (Handles Update scenario)
  if (scheduledJobs.has(taskId)) {
    scheduledJobs.get(taskId)?.cancel();
    console.log(`🔄 Rescheduling job for task: ${taskId}`);
  }

  try {
    const job = schedule.scheduleJob(notificationTime, () => {
      sendNotification(message);
      scheduledJobs.delete(taskId); // Remove job after execution
    });

    if (job) {
      scheduledJobs.set(taskId, job);
      console.log(`✅ Scheduled notification for task ${taskId} at ${notificationTime}`);
      return res.status(201).json({ message: 'Notification scheduled successfully' });
    } else {
        return res.status(500).json({ error: 'Failed to schedule job.' });
    }

  } catch (error) {
    console.error('Error scheduling job:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /cancel (Handles Delete scenario)
app.post('/cancel', (req, res) => {
  const { taskId } = req.body;

  if (!taskId) {
    return res.status(400).json({ error: 'Missing taskId' });
  }

  if (scheduledJobs.has(taskId)) {
    scheduledJobs.get(taskId)?.cancel();
    scheduledJobs.delete(taskId);
    console.log(`❌ Cancelled notification for task: ${taskId}`);
    return res.status(200).json({ message: 'Notification cancelled successfully' });
  } else {
    // It's okay if the job wasn't found (e.g., already executed or never scheduled)
    return res.status(200).json({ message: 'No active notification found to cancel' });
  }
});

app.get('/', (req, res) => {
    res.send(`UniFlow Notification Server is running. Active jobs: ${scheduledJobs.size}`);
});

app.listen(PORT, () => {
  console.log(`🚀 UniFlow Notification Server listening on http://localhost:${PORT}`);
});
```

## Client (React/Vite/Tailwind/TypeScript)

This is the main application frontend.

**client/package.json**

```json
{
  "name": "uniflow-client",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@headlessui/react": "^2.0.4",
    "@heroicons/react": "^2.1.3",
    "date-fns": "^3.6.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.23.1",
    "uuid": "^10.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@types/uuid": "^9.0.8",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "typescript": "^5.2.2",
    "vite": "^5.2.0"
  }
}
```

**client/tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#4f46e5', // Indigo-600
        'primary-dark': '#4338ca', // Indigo-700
        'background': '#f9fafb', // Gray-50
        'surface': '#ffffff', // White
        'text-main': '#111827', // Gray-900
        'text-light': '#6b7280', // Gray-500
      }
    },
  },
  plugins: [],
}
```

**client/src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #f9fafb;
  color: #111827;
  min-height: 100vh;
}
```

**client/src/main.tsx**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { UniFlowProvider } from './contexts/UniFlowContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UniFlowProvider>
        <App />
      </UniFlowProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
```

**client/src/App.tsx**

```typescript
import { Route, Routes } from 'react-router-dom';
import Layout from './layouts/Layout';
import DashboardView from './views/DashboardView';
import CourseView from './views/CourseView';
import CalendarView from './views/CalendarView';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardView />} />
        <Route path="/courses" element={<CourseView />} />
        <Route path="/calendar" element={<CalendarView />} />
      </Routes>
    </Layout>
  );
}

export default App;
```

### Models

**client/src/models/types.ts**

```typescript
export enum Priority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
}

export interface Course {
  id: string;
  name: string;
  color: string; // Hex color code
}

export interface Task {
  id: string;
  title: string;
  courseId: string | null; // null if it's a general task.
  dueDate: string; // ISO string
  priority: Priority;
  isCompleted: boolean;
}

export interface AppState {
    courses: Course[];
    tasks: Task[];
}

// Interface for the AI analysis results
export interface AIAnalysis {
  focusTask: Task | null;
  deadlineCollisions: Record<string, Task[]>; // Key: Date string, Value: Array of tasks
}
```

### Services

**client/src/services/NotificationService.ts**

```typescript
import { Task } from "../models/types";
import { subMinutes, parseISO } from "date-fns";

// Ensure the backend server is running on this port
const API_URL = 'http://localhost:5001';

/**
 * Schedules a notification for a task.
 * We schedule it 15 minutes before the due date.
 */
export const scheduleNotification = async (task: Task): Promise<boolean> => {
  // Don't schedule notifications for completed tasks
  if (task.isCompleted) return false;

  const dueDate = parseISO(task.dueDate);
  // Schedule 15 minutes before the deadline (Requirement 4: Time/Date Handling)
  const notificationTime = subMinutes(dueDate, 15);

  // If the time is already passed, don't schedule (handled by backend too, but good practice here)
  if (notificationTime < new Date()) {
    return false;
  }

  const payload = {
    taskId: task.id,
    message: `Reminder: "${task.title}" is due in 15 minutes!`,
    time: notificationTime.toISOString(),
  };

  try {
    const response = await fetch(`${API_URL}/schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log(`Successfully scheduled notification for ${task.id}`);
      return true;
    } else {
      console.error('Failed to schedule notification:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('Error communicating with notification server:', error);
    return false;
  }
};

/**
 * Cancels a scheduled notification for a task.
 */
export const cancelNotification = async (taskId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskId }),
    });

    if (response.ok) {
      console.log(`Successfully cancelled or confirmed cancellation for ${taskId}`);
      return true;
    }
    else {
      console.error('Failed to cancel notification:', await response.text());
      return false;
    }
  } catch (error) {
    console.error('Error communicating with notification server:', error);
    return false;
  }
};
```

**client/src/services/StorageService.ts**

```typescript
import { AppState } from "../models/types";

const STORAGE_KEY = 'UniFlowData_V1';

// Requirement 2: Persistent Storage (localStorage)
export const saveState = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.error("Could not save state to localStorage", error);
  }
};

export const loadState = (): AppState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      // Return default initial state if nothing is stored
      return {
          courses: [],
          tasks: []
      };
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Could not load state from localStorage", error);
    return { courses: [], tasks: [] };
  }
};
```

### Contexts (State Management & Logic)

**client/src/contexts/UniFlowContext.tsx**

```typescript
import React, { createContext, useReducer, useEffect, useContext, ReactNode, useMemo } from 'react';
import { AppState, Task, Course, AIAnalysis } from '../models/types';
import { loadState, saveState } from '../services/StorageService';
import { scheduleNotification, cancelNotification } from '../services/NotificationService';
import { v4 as uuidv4 } from 'uuid';
import { analyzeTasks } from '../utils/aiUtils';

// --- Actions Definitions ---
type Action =
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string } // taskId
  | { type: 'ADD_COURSE'; payload: Course }
  | { type: 'UPDATE_COURSE'; payload: Course }
  | { type: 'DELETE_COURSE'; payload: string }; // courseId

// --- Reducer Function ---
// Handles the CRUD logic (Requirement 1: Full CRUD Operations)
const appReducer = (state: AppState, action: Action): AppState => {
  let newState: AppState;
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;

    case 'ADD_TASK':
      newState = { ...state, tasks: [...state.tasks, action.payload] };
      break;

    case 'UPDATE_TASK':
      newState = {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
      break;

    case 'DELETE_TASK':
      newState = {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
      break;

    case 'ADD_COURSE':
      newState = { ...state, courses: [...state.courses, action.payload] };
      break;

    case 'UPDATE_COURSE':
        newState = {
            ...state,
            courses: state.courses.map(course =>
                course.id === action.payload.id ? action.payload : course
            ),
        };
        break;

    case 'DELETE_COURSE':
      // When deleting a course, we also delete associated tasks for simplicity
      newState = {
        ...state,
        courses: state.courses.filter(course => course.id !== action.payload),
        tasks: state.tasks.filter(task => task.courseId !== action.payload),
      };
      break;
      
    default:
      return state;
  }

  // Persist state changes to localStorage
  saveState(newState);
  return newState;
};

// --- Context Definition ---
interface UniFlowContextType {
  state: AppState;
  analysis: AIAnalysis;
  addTask: (taskData: Omit<Task, 'id' | 'isCompleted'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  addCourse: (courseData: Omit<Course, 'id'>) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (courseId: string) => void;
  getCourseById: (id: string | null) => Course | null;
}

const UniFlowContext = createContext<UniFlowContextType | undefined>(undefined);

// --- Provider Component ---
export const UniFlowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, { courses: [], tasks: [] });

  // Load initial state from localStorage on mount
  useEffect(() => {
    const persistedState = loadState();
    dispatch({ type: 'LOAD_STATE', payload: persistedState });
  }, []);

  // AI Analysis Memoization (Requirement 6: Creativity & AI Integration)
  // Requirement 5: Support for 20+ Items (Memoization helps performance)
  const analysis = useMemo(() => analyzeTasks(state.tasks), [state.tasks]);

  // --- Helper Functions (Wrapping dispatch and handling side effects) ---

  const addTask = (taskData: Omit<Task, 'id' | 'isCompleted'>) => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      isCompleted: false,
    };
    dispatch({ type: 'ADD_TASK', payload: newTask });
    
    // Side effect: Schedule notification
    if (newTask.dueDate) {
        scheduleNotification(newTask);
    }
  };

  const updateTask = (updatedTask: Task) => {
    dispatch({ type: 'UPDATE_TASK', payload: updatedTask });

    // Side effect: Handle notification changes
    if (updatedTask.isCompleted) {
        // If marked complete, cancel the notification
        cancelNotification(updatedTask.id);
    } else if (updatedTask.dueDate) {
        // If incomplete and has a due date, reschedule (the API handles cancellation of the old one)
        scheduleNotification(updatedTask);
    }
  };

  const deleteTask = (taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
    // Side effect: Cancel notification
    cancelNotification(taskId);
  };

  const toggleTaskCompletion = (taskId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
        const updatedTask = { ...task, isCompleted: !task.isCompleted };
        updateTask(updatedTask); // Use updateTask to handle notification side effects
    }
  };

  const addCourse = (courseData: Omit<Course, 'id'>) => {
    const newCourse: Course = {
        ...courseData,
        id: uuidv4(),
    };
    dispatch({ type: 'ADD_COURSE', payload: newCourse });
  };

  const updateCourse = (course: Course) => {
    dispatch({ type: 'UPDATE_COURSE', payload: course });
  };

  const deleteCourse = (courseId: string) => {
    // Find tasks associated with this course to cancel their notifications before deletion
    const tasksToDelete = state.tasks.filter(task => task.courseId === courseId);
    tasksToDelete.forEach(task => cancelNotification(task.id));

    dispatch({ type: 'DELETE_COURSE', payload: courseId });
  };

  const getCourseById = (id: string | null): Course | null => {
    if (!id) return null;
    return state.courses.find(c => c.id === id) || null;
  };

  return (
    <UniFlowContext.Provider value={{ 
        state, 
        analysis,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        addCourse,
        updateCourse,
        deleteCourse,
        getCourseById
    }}>
      {children}
    </UniFlowContext.Provider>
  );
};

// Custom hook to use the context
export const useUniFlow = () => {
  const context = useContext(UniFlowContext);
  if (context === undefined) {
    throw new Error('useUniFlow must be used within a UniFlowProvider');
  }
  return context;
};
```

### Utilities

**client/src/utils/aiUtils.ts**

```typescript
import { Task, AIAnalysis, Priority } from '../models/types';
import { format, startOfDay, differenceInDays, parseISO } from 'date-fns';

const PRIORITY_WEIGHTS: Record<Priority, number> = {
  [Priority.High]: 10,
  [Priority.Medium]: 5,
  [Priority.Low]: 1,
};

/**
 * Calculates a score for a task based on priority and proximity to the deadline.
 */
const calculateTaskScore = (task: Task): number => {
  const priorityScore = PRIORITY_WEIGHTS[task.priority];
  const today = startOfDay(new Date());
  
  // Ensure the date string is parsed correctly
  const dueDate = startOfDay(parseISO(task.dueDate));

  const daysUntilDue = differenceInDays(dueDate, today);

  // Proximity score: Higher score for closer deadlines.
  let proximityScore = 0;
  if (daysUntilDue < 0) {
    proximityScore = 15; // Overdue tasks get highest boost
  } else if (daysUntilDue === 0) {
    proximityScore = 10; // Due today
  } else if (daysUntilDue <= 3) {
    proximityScore = 5;
  } else if (daysUntilDue <= 7) {
    proximityScore = 2;
  }

  return priorityScore + proximityScore;
};

/**
 * AI Feature 1: The "Focus Task" Suggester
 */
const determineFocusTask = (tasks: Task[]): Task | null => {
  const incompleteTasks = tasks.filter(t => !t.isCompleted);

  if (incompleteTasks.length === 0) {
    return null;
  }

  // Sort tasks by their calculated score (descending)
  // Requirement 5: Support for 20+ Items (Efficient sorting)
  const sortedTasks = [...incompleteTasks].sort((a, b) => {
    const scoreB = calculateTaskScore(b);
    const scoreA = calculateTaskScore(a);
    return scoreB - scoreA;
  });

  return sortedTasks[0];
};

/**
 * AI Feature 2: Proactive "Deadline Collision" Detection
 * Warns if 2+ high-priority tasks OR 4+ total tasks are due on the same day.
 */
const detectDeadlineCollisions = (tasks: Task[]): Record<string, Task[]> => {
  const incompleteTasks = tasks.filter(t => !t.isCompleted);

  // Group tasks by due date
  const groupedByDate: Record<string, Task[]> = {};
  incompleteTasks.forEach(task => {
    // Requirement 4: Time/Date Handling
    const dateKey = format(parseISO(task.dueDate), 'yyyy-MM-dd');
    if (!groupedByDate[dateKey]) {
      groupedByDate[dateKey] = [];
    }
    groupedByDate[dateKey].push(task);
  });

  // Filter out days that don't meet collision criteria
  const collisions: Record<string, Task[]> = {};
  Object.keys(groupedByDate).forEach(dateKey => {
    const dayTasks = groupedByDate[dateKey];
    const highPriorityCount = dayTasks.filter(t => t.priority === Priority.High).length;

    if (highPriorityCount >= 2 || dayTasks.length >= 4) {
        collisions[dateKey] = dayTasks;
    }
  });

  return collisions;
};

export const analyzeTasks = (tasks: Task[]): AIAnalysis => {
  return {
    focusTask: determineFocusTask(tasks),
    deadlineCollisions: detectDeadlineCollisions(tasks),
  };
};
```

### Layouts

**client/src/layouts/Layout.tsx**

```typescript
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, AcademicCapIcon, CalendarIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Hôm Nay (Dashboard)', href: '/', icon: HomeIcon },
  { name: 'Môn Học (Courses)', href: '/courses', icon: AcademicCapIcon },
  { name: 'Lịch Tuần (Calendar)', href: '/calendar', icon: CalendarIcon },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-surface shadow-lg flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">UniFlow</h1>
          <p className='text-sm font-normal text-text-light mt-1'>Master your semester.</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                `flex items-center p-3 text-base font-medium rounded-lg transition duration-150 ease-in-out
                ${isActive
                  ? 'bg-indigo-100 text-primary shadow-sm'
                  : 'text-text-light hover:bg-gray-100 hover:text-text-main'
                }`
              }
            >
              <item.icon className="w-6 h-6 mr-3" aria-hidden="true" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
```

### Components

**client/src/components/TaskItem.tsx**

```typescript
import React from 'react';
import { Task, Course, Priority } from '../models/types';
import { format, parseISO, isPast } from 'date-fns';
import { CheckCircleIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useUniFlow } from '../contexts/UniFlowContext';

interface TaskItemProps {
  task: Task;
  course?: Course | null;
  onEdit: (task: Task) => void;
}

const priorityClasses = {
  [Priority.High]: 'text-red-600 border-red-600 bg-red-100',
  [Priority.Medium]: 'text-amber-600 border-amber-600 bg-amber-100',
  [Priority.Low]: 'text-green-600 border-green-600 bg-green-100',
};

export const TaskItem: React.FC<TaskItemProps> = ({ task, course, onEdit }) => {
  const { toggleTaskCompletion, deleteTask } = useUniFlow();

  const dueDate = parseISO(task.dueDate);
  const isOverdue = isPast(dueDate) && !task.isCompleted;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
        deleteTask(task.id);
    }
  };

  return (
    <div className={`flex items-center justify-between p-4 bg-surface rounded-lg shadow-sm mb-3 transition duration-150 border ${task.isCompleted ? 'opacity-50' : 'hover:shadow-md'}`}>
      <div className="flex items-center">
        <button
          onClick={() => toggleTaskCompletion(task.id)}
          className="mr-4 text-gray-400 hover:text-primary transition duration-150"
          aria-label="Toggle completion"
        >
          {task.isCompleted ? (
            <CheckCircleIcon className="w-6 h-6 text-green-500" />
          ) : (
            <div className="w-6 h-6 border-2 border-gray-300 rounded-full hover:border-primary"></div>
          )}
        </button>
        <div>
          <p className={`text-lg font-medium ${task.isCompleted ? 'line-through text-text-light' : 'text-text-main'}`}>
            {task.title}
          </p>
          <div className="flex items-center text-sm text-text-light mt-1 space-x-4">
            {course ? (
                <span className='flex items-center'>
                    <span className='w-3 h-3 rounded-full mr-2' style={{backgroundColor: course.color}}></span>
                    {course.name}
                </span>
            ) : (
                <span>General</span>
            )}
            <span className={`${isOverdue ? 'text-red-600 font-semibold' : ''}`}>
                Due: {format(dueDate, 'MMM dd, p')}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {!task.isCompleted && (
             <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${priorityClasses[task.priority]}`}>
                {task.priority}
            </span>
        )}
       
        <button onClick={() => onEdit(task)} className="text-gray-400 hover:text-blue-500 transition duration-150 p-1">
            <PencilIcon className='w-5 h-5'/>
        </button>
        <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 transition duration-150 p-1">
            <TrashIcon className='w-5 h-5'/>
        </button>
      </div>
    </div>
  );
};
```

**client/src/components/TaskFormModal.tsx**

```typescript
import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Task, Course, Priority } from '../models/types';
import { useUniFlow } from '../contexts/UniFlowContext';
import { format, parseISO, addHours } from 'date-fns';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask?: Task | null;
  defaultCourseId?: string | null;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({ isOpen, onClose, initialTask, defaultCourseId = null }) => {
  const { state, addTask, updateTask } = useUniFlow();
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState<string | null>(defaultCourseId);
  // Initialize dueDate to 1 hour from now, formatted for datetime-local input
  const [dueDate, setDueDate] = useState(format(addHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm"));
  const [priority, setPriority] = useState<Priority>(Priority.Medium);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setCourseId(initialTask.courseId);
      // Ensure the stored ISO string is converted to the local format for the input
      setDueDate(format(parseISO(initialTask.dueDate), "yyyy-MM-dd'T'HH:mm"));
      setPriority(initialTask.priority);
    } else {
      // Reset form when opening for a new task
      setTitle('');
      setCourseId(defaultCourseId);
      setDueDate(format(addHours(new Date(), 1), "yyyy-MM-dd'T'HH:mm"));
      setPriority(Priority.Medium);
    }
  }, [initialTask, isOpen, defaultCourseId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Convert the input datetime-local string back to an ISO string for storage
    const isoDueDate = new Date(dueDate).toISOString();

    if (initialTask) {
      // Update existing task
      const updatedTask: Task = {
        ...initialTask,
        title,
        courseId,
        dueDate: isoDueDate,
        priority,
      };
      updateTask(updatedTask);
    } else {
      // Add new task
      addTask({
        title,
        courseId,
        dueDate: isoDueDate,
        priority,
      });
    }
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
              leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900 mb-6">
                  {initialTask ? 'Edit Task' : 'Add New Task'}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                  {/* Title Input */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border border-gray-300"
                      required
                    />
                  </div>

                  {/* Course Selector */}
                  <div>
                    <label htmlFor="course" className="block text-sm font-medium text-gray-700">Course</label>
                    <select
                      id="course"
                      value={courseId || 'general'}
                      onChange={(e) => setCourseId(e.target.value === 'general' ? null : e.target.value)}
                      className="mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border border-gray-300"
                    >
                      <option value="general">General</option>
                      {state.courses.map((course: Course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </div>

                <div className='grid grid-cols-2 gap-4'>
                  {/* Due Date Input */}
                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input
                      type="datetime-local"
                      id="dueDate"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border border-gray-300"
                      required
                    />
                  </div>

                  {/* Priority Selector */}
                  <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
                    <select
                      id="priority"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as Priority)}
                      className="mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border border-gray-300"
                    >
                      <option value={Priority.High}>High</option>
                      <option value={Priority.Medium}>Medium</option>
                      <option value={Priority.Low}>Low</option>
                    </select>
                  </div>
                </div>

                  {/* Actions */}
                  <div className="mt-8 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none"
                    >
                      {initialTask ? 'Save Changes' : 'Add Task'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
```

**client/src/components/CourseFormModal.tsx**

```typescript
import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Course } from '../models/types';
import { useUniFlow } from '../contexts/UniFlowContext';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourse?: Course | null;
}

const DEFAULT_COLOR = '#4f46e5'; // primary color

export const CourseFormModal: React.FC<CourseFormModalProps> = ({ isOpen, onClose, initialCourse }) => {
  const { addCourse, updateCourse } = useUniFlow();
  const [name, setName] = useState('');
  const [color, setColor] = useState(DEFAULT_COLOR);

  useEffect(() => {
    if (initialCourse) {
      setName(initialCourse.name);
      setColor(initialCourse.color);
    } else {
      // Reset form when opening for a new course
      setName('');
      setColor(DEFAULT_COLOR);
    }
  }, [initialCourse, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (initialCourse) {
      // Update existing course
      const updatedCourse: Course = {
        ...initialCourse,
        name,
        color,
      };
      updateCourse(updatedCourse);
    } else {
      // Add new course
      addCourse({
        name,
        color,
      });
    }
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
            as={Fragment}
            enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100"
            leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
            <div className="fixed inset-0 bg-black bg-opacity-30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
                as={Fragment}
                enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900 mb-6">
                  {initialCourse ? 'Edit Course' : 'Add New Course'}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                  {/* Name Input */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Course Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border border-gray-300"
                      required
                    />
                  </div>

                  {/* Color Picker */}
                  <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                      Color Tag
                    </label>
                    <input
                      type="color"
                      id="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="mt-1 block h-10 w-20 cursor-pointer rounded-md border-gray-300 shadow-sm"
                    />
                  </div>

                  {/* Actions */}
                  <div className="mt-8 flex justify-end space-x-3">
                    <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark focus:outline-none"
                    >
                        {initialCourse ? 'Save Changes' : 'Add Course'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
```

### Views

**client/src/views/DashboardView.tsx**

```typescript
import React, { useState } from 'react';
import { useUniFlow } from '../contexts/UniFlowContext';
import { TaskItem } from '../components/TaskItem';
import { TaskFormModal } from '../components/TaskFormModal';
import { Task } from '../models/types';
import { isToday, isTomorrow, parseISO, format } from 'date-fns';
import { LightBulbIcon, ExclamationTriangleIcon, PlusIcon } from '@heroicons/react/24/outline';

// View 1: Dashboard View ("Hôm Nay")
const DashboardView: React.FC = () => {
  const { state, analysis, getCourseById } = useUniFlow();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const { focusTask, deadlineCollisions } = analysis;

  // Filter tasks for the dashboard
  const todayTasks = state.tasks.filter(t => isToday(parseISO(t.dueDate)));
  const tomorrowTasks = state.tasks.filter(t => isTomorrow(parseISO(t.dueDate)));

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  }

  return (
    <div className="space-y-8">
      <div className='flex justify-between items-center'>
        <h1 className="text-3xl font-bold text-text-main">Hôm Nay (Dashboard)</h1>
        <button
            onClick={handleAddNew}
            className="flex items-center bg-primary text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary-dark transition duration-150"
        >
            <PlusIcon className='w-5 h-5 mr-2'/>
            Add Task
        </button>
      </div>

      {/* AI Insights Section (Requirement 6) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* AI Feature 1: Focus Task Suggester */}
        <div className="bg-surface p-6 rounded-xl shadow-lg border border-indigo-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-primary">
            <LightBulbIcon className='w-6 h-6 mr-2'/>
            AI Focus Suggestion
          </h2>
          {focusTask ? (
            <div>
              <p className="text-text-light mb-4">Based on priority and deadlines, you should focus on this task next:</p>
              <div className='border-l-4 pl-4 py-2 bg-gray-50 rounded-lg' style={{borderColor: getCourseById(focusTask.courseId)?.color || '#9ca3af'}}>
                <p className="text-lg font-medium">{focusTask.title}</p>
                <p className='text-sm text-text-light mt-1'>{getCourseById(focusTask.courseId)?.name || 'General'} - Due: {format(parseISO(focusTask.dueDate), 'p')}</p>
              </div>
            </div>
          ) : (
            <p className="text-text-light italic">No tasks pending. Great job!</p>
          )}
        </div>

        {/* AI Feature 2: Deadline Collision Detection */}
        <div className="bg-surface p-6 rounded-xl shadow-lg border border-amber-100">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-amber-600">
            <ExclamationTriangleIcon className='w-6 h-6 mr-2'/>
            Deadline Collision Alert
          </h2>
          {Object.keys(deadlineCollisions).length > 0 ? (
            <div className='space-y-3'>
              <p className="text-text-light mb-4">Warning: You have busy days ahead with multiple or high-priority tasks.</p>
              {Object.entries(deadlineCollisions).map(([date, tasks]) => (
                <div key={date} className='bg-amber-50 p-3 rounded-lg border border-amber-200'>
                  <p className='font-semibold text-amber-800'>{format(parseISO(date), 'MMMM dd')}: {tasks.length} tasks due.</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-light italic">No immediate deadline conflicts detected.</p>
          )}
        </div>
      </div>

      {/* Today's Tasks */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Due Today</h2>
        {todayTasks.length > 0 ? (
          todayTasks.map(task => (
            <TaskItem key={task.id} task={task} course={getCourseById(task.courseId)} onEdit={handleEdit} />
          ))
        ) : (
          <p className="text-text-light p-4 bg-surface rounded-lg shadow-sm border">No tasks due today.</p>
        )}
      </section>

      {/* Tomorrow's Tasks */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Due Tomorrow</h2>
        {tomorrowTasks.length > 0 ? (
          tomorrowTasks.map(task => (
            <TaskItem key={task.id} task={task} course={getCourseById(task.courseId)} onEdit={handleEdit} />
          ))
        ) : (
            <p className="text-text-light p-4 bg-surface rounded-lg shadow-sm border">No tasks due tomorrow.</p>
        )}
      </section>

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialTask={taskToEdit}
      />
    </div>
  );
};

export default DashboardView;
```

**client/src/views/CourseView.tsx**

```typescript
import React, { useState } from 'react';
import { useUniFlow } from '../contexts/UniFlowContext';
import { TaskItem } from '../components/TaskItem';
import { TaskFormModal } from '../components/TaskFormModal';
import { CourseFormModal } from '../components/CourseFormModal';
import { Task, Course } from '../models/types';
import { PlusIcon, PencilIcon, TrashIcon, InboxIcon } from '@heroicons/react/24/outline';

// View 2: Course View ("Môn Học")
const CourseView: React.FC = () => {
  const { state, deleteCourse } = useUniFlow();
  // 'general' means null courseId, otherwise it's the course.id
  const [selectedCourseId, setSelectedCourseId] = useState<string | 'general'>('general');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);

  const filteredTasks = state.tasks.filter(task => {
    if (selectedCourseId === 'general') {
      return task.courseId === null;
    }
    return task.courseId === selectedCourseId;
  });

  const selectedCourse = state.courses.find(c => c.id === selectedCourseId);

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleAddTask = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  }

  const handleAddCourse = () => {
    setCourseToEdit(null);
    setIsCourseModalOpen(true);
  }

  const handleEditCourse = (course: Course) => {
    setCourseToEdit(course);
    setIsCourseModalOpen(true);
  }

  const handleDeleteCourse = (courseId: string) => {
    if (window.confirm("Are you sure you want to delete this course? All associated tasks will also be deleted.")) {
        deleteCourse(courseId);
        // If the deleted course was selected, switch back to General
        if (selectedCourseId === courseId) {
            setSelectedCourseId('general');
        }
    }
  }

  return (
    <div className="flex h-full gap-8">
      <h1 className="text-3xl font-bold text-text-main mb-6 sr-only">Môn Học (Courses)</h1>

      {/* Course List Sidebar */}
      <div className="w-64">
        <div className='flex justify-between items-center mb-4'>
            <h2 className="text-xl font-semibold">My Courses</h2>
            <button onClick={handleAddCourse} title="Add New Course" className='text-primary hover:text-primary-dark transition p-1'>
                <PlusIcon className='w-6 h-6'/>
            </button>
        </div>
        
        <nav className="space-y-2 bg-surface p-4 rounded-xl shadow-lg">
          {/* General Category */}
          <button
            onClick={() => setSelectedCourseId('general')}
            className={`w-full flex items-center p-3 text-left rounded-lg transition duration-150 ${
              selectedCourseId === 'general'
                ? 'bg-gray-200 text-text-main font-medium shadow-sm'
                : 'text-text-light hover:bg-gray-100'
            }`}
          >
            <InboxIcon className='w-5 h-5 mr-3'/>
            General
          </button>

          <hr className='my-2'/>

          {/* User Courses */}
          {state.courses.map((course) => (
            <div key={course.id} className='group flex items-center'>
                <button
                onClick={() => setSelectedCourseId(course.id)}
                className={`flex-1 flex items-center p-3 text-left rounded-lg transition duration-150 ${
                    selectedCourseId === course.id
                    ? 'font-medium shadow-sm'
                    : 'text-text-light hover:bg-gray-100'
                }`}
                style={selectedCourseId === course.id ? { backgroundColor: `${course.color}20`, color: course.color } : {}}

                >
                <span className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: course.color }}></span>
                <span className='truncate'>{course.name}</span>
                </button>
                {/* Edit/Delete buttons visible on hover */}
                <div className='flex space-x-2 ml-2 opacity-0 group-hover:opacity-100 transition duration-150 pr-2'>
                    <button onClick={() => handleEditCourse(course)} className='text-gray-400 hover:text-blue-500'>
                        <PencilIcon className='w-4 h-4'/>
                    </button>
                    <button onClick={() => handleDeleteCourse(course.id)} className='text-gray-400 hover:text-red-500'>
                        <TrashIcon className='w-4 h-4'/>
                    </button>
                </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Task List Area */}
      <div className="flex-1">
        <div className='flex justify-between items-center mb-6'>
            <h2 className="text-3xl font-bold">
                {selectedCourseId === 'general' ? 'General Tasks' : selectedCourse?.name}
            </h2>
            <button
                onClick={handleAddTask}
                className="flex items-center bg-primary text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary-dark transition duration-150"
            >
                <PlusIcon className='w-5 h-5 mr-2'/>
                Add Task
            </button>
        </div>

        {filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskItem 
                key={task.id} 
                task={task} 
                course={selectedCourse} 
                onEdit={handleEditTask} 
            />
          ))
        ) : (
          <p className="text-text-light italic mt-4 p-4 bg-surface rounded-lg shadow-sm border">No tasks found for this category. Add one!</p>
        )}
      </div>

      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        initialTask={taskToEdit}
        defaultCourseId={selectedCourseId === 'general' ? null : selectedCourseId}
      />
      <CourseFormModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        initialCourse={courseToEdit}
       />
    </div>
  );
};

export default CourseView;
```

**client/src/views/CalendarView.tsx**

```typescript
import React, { useState } from 'react';
import { useUniFlow } from '../contexts/UniFlowContext';
import { startOfWeek, addDays, format, isSameDay, parseISO, isToday } from 'date-fns';
import { Task } from '../models/types';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

// View 3: Calendar View ("Lịch Tuần")
const CalendarView: React.FC = () => {
  const { state, getCourseById } = useUniFlow();
  const [currentDate, setCurrentDate] = useState(new Date());

  const startDay = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start week on Monday

  const days = Array.from({ length: 7 }).map((_, i) => addDays(startDay, i));

  const getTasksForDay = (date: Date): Task[] => {
    return state.tasks
        .filter(task => isSameDay(parseISO(task.dueDate), date))
        .sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime());
  };

  const getCourseColor = (courseId: string | null): string => {
    if (!courseId) return '#9ca3af'; // Gray for General
    const course = getCourseById(courseId);
    return course ? course.color : '#9ca3af';
  };

  const goToPreviousWeek = () => {
    setCurrentDate(prev => addDays(prev, -7));
  };

  const goToNextWeek = () => {
    setCurrentDate(prev => addDays(prev, 7));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-text-main">Lịch Tuần (Weekly Calendar)</h1>

            <div className="flex items-center space-x-4">
                <button onClick={goToToday} className="px-4 py-2 bg-surface border rounded-lg shadow-sm hover:bg-gray-100 transition duration-150">
                    Today
                </button>
                <button onClick={goToPreviousWeek} className="p-2 bg-surface border rounded-full shadow-sm hover:bg-gray-100 transition duration-150">
                    <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <span className='text-lg font-medium w-60 text-center'>
                    {format(startDay, 'MMM d')} – {format(addDays(startDay, 6), 'MMM d, yyyy')}
                </span>
                <button onClick={goToNextWeek} className="p-2 bg-surface border rounded-full shadow-sm hover:bg-gray-100 transition duration-150">
                    <ChevronRightIcon className="w-5 h-5" />
                </button>
            </div>
        </div>

      
      <div className="grid grid-cols-7 gap-4 bg-surface shadow-xl rounded-xl p-6">
        {/* Header Row */}
        {days.map(day => (
          <div key={day.toString()} className="text-center font-semibold p-2 border-b-2">
            {format(day, 'EEE, MMM d')}
          </div>
        ))}

        {/* Day Columns */}
        {days.map(day => (
          <div 
            key={day.toString()} 
            // Requirement 5: Support for 20+ Items (DOM is kept light by only rendering visible week)
            className={`min-h-[500px] border-r border-gray-100 p-2 space-y-3 overflow-y-auto ${isToday(day) ? 'bg-indigo-50' : ''}`}
          >
            {getTasksForDay(day).map(task => (
              <div
                key={task.id}
                // Requirement 5: Proper use of `key` props
                className={`p-3 rounded-lg shadow-sm border-l-4 ${task.isCompleted ? 'opacity-50 bg-gray-100' : 'bg-white'}`}
                style={{ borderLeftColor: getCourseColor(task.courseId) }}
              >
                <p className={`text-sm font-medium ${task.isCompleted ? 'line-through' : ''}`}>{task.title}</p>
                <p className="text-xs text-text-light mt-1">
                  {format(parseISO(task.dueDate), 'p')}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;
```
