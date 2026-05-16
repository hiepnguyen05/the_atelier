import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login, user, isAdmin } = useAuth();
    const { showToast } = useToast();

    // If already an admin, redirect to dashboard immediately
    React.useEffect(() => {
        if (user && isAdmin) {
            navigate("/admin/dashboard", { replace: true });
        }
    }, [user, isAdmin, navigate]);

    // Get the page user was trying to access
    const from = location.state?.from?.pathname || "/admin/dashboard";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await login({ email, password });
            
            if (response.success) {
                const user = response.data;
                if (user.role && user.role.roleName === 'admin') {
                    showToast('Chào mừng Quản trị viên trở lại', 'success');
                    navigate(from, { replace: true });
                } else {
                    // Logged in but not an admin
                    showToast('Bạn không có quyền truy cập khu vực này', 'error');
                }
            } else {
                showToast(response.message || 'Thông tin đăng nhập không chính xác', 'error');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Lỗi hệ thống, vui lòng thử lại sau';
            showToast(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-surface text-on-surface p-6">
            <div className="w-full max-w-[400px] space-y-12">
                <header className="text-center space-y-6">
                    <div className="inline-block border border-on-surface/10 px-8 py-3">
                        <span className="font-serif text-2xl tracking-[0.4em] uppercase">The Atelier</span>
                    </div>
                    <div className="space-y-2">
                        <h1 className="font-serif text-4xl tracking-tight text-on-surface">Quản trị viên</h1>
                        <p className="font-label text-[10px] tracking-[0.3em] uppercase text-on-surface-variant/60">Cửa ngõ truy cập bảo mật</p>
                    </div>
                    <div className="h-px w-12 bg-secondary/30 mx-auto"></div>
                </header>

                <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="space-y-2 group">
                        <label className="block font-label text-[10px] tracking-[0.2em] text-on-surface-variant uppercase" htmlFor="email">
                            Địa chỉ Email
                        </label>
                        <input 
                            className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant/40 py-3 focus:ring-0 focus:border-secondary transition-colors font-body text-sm placeholder:text-outline-variant/60" 
                            id="email" 
                            placeholder="admin@theatelier.com" 
                            required 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2 group">
                        <label className="block font-label text-[10px] tracking-[0.2em] text-on-surface-variant uppercase" htmlFor="password">
                            Mã khóa truy cập
                        </label>
                        <input 
                            className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant/40 py-3 focus:ring-0 focus:border-secondary transition-colors font-body text-sm placeholder:text-outline-variant/60" 
                            id="password" 
                            placeholder="••••••••" 
                            required 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button 
                        className={`w-full bg-surface-tint text-on-primary py-5 font-label text-[10px] !tracking-[0.25em] uppercase shadow-sm liquid-hover hover:bg-primary-dim active:scale-[0.98] ${loading ? 'opacity-50' : ''}`} 
                        type="submit"
                        disabled={loading}
                    >
                        <span className="mr-[-0.25em]">{loading ? 'Đang xác thực...' : 'Truy cập hệ thống'}</span>
                    </button>
                </form>

                <div className="text-center pt-4">
                    <button 
                        onClick={() => navigate('/')}
                        className="font-label text-[10px] !tracking-[0.15em] text-on-surface-variant hover:text-on-surface border-b border-transparent hover:border-on-surface transition-all uppercase inline-block"
                    >
                        <span className="mr-[-0.15em]">Quay lại trang chủ</span>
                    </button>
                </div>
            </div>

            {/* Subtle background element */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] overflow-hidden flex items-center justify-center">
                <span className="font-serif text-[40vw] leading-none uppercase select-none text-on-surface">ATELIER</span>
            </div>
        </main>
    );
};

export default AdminLogin;
