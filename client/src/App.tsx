import { Route, Routes } from 'react-router-dom';
import Layout from './layouts/Layout';
import DashboardView from './views/DashboardView';
import CourseView from './views/CourseView';
import CalendarView from './views/CalendarView';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardView />} />
        <Route path="/courses" element={<CourseView />} />
        <Route path="/calendar" element={<CalendarView />} />
      </Routes>
    </Layout>
  );
}

export default App;