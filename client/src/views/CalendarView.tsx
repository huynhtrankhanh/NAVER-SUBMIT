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