import React from 'react';
import { Loader2, AlertCircle, Inbox } from 'lucide-react';

export const LoadingState: React.FC<{ message?: string }> = ({ message = 'Đang tải dữ liệu...' }) => (
  <div className="flex flex-col items-center justify-center py-12">
    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
    <p className="text-gray-500">{message}</p>
  </div>
);

export const ErrorState: React.FC<{ message?: string; onRetry?: () => void }> = ({ 
  message = 'Đã có lỗi xảy ra. Vui lòng thử lại.',
  onRetry 
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
    <p className="text-red-600 mb-4 font-medium">{message}</p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium transition-colors"
      >
        Thử lại
      </button>
    )}
  </div>
);

export const EmptyState: React.FC<{ title?: string; message?: string; action?: React.ReactNode }> = ({ 
  title = 'Trống', 
  message = 'Không có dữ liệu',
  action
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50/50 rounded-2xl border border-gray-100 border-dashed">
    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
      <Inbox className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
    <p className="text-gray-500 max-w-sm mx-auto mb-6">{message}</p>
    {action}
  </div>
);
