import React, { useState } from 'react';
import Sidebar from '../components/admin/Sidebar';
import AdminHeader from '../components/admin/AdminHeader';

const AdminLayout = ({ children, searchPlaceholder }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-surface min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <AdminHeader 
        title={searchPlaceholder} 
        onMenuOpen={() => setIsSidebarOpen(true)} 
      />
      <main className="md:ml-64 p-6 md:p-12 pt-8 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
