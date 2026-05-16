import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';

const Dashboard = () => {
  return (
    <AdminLayout>
      <section className="mb-16">
        <div className="max-w-2xl">
          <nav className="mb-4">
            <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary">Hệ thống Quản trị</span>
          </nav>
          <h2 className="font-headline text-5xl text-on-surface tracking-tight mb-4">Tổng quan</h2>
          <p className="font-body text-base text-on-surface-variant/80 max-w-lg leading-relaxed">
            Chào mừng trở lại với The Atelier. Dưới đây là tóm tắt hoạt động kinh doanh và quản trị của bạn.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-surface-container-low p-8 border border-outline-variant/10 shadow-sm">
          <span className="material-symbols-outlined text-secondary text-3xl mb-4">straighten</span>
          <h4 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Sản phẩm hiện có</h4>
          <p className="font-headline text-4xl text-on-surface">--</p>
        </div>
        <div className="bg-surface-container-low p-8 border border-outline-variant/10 shadow-sm">
          <span className="material-symbols-outlined text-secondary text-3xl mb-4">auto_awesome_motion</span>
          <h4 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Bộ sưu tập</h4>
          <p className="font-headline text-4xl text-on-surface">--</p>
        </div>
        <div className="bg-surface-container-low p-8 border border-outline-variant/10 shadow-sm">
          <span className="material-symbols-outlined text-secondary text-3xl mb-4">shopping_bag</span>
          <h4 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2">Đơn hàng mới</h4>
          <p className="font-headline text-4xl text-on-surface">--</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
