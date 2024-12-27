import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from './main/Navbar';
import Sidebar from './main/Sidebar';

export default function MainLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main
          className={`flex-1 overflow-y-auto relative top-16 ${
            isSidebarCollapsed ? 'ml-20' : 'ml-64'
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
