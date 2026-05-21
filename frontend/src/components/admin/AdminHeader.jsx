import React from 'react';
import { Link } from 'react-router-dom';

const AdminHeader = ({ title = "TÌM KIẾM...", onMenuOpen }) => {
  return (
    <header className="bg-surface/80 backdrop-blur-md rounded-none w-full sticky top-0 z-40 flex justify-between items-center px-6 md:px-12 py-6 md:ml-64 md:max-w-[calc(100%-16rem)] border-b border-outline-variant/10">
      <button 
        onClick={onMenuOpen}
        className="mr-4 text-on-surface-variant md:hidden"
      >
        <span className="material-symbols-outlined">menu</span>
      </button>
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant/40 text-lg">search</span>
          <input
            className="w-full bg-transparent border-b border-outline-variant/40 py-1 pl-8 pr-4 font-label text-[10px] tracking-widest focus:outline-none focus:border-primary transition-colors"
            placeholder={title}
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-8">
        <Link 
          to="/"
          className="flex items-center gap-2 border border-outline-variant/30 px-3 py-1.5 text-on-surface-variant hover:text-secondary hover:border-secondary transition-all font-label text-[10px] tracking-widest uppercase"
        >
          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          Xem cửa hàng
        </Link>
        <button className="relative hover:opacity-70 transition-opacity">
          <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
          <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-secondary rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity">
          <span className="font-label text-[11px] uppercase tracking-widest font-bold">Hồ sơ</span>
          <span className="material-symbols-outlined text-on-surface-variant">account_circle</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
