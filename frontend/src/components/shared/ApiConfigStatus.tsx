import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, Loader } from 'lucide-react';
import { useApiConfigStore } from '@/store/useApiConfigStore';
import { getApiConfigStatus } from '@/utils/api-config';
import { clearApiConfigCache } from '@/utils/api-cache';

interface ApiConfigStatusProps {
  className?: string;
  showText?: boolean;
}

export const ApiConfigStatus: React.FC<ApiConfigStatusProps> = ({ 
  className = '', 
  showText = true 
}) => {
  // 订阅store状态变化以实时更新
  const { textApis, imageApis, defaultTextApi, defaultImageApi } = useApiConfigStore();
  // 当store状态变化时强制刷新
  useEffect(() => {
    clearApiConfigCache(); // 清除缓存确保获取最新状态
  }, [textApis, imageApis, defaultTextApi, defaultImageApi]);
  
  const status = getApiConfigStatus();
  
  const getStatusIcon = () => {
    switch (status.status) {
      case 'complete':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'partial':
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'none':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Loader className="w-4 h-4 text-gray-400 animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (status.status) {
      case 'complete':
        return '已完整配置';
      case 'partial':
        return status.hasText ? '仅文本API' : '仅图像API';
      case 'none':
        return '未配置API';
      default:
        return '检查中...';
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case 'complete':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'partial':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'none':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor()} ${className}`}>
      {getStatusIcon()}
      {showText && (
        <span className="text-sm font-medium">
          {getStatusText()}
        </span>
      )}
    </div>
  );
};