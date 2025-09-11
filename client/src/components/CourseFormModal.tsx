import React, { useState, useEffect, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Course } from '../models/types';
import { useUniFlow } from '../contexts/UniFlowContext';

interface CourseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCourse?: Course | null;
}

const DEFAULT_COLOR = '#4f46e5'; // primary color

export const CourseFormModal: React.FC<CourseFormModalProps> = ({ isOpen, onClose, initialCourse }) => {
  const { addCourse, updateCourse } = useUniFlow();
  const [name, setName] = useState('');
  const [color, setColor] = useState(DEFAULT_COLOR);

  useEffect(() => {
    if (initialCourse) {
      setName(initialCourse.name);
      setColor(initialCourse.color);
    } else {
      // Reset form when opening for a new course
      setName('');
      setColor(DEFAULT_COLOR);
    }
  }, [initialCourse, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (initialCourse) {
      // Update existing course
      const updatedCourse: Course = {
        ...initialCourse,
        name,
        color,
      };
      updateCourse(updatedCourse);
    } else {
      // Add new course
      addCourse({
        name,
        color,
      });
    }
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* Overlay */}
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900 mb-6">
                  {initialCourse ? 'Edit Course' : 'Add New Course'}
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-6">
                  {/* Name Input */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Course Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 block w-full rounded-md shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2 border border-gray-300"
                      required
                    />
                  </div>

                  {/* Color Picker */}
                  <div>
                    <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                      Color Tag
                    </label>
                    <input
                      type="color"
                      id="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="mt-1 block h-10 w-20 cursor-pointer rounded-md border-gray-300 shadow-sm"
                    />
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
                        {initialCourse ? 'Save Changes' : 'Add Course'}
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