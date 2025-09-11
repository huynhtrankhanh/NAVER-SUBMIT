import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, AcademicCapIcon, CalendarIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Hôm Nay (Dashboard)', href: '/', icon: HomeIcon },
  { name: 'Môn Học (Courses)', href: '/courses', icon: AcademicCapIcon },
  { name: 'Lịch Tuần (Calendar)', href: '/calendar', icon: CalendarIcon },
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-surface shadow-lg flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary">UniFlow</h1>
          <p className='text-sm font-normal text-text-light mt-1'>Master your semester.</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === '/'}
              className={({ isActive }) =>
                `flex items-center p-3 text-base font-medium rounded-lg transition duration-150 ease-in-out
                ${isActive
                  ? 'bg-indigo-100 text-primary shadow-sm'
                  : 'text-text-light hover:bg-gray-100 hover:text-text-main'
                }`
              }
            >
              <item.icon className="w-6 h-6 mr-3" aria-hidden="true" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;