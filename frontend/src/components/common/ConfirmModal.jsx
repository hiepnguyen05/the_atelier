import React from 'react';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Xác nhận", 
  message = "Bạn có chắc chắn muốn thực hiện hành động này?", 
  confirmText = "Đồng ý", 
  cancelText = "Để tôi xem lại",
  type = "info", // danger, warning, info, success
  icon = "help_outline"
}) => {
  if (!isOpen) return null;

  const themes = {
    danger: {
      accent: "bg-error",
      text: "text-error",
      bg: "bg-error/5",
      border: "border-error/10",
      icon: "report_gmailerrorred"
    },
    warning: {
      accent: "bg-secondary",
      text: "text-secondary",
      bg: "bg-secondary/5",
      border: "border-secondary/10",
      icon: "error_outline"
    },
    info: {
      accent: "bg-surface-tint",
      text: "text-on-surface",
      bg: "bg-surface-container-low",
      border: "border-outline-variant/20",
      icon: icon || "info"
    },
    success: {
      accent: "bg-green-600",
      text: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-100",
      icon: "check_circle"
    }
  };

  const theme = themes[type] || themes.info;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 bg-on-background/40 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="bg-surface w-full max-w-lg relative overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        
        {/* Top Decorative Line */}
        <div className={`h-1.5 w-full ${theme.accent}`} />

        <div className="p-10 sm:p-14">
          <div className="flex flex-col items-center text-center">
            {/* Elegant Icon Circle */}
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-8 ${theme.bg} ${theme.text} border ${theme.border} scale-110`}>
              <span className="material-symbols-outlined text-4xl leading-none">
                {theme.icon}
              </span>
            </div>

            {/* Typography Section */}
            <h3 className="font-headline text-4xl text-on-surface mb-6 tracking-tight leading-tight">
              {title}
            </h3>
            
            <p className="font-body text-base text-on-surface-variant/80 leading-relaxed max-w-xs mb-12">
              {message}
            </p>

            {/* Action Buttons with High-end Styling */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-4">
              <button
                onClick={onClose}
                className="order-2 sm:order-1 py-4 font-label text-[11px] uppercase tracking-[0.2em] text-on-surface-variant hover:text-on-surface border border-outline-variant/30 hover:border-outline-variant transition-all duration-300"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`order-1 sm:order-2 py-4 font-label text-[11px] uppercase tracking-[0.2em] font-bold text-white shadow-xl hover:shadow-2xl active:scale-[0.98] transition-all duration-300 ${theme.accent}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>

        {/* Branding Detail */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-10 pointer-events-none">
          <span className="font-headline text-6xl tracking-tighter whitespace-nowrap">The Atelier</span>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
