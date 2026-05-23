import React from 'react';
import Loading from '../common/Loading';

const CustomerRow = ({ user, onToggleStatus, onUpdateRole }) => {
  const avatarImage = user.avatarUrl;
  const roleName = user.role?.roleName || 'customer';
  
  // Extract elegant initials
  const initials = user.fullName
    ? user.fullName.trim().split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U';

  return (
    <tr className="group hover:bg-surface-container-low/50 transition-colors border-b border-outline-variant/5">
      <td className="py-6 px-8">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant/10 shadow-sm flex-shrink-0 flex items-center justify-center">
            {avatarImage ? (
              <img 
                src={avatarImage} 
                alt={user.fullName} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-headline text-sm font-bold text-on-surface-variant/80 tracking-wider">
                {initials}
              </span>
            )}
          </div>
          <div>
            <h4 className="font-headline text-base text-on-surface mb-1">{user.fullName}</h4>
            <span className="font-body text-xs text-on-surface-variant/70 lowercase tracking-normal">{user.email}</span>
          </div>
        </div>
      </td>
      <td className="py-6 px-8">
        <span className="font-body text-sm text-on-surface-variant">
          {user.phone || 'Chưa cập nhật'}
        </span>
      </td>
      <td className="py-6 px-8">
        <select
          value={user.roleId || 1}
          onChange={(e) => onUpdateRole(user.userId, parseInt(e.target.value))}
          className="bg-surface border border-outline-variant/20 px-3 py-1.5 font-label text-[10px] uppercase tracking-widest text-on-surface focus:outline-none focus:border-secondary cursor-pointer"
        >
          <option value="1">Khách hàng</option>
          <option value="30001">Quản trị viên</option>
        </select>
      </td>
      <td className="py-6 px-8 text-center">
        <span className={`font-label text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 font-bold inline-block min-w-[90px] ${
          user.isActive 
            ? 'bg-success-container text-on-success-container' 
            : 'bg-error-container text-on-error-container'
        }`}>
          {user.isActive ? 'Hoạt động' : 'Đã khóa'}
        </span>
      </td>
      <td className="py-6 px-8 text-right">
        {roleName !== 'admin' && (
          <button 
            onClick={() => onToggleStatus(user.userId, user.isActive)}
            className={`font-label text-[10px] uppercase tracking-widest px-4 py-2 border transition-all ${
              user.isActive 
                ? 'border-error/30 text-error hover:bg-error hover:text-white' 
                : 'border-success/30 text-success hover:bg-success hover:text-white'
            }`}
            title={user.isActive ? "Khóa tài khoản" : "Mở khóa tài khoản"}
          >
            {user.isActive ? 'Khóa' : 'Mở khóa'}
          </button>
        )}
      </td>
    </tr>
  );
};

const CustomerTable = ({ users, loading, onToggleStatus, onUpdateRole }) => {
  return (
    <section className="bg-surface-container-lowest overflow-hidden border border-outline-variant/5">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-surface-container border-b border-outline-variant/10">
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Người dùng</th>
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Số điện thoại</th>
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Vai trò</th>
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-center">Trạng thái</th>
              <th className="py-6 px-8 font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-bold text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/5">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-12">
                  <Loading size={70} text="Đang tải danh sách..." />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-20 text-center font-body text-xs text-on-surface-variant opacity-60 uppercase tracking-widest">
                  Không tìm thấy người dùng nào.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <CustomerRow 
                  key={user.userId} 
                  user={user} 
                  onToggleStatus={onToggleStatus} 
                  onUpdateRole={onUpdateRole}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CustomerTable;
