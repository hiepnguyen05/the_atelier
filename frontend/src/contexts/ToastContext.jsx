import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Tự động xóa sau 3 giây
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Portal View */}
      <div className="fixed bottom-8 right-8 z-[1000] flex flex-col gap-4">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-4 px-8 py-4 shadow-2xl animate-in slide-in-from-right-10 duration-300 ${
              toast.type === 'error' ? 'bg-error text-white' : 'bg-on-background text-on-primary'
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {toast.type === 'error' ? 'error' : 'check_circle'}
            </span>
            <span className="font-label text-[10px] uppercase tracking-[0.2em] font-bold">
              {toast.message}
            </span>
            <button onClick={() => removeToast(toast.id)} className="ml-4 opacity-50 hover:opacity-100">
              <span className="material-symbols-outlined text-xs">close</span>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
