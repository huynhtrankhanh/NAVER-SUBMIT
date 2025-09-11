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