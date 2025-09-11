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