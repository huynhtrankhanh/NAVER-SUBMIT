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