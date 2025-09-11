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