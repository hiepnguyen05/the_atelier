import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="py-20 md:py-32 bg-surface-container-low border-t border-outline-variant/10">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-24">
          
          {/* Logo & About */}
          <div className="md:col-span-4">
            <h4 className="font-headline text-2xl italic mb-8 text-on-surface">THE ATELIER</h4>
            <p className="text-on-surface-variant font-body text-sm leading-relaxed max-w-xs font-light">
              Kiến tạo một thế giới của sự xa xỉ tĩnh lặng thông qua thiết kế có chủ đích và sự tinh xảo của nghệ nhân.
            </p>
            <div className="flex gap-6 mt-10">
              <a href="#" className="text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[20px]">public</span>
              </a>
              <a href="#" className="text-on-surface-variant hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined text-[20px]">share</span>
              </a>
            </div>
          </div>

          {/* Navigation & Social */}
          <div className="md:col-span-4">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <span className="font-label text-on-surface-variant mb-6 block text-[10px] font-bold">ĐIỀU HƯỚNG</span>
                <ul className="space-y-4 list-none p-0">
                  <li><Link to="/" className="font-label text-[10px] text-on-surface no-underline hover:text-secondary transition-colors">BỘ SƯU TẬP</Link></li>
                  <li><Link to="/" className="font-label text-[10px] text-on-surface no-underline hover:text-secondary transition-colors">DANH MỤC</Link></li>
                  <li><Link to="/" className="font-label text-[10px] text-on-surface no-underline hover:text-secondary transition-colors">TẬP SAN</Link></li>
                  <li><Link to="/" className="font-label text-[10px] text-on-surface no-underline hover:text-secondary transition-colors">LƯU TRỮ</Link></li>
                </ul>
              </div>
              <div>
                <span className="font-label text-on-surface-variant mb-6 block text-[10px] font-bold">MẠNG XÃ HỘI</span>
                <ul className="space-y-4 list-none p-0">
                  <li><a href="#" className="font-label text-[10px] text-on-surface no-underline hover:text-secondary transition-colors">INSTAGRAM</a></li>
                  <li><a href="#" className="font-label text-[10px] text-on-surface no-underline hover:text-secondary transition-colors">PINTEREST</a></li>
                  <li><a href="#" className="font-label text-[10px] text-on-surface no-underline hover:text-secondary transition-colors">LIÊN HỆ</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter / Secondary Links */}
          <div className="md:col-span-4 md:text-right">
            <span className="font-label text-on-surface-variant mb-6 block text-[10px] font-bold">VĂN PHÒNG CHÍNH</span>
            <p className="text-on-surface-variant font-body text-sm leading-relaxed mb-8 max-w-[200px] md:ml-auto">
              Tầng 12, Tòa nhà Nghệ thuật, Quận 1, TP. Hồ Chí Minh, Việt Nam
            </p>
            <div className="flex gap-4 md:justify-end">
              <a href="#" className="font-label text-[9px] text-on-surface-variant hover:text-on-surface transition-colors no-underline">TUYỂN DỤNG</a>
              <span className="text-outline-variant">/</span>
              <a href="#" className="font-label text-[9px] text-on-surface-variant hover:text-on-surface transition-colors no-underline">ĐIỀU KHOẢN</a>
            </div>
          </div>
        </div>

        <div className="mt-20 md:mt-32 pt-10 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-label text-[9px] text-on-surface-variant tracking-widest uppercase">
            © 2026 NGUYỄN NGỌC HIỆP. BẢO LƯU MỌI QUYỀN.
          </span>
          <span className="font-label text-[9px] text-on-surface-variant tracking-widest uppercase">
            THIẾT KẾ TẠI PARIS / CHẾ TÁC TOÀN CẦU
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
