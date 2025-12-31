import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useUIStore } from '../../stores/uiStore';

const Toast = () => {
  const { toasts, removeToast } = useUIStore();

  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertTriangle
  };

  const colors = {
    success: 'bg-green-100 text-green-900 border-green-200',
    error: 'bg-red-100 text-red-900 border-red-200',
    info: 'bg-blue-100 text-blue-900 border-blue-200',
    warning: 'bg-yellow-100 text-yellow-900 border-yellow-200'
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || Info;
        const colorClass = colors[toast.type] || colors.info;

        return (
          <div
            key={toast.id}
            className={`flex items-center w-80 p-4 rounded-lg border ${colorClass} shadow-lg transform transition-all duration-300`}
          >
            <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium">{toast.title}</p>
              {toast.message && (
                <p className="text-sm mt-1 opacity-90">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
