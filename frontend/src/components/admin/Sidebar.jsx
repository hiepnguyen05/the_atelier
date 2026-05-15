import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Tổng quan', icon: 'dashboard', path: '/admin/dashboard' },
  { name: 'Sản phẩm', icon: 'straighten', path: '/admin/products' },
  { name: 'Danh mục', icon: 'category', path: '/admin/categories' },
  { name: 'Đơn hàng', icon: 'shopping_bag', path: '/admin/orders' },
  { name: 'Khách hàng', icon: 'group', path: '/admin/customers' },
  { name: 'Thống kê', icon: 'analytics', path: '/admin/analytics' },
  { name: 'Cài đặt', icon: 'settings', path: '/admin/settings' },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-on-background/20 backdrop-blur-sm z-[60] md:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`bg-surface-container dark:bg-on-background rounded-none h-screen w-64 fixed left-0 top-0 flex flex-col py-8 px-6 z-[70] border-r border-outline-variant/10 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="mb-12">
        <h1 className="font-headline text-2xl tracking-widest text-on-surface dark:text-on-primary uppercase mb-1">The Atelier</h1>
        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-on-surface-variant opacity-60">Hệ thống Quản trị</p>
      </div>
      <nav className="flex flex-col gap-y-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 transition-all group ${
                isActive
                  ? 'text-secondary dark:text-secondary-fixed font-bold border-r-2 border-secondary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <span 
                className={`material-symbols-outlined text-xl`} 
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              <span className="font-body uppercase tracking-widest text-[11px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-8 border-t border-outline-variant/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-surface-container-highest flex items-center justify-center overflow-hidden">
            <img
              alt="Admin User Profile"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuABxJi7AGZgFw9cTvMKzND88MOanBWS2pcJxA_8j-I4g-T0L3sCT_Ey3e1cdDcWBQ4MBExZmrpUXMtzusy8N0iGsdpqtCizEzJ2eia6xSNA3ZI7IsJRw5DWWPbNDGaMC4oA64r4rMsLpYywCqJkCx18M9U78GIG485Gq4SsbjqDGKXGl79tMxmR7N-wDnITy5-ssbvPbt7R9B7DvUekQpU70uVZchvjpelcYdXTysXjfaEFrbFlRWYRCb0DPR92eLtzPJVuA0G8huo"
            />
          </div>
          <div>
            <p className="font-body text-[11px] font-bold uppercase tracking-wider">Admin User</p>
            <p className="font-body text-[9px] text-on-surface-variant tracking-tighter">Quản trị viên cao cấp</p>
          </div>
        </div>
      </div>
      </aside>
    </>
  );
};

export default Sidebar;
