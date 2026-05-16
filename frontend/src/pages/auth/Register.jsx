import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useToast } from '../../contexts/ToastContext';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 1. Basic validation
        if (formData.password !== formData.confirmPassword) {
            showToast('Mật khẩu xác nhận không khớp', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await authService.register({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone
            });

            if (response.success) {
                showToast('Đăng ký tài khoản thành công. Vui lòng đăng nhập.', 'success');
                navigate('/login');
            } else {
                showToast(response.message || 'Đăng ký thất bại', 'error');
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
            <div className="mb-12 md:mb-16 text-center">
                <Link to="/" className="font-serif text-2xl md:text-4xl tracking-[0.4em] text-on-surface hover:opacity-70 transition-opacity uppercase">
                    THE ATELIER
                </Link>
                <p className="mt-4 font-body text-on-surface-variant tracking-[0.25em] text-[8px] md:text-[10px] uppercase">Haute Couture • Est. 1994</p>
            </div>

            {/* Form Content */}
            <div className="w-full max-w-md space-y-8 md:space-y-12">
                <header className="space-y-4 text-center">
                    <h1 className="font-serif text-4xl lg:text-5xl text-on-surface tracking-tight">
                        Đăng Ký
                    </h1>
                    <div className="h-px w-12 bg-secondary/40 mx-auto"></div>
                </header>

                <form className="space-y-8" onSubmit={handleSubmit}>
                    {/* Full Name Field */}
                    <div className="space-y-2 group">
                        <label className="block font-label text-[10px] tracking-[0.15em] text-on-surface-variant uppercase" htmlFor="fullName">
                            Họ và Tên
                        </label>
                        <input 
                            className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant/40 py-3 focus:ring-0 focus:border-secondary transition-colors font-body text-sm placeholder:text-outline-variant/60" 
                            id="fullName" 
                            placeholder="Nguyễn Văn A" 
                            required 
                            type="text"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Email Field */}
                    <div className="space-y-2 group">
                        <label className="block font-label text-[10px] tracking-[0.15em] text-on-surface-variant uppercase" htmlFor="email">
                            Địa chỉ Email
                        </label>
                        <input 
                            className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant/40 py-3 focus:ring-0 focus:border-secondary transition-colors font-body text-sm placeholder:text-outline-variant/60" 
                            id="email" 
                            placeholder="email@example.com" 
                            required 
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2 group">
                        <label className="block font-label text-[10px] tracking-[0.15em] text-on-surface-variant uppercase" htmlFor="phone">
                            Số điện thoại
                        </label>
                        <input 
                            className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant/40 py-3 focus:ring-0 focus:border-secondary transition-colors font-body text-sm placeholder:text-outline-variant/60" 
                            id="phone" 
                            placeholder="0123456789" 
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Password Fields Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2 group">
                            <label className="block font-label text-[10px] tracking-[0.15em] text-on-surface-variant uppercase" htmlFor="password">
                                Mật khẩu
                            </label>
                            <input 
                                className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant/40 py-3 focus:ring-0 focus:border-secondary transition-colors font-body text-sm placeholder:text-outline-variant/60" 
                                id="password" 
                                placeholder="••••••••" 
                                required 
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2 group">
                            <label className="block font-label text-[10px] tracking-[0.15em] text-on-surface-variant uppercase" htmlFor="confirmPassword">
                                Xác nhận
                            </label>
                            <input 
                                className="w-full bg-transparent border-t-0 border-x-0 border-b border-outline-variant/40 py-3 focus:ring-0 focus:border-secondary transition-colors font-body text-sm placeholder:text-outline-variant/60" 
                                id="confirmPassword" 
                                placeholder="••••••••" 
                                required 
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Primary CTA */}
                    <button 
                        className={`w-full bg-surface-tint text-on-primary py-5 font-label text-xs tracking-[0.2em] uppercase shadow-sm liquid-hover hover:bg-primary-dim active:scale-[0.98] mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} 
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ TÀI KHOẢN'}
                    </button>
                </form>

                {/* Switch Account Section */}
                <div className="text-center space-y-6">
                    <p className="font-body text-sm text-on-surface-variant">
                        Đã có tài khoản? 
                        <Link to="/login" className="text-on-surface font-semibold border-b border-on-surface/20 pb-0.5 ml-2 hover:border-on-surface transition-all">
                            Đăng nhập ngay
                        </Link>
                    </p>
                </div>
            </div>

            {/* Language/Legal Anchor */}
            <div className="mt-12 md:mt-16 text-[10px] tracking-[0.1em] text-outline uppercase flex space-x-6">
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

export default Register;
