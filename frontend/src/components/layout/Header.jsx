import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();

  const getUserLink = () => {
    if (!user) return "/login";
    if (isAdmin) return "/admin/dashboard";
    return "/orders";
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-[1050] bg-white/60 backdrop-blur-xl border-b border-outline-variant/10">
      <div className="px-4 md:px-12 h-20 grid grid-cols-3 items-center">
        
        {/* Left: Desktop Nav & Mobile Toggle */}
        <div className="flex items-center">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden border-0 p-0 bg-transparent flex items-center mr-4"
          >
            <span className="material-symbols-outlined text-on-surface text-[24px]">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
          
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link to="/products" className="font-label text-[9px] lg:text-[10px] tracking-widest text-on-surface border-b border-on-surface pb-1">BỘ SƯU TẬP</Link>
            <Link to="/products" className="font-label text-[9px] lg:text-[10px] tracking-widest text-on-surface-variant hover:text-on-surface transition-colors">DANH MỤC</Link>
            <Link to="/" className="font-label text-[9px] lg:text-[10px] tracking-widest text-on-surface-variant hover:text-on-surface transition-colors">CÂU CHUYỆN</Link>
            <Link to="/products" className="font-label text-[9px] lg:text-[10px] tracking-widest text-on-surface-variant hover:text-on-surface transition-colors">LƯU TRỮ</Link>
          </div>
        </div>

        {/* Center: Brand Logo */}
        <div className="flex justify-center">
          <Link to="/" className="no-underline">
            <h1 className="m-0 text-on-surface font-headline text-lg md:text-2xl tracking-[0.3em] uppercase whitespace-nowrap font-light">
              THE ATELIER
            </h1>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex justify-end items-center gap-3 md:gap-8">
          <div className="hidden lg:flex items-center relative group">
            <span className="material-symbols-outlined absolute left-0 text-on-surface-variant text-[16px] group-focus-within:text-secondary">search</span>
            <input 
              type="text"
              placeholder="TÌM KIẾM"
              className="bg-transparent border-0 border-b border-transparent focus:border-outline-variant/30 focus:outline-none pl-6 py-1 font-label text-[10px] w-24 focus:w-40 transition-all duration-500 uppercase"
            />
          </div>
          
          <Link to="/cart" className="text-on-surface hover:text-secondary transition-colors relative flex items-center">
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 text-[9px] bg-secondary text-white w-4 h-4 flex items-center justify-center rounded-full font-label font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          
          {/* Account Icon with Hover Dropdown */}
          <div className="relative group flex items-center h-full">
            <Link to={getUserLink()} className="text-on-surface hover:text-secondary transition-colors flex items-center py-2">
              <span className="material-symbols-outlined text-[20px]">person</span>
            </Link>
            
            {/* Hover Dropdown */}
            <div className="absolute right-0 top-full mt-0 pt-4 w-60 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
              <div className="bg-white border border-neutral-900/[0.06] shadow-[0_15px_40px_rgba(0,0,0,0.06)] p-6 space-y-4">
                {user ? (
                  <>
                    <div className="pb-3 border-b border-neutral-900/[0.05]">
                      <p className="font-sans text-[10px] text-neutral-400 tracking-wider uppercase mb-1">Tài khoản</p>
                      <p className="font-serif text-sm text-neutral-800 italic truncate font-medium">
                        {user.name || user.email}
                      </p>
                    </div>
                    
                    <div className="space-y-3 pt-1">
                      {isAdmin && (
                        <Link 
                          to="/admin/dashboard" 
                          className="flex items-center gap-2 font-label text-[9px] tracking-[0.2em] text-neutral-600 hover:text-neutral-950 transition-colors uppercase"
                        >
                          <span className="material-symbols-outlined text-[16px]">dashboard</span>
                          Quản lý Admin
                        </Link>
                      )}
                      
                      <Link 
                        to="/orders" 
                        className="flex items-center gap-2 font-label text-[9px] tracking-[0.2em] text-neutral-600 hover:text-neutral-950 transition-colors uppercase"
                      >
                        <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                        Lịch sử mua hàng
                      </Link>
                      
                      <button 
                        onClick={logout} 
                        className="w-full flex items-center gap-2 font-label text-[9px] tracking-[0.2em] text-rose-600 hover:text-rose-800 transition-colors bg-transparent border-0 p-0 text-left uppercase"
                      >
                        <span className="material-symbols-outlined text-[16px]">logout</span>
                        Đăng xuất
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="pb-2 border-b border-neutral-900/[0.05]">
                      <p className="font-serif text-xs text-neutral-500 italic">Chào mừng quý khách đến với The Atelier.</p>
                    </div>
                    <div className="space-y-3 pt-2">
                      <Link 
                        to="/login" 
                        className="flex items-center gap-2 font-label text-[9px] tracking-[0.2em] text-neutral-600 hover:text-neutral-950 transition-colors uppercase"
                      >
                        <span className="material-symbols-outlined text-[16px]">login</span>
                        Đăng nhập
                      </Link>
                      <Link 
                        to="/register" 
                        className="flex items-center gap-2 font-label text-[9px] tracking-[0.2em] text-neutral-600 hover:text-neutral-950 transition-colors uppercase"
                      >
                        <span className="material-symbols-outlined text-[16px]">person_add</span>
                        Đăng ký tài khoản
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out border-t border-outline-variant/5 bg-white ${isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-8 py-10 space-y-8">
          <div className="flex flex-col gap-6">
            <Link to="/products" className="font-label text-[11px] tracking-[0.2em] text-on-surface no-underline" onClick={() => setIsMenuOpen(false)}>BỘ SƯU TẬP</Link>
            <Link to="/products" className="font-label text-[11px] tracking-[0.2em] text-on-surface no-underline" onClick={() => setIsMenuOpen(false)}>DANH MỤC</Link>
            <Link to="/" className="font-label text-[11px] tracking-[0.2em] text-on-surface no-underline" onClick={() => setIsMenuOpen(false)}>CÂU CHUYỆN</Link>
            <Link to="/products" className="font-label text-[11px] tracking-[0.2em] text-on-surface no-underline" onClick={() => setIsMenuOpen(false)}>LƯU TRỮ</Link>
          </div>
          
          <hr className="border-outline-variant/10" />
          
          <div className="flex flex-col gap-6">
            <button className="flex items-center gap-3 text-on-surface-variant font-label text-[10px] tracking-[0.2em] bg-transparent border-0 p-0">
              <span className="material-symbols-outlined text-[18px]">search</span>
              TÌM KIẾM
            </button>
            <Link to={getUserLink()} className="flex items-center gap-3 text-on-surface-variant font-label text-[10px] tracking-[0.2em] no-underline">
              <span className="material-symbols-outlined text-[18px]">person</span>
              {user ? (isAdmin ? 'BẢNG ĐIỀU KHIỂN' : 'TÀI KHOẢN') : 'ĐĂNG NHẬP'}
            </Link>
            {user && (
              <button onClick={logout} className="flex items-center gap-3 text-on-surface-variant font-label text-[10px] tracking-[0.2em] bg-transparent border-0 p-0 hover:text-error transition-colors">
                <span className="material-symbols-outlined text-[18px]">logout</span>
                ĐĂNG XUẤT
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
