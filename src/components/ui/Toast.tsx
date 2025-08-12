import React from 'react';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { Toast as ToastType } from '@/hooks/useToast';

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const getToastStyles = (type: ToastType['type']) => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-green-50 border-green-200',
          icon: <CheckCircle className="w-5 h-5 text-green-400" />,
          title: 'text-green-800',
          message: 'text-green-700',
          button: 'hover:bg-green-100',
          buttonIcon: 'text-green-500'
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-200',
          icon: <XCircle className="w-5 h-5 text-red-400" />,
          title: 'text-red-800',
          message: 'text-red-700',
          button: 'hover:bg-red-100',
          buttonIcon: 'text-red-500'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200',
          icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
          title: 'text-yellow-800',
          message: 'text-yellow-700',
          button: 'hover:bg-yellow-100',
          buttonIcon: 'text-yellow-500'
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200',
          icon: <Info className="w-5 h-5 text-blue-400" />,
          title: 'text-blue-800',
          message: 'text-blue-700',
          button: 'hover:bg-blue-100',
          buttonIcon: 'text-blue-500'
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-200',
          icon: <Info className="w-5 h-5 text-gray-400" />,
          title: 'text-gray-800',
          message: 'text-gray-700',
          button: 'hover:bg-gray-100',
          buttonIcon: 'text-gray-500'
        };
    }
  };

  const styles = getToastStyles(toast.type);


  return (
    <div className={`max-w-sm w-full transform transition-all duration-300 ease-in-out ${styles.container} border rounded-lg shadow-lg p-4 mb-2`}>
      <div className="flex items-center justify-center">
        <div className="flex-shrink-0">
          {styles.icon}
        </div>
        <div className="ml-3 flex-1">
          {/* <p className={`text-sm font-medium ${styles.title}`}>
            {getTitle(toast.type)}
          </p> */}
          <p className={`mt-1 text-sm ${styles.message}`}>
            {toast.message}
          </p>
        </div>
        <button
          onClick={() => onClose(toast.id)}
          className={`ml-3 flex-shrink-0 rounded-md p-1.5 ${styles.button} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors`}
        >
          <X className={`w-4 h-4 ${styles.buttonIcon}`} />
        </button>
      </div>
    </div>
  );
};

export default Toast;