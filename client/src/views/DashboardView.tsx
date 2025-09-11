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