import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await login({ email, password });
            
            if (response.success) {
                showToast('Đăng nhập thành công', 'success');
                
                // Redirect based on role
                const user = response.data;
                if (user.role && user.role.roleName === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/');
                }
            } else {
                showToast(response.message || 'Đăng nhập thất bại', 'error');
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Có lỗi xảy ra khi kết nối đến máy chủ';
            showToast(message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex flex-col justify-center items-center relative py-12 md:py-16 px-4 md:px-6 bg-surface text-on-surface">
            {/* Brand Logo */}
            <div className="mb-12 md:mb-20 text-center">
                <Link to="/" className="font-serif text-2xl md:text-4xl tracking-[0.4em] text-on-surface hover:opacity-70 transition-opacity uppercase">
                    THE ATELIER
                </Link>
                <p className="mt-4 font-body text-on-surface-variant tracking-[0.25em] text-[8px] md:text-[10px] uppercase">Haute Couture • Est. 1994</p>
            </div>

            {/* Form Content */}
            <div className="w-full max-w-md space-y-8 md:space-y-12">
                <header className="space-y-4 text-center">
                    <h1 className="font-serif text-4xl lg:text-5xl text-on-surface tracking-tight">
                        Đăng Nhập
                    </h1>
                    <div className="h-px w-12 bg-secondary/40 mx-auto"></div>
                </header>

                <form className="space-y-10" onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div className="space-y-2 group">
                        <label className="block font-label text-[10px] tracking-[0.15em] text-on-surface-variant uppercase" htmlFor="email">
                            Địa chỉ Email
                        </label>
                        <input 
                            className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant/40 py-4 focus:ring-0 focus:border-secondary transition-colors font-body text-sm placeholder:text-outline-variant/60" 
                            id="email" 
                            placeholder="email@example.com" 
                            required 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2 group">
                        <div className="flex justify-between items-center">
                            <label className="block font-label text-[10px] tracking-[0.15em] text-on-surface-variant uppercase" htmlFor="password">
                                Mật khẩu
                            </label>
                            <Link to="/forgot-password" size="sm" className="font-label text-[10px] tracking-[0.05em] text-secondary hover:text-secondary-dim transition-colors uppercase">
                                Quên mật khẩu?
                            </Link>
                        </div>
                        <input 
                            className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant/40 py-4 focus:ring-0 focus:border-secondary transition-colors font-body text-sm placeholder:text-outline-variant/60" 
                            id="password" 
                            placeholder="••••••••" 
                            required 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {/* Primary CTA */}
                    <button 
                        className={`w-full bg-surface-tint text-on-primary py-5 font-label text-xs tracking-[0.2em] uppercase shadow-sm liquid-hover hover:bg-primary-dim active:scale-[0.98] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
                    </button>
                </form>

                {/* Switch Account Section */}
                <div className="text-center space-y-6">
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-full bg-outline-variant/20 max-w-[60px]"></div>
                        <span className="font-label text-[9px] tracking-[0.2em] text-outline uppercase whitespace-nowrap">Hoặc</span>
                        <div className="h-px w-full bg-outline-variant/20 max-w-[60px]"></div>
                    </div>
                    <p className="font-body text-sm text-on-surface-variant">
                        Chưa có tài khoản? 
                        <Link to="/register" className="text-on-surface font-semibold border-b border-on-surface/20 pb-0.5 ml-2 hover:border-on-surface transition-all">
                            Đăng ký ngay
                        </Link>
                    </p>
                </div>
            </div>

            {/* Language/Legal Anchor */}
            <div className="mt-12 md:mt-20 text-[10px] tracking-[0.1em] text-outline uppercase flex space-x-6">
                <Link to="/privacy" className="hover:text-on-surface transition-colors">Privacy Policy</Link>
                <Link to="/terms" className="hover:text-on-surface transition-colors">Terms of Service</Link>
                <span className="text-surface-container-high">VI / EN</span>
            </div>

            {/* The Concierge (Floating Action) */}
            <button className="fixed bottom-8 right-8 w-14 h-14 bg-surface-container-lowest text-secondary rounded-full flex items-center justify-center shadow-[0_20px_40px_rgba(14,14,14,0.06)] liquid-hover hover:scale-110 z-50 group border border-outline-variant/10">
                <span className="material-symbols-outlined text-2xl">support_agent</span>
                <span className="absolute right-16 bg-surface-container-lowest px-4 py-2 text-[10px] tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border border-outline-variant/10">
                    Hỗ trợ trực tuyến
                </span>
            </button>
        </main>
    );
};

export default Login;
