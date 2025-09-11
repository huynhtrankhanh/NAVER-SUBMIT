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