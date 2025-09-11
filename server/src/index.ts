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