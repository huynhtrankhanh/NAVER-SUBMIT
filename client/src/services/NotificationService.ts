import { Task } from "../models/types";
import { subMinutes, parseISO } from "date-fns";

// Ensure the backend server is running on this port
// In production, API calls will be made to the same host/port as the client
// Vite replaces import.meta.env.PROD at build time
const API_URL = import.meta.env.PROD ? '' : 'http://localhost:5001';

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
    const response = await fetch(`${API_URL}/api/schedule`, {
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
    const response = await fetch(`${API_URL}/api/cancel`, {
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