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