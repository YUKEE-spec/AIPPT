import React, { useState } from 'react';
import { Settings, Zap } from 'lucide-react';
import { Button } from './Button';
import { ApiConfigModal } from './ApiConfigModal';
import { ApiConfigWizard } from './ApiConfigWizard';
import { useApiConfigStore } from '@/store/useApiConfigStore';

interface ApiConfigButtonProps {
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const ApiConfigButton: React.FC<ApiConfigButtonProps> = ({ 
  className = '', 
  variant = 'outline',
  size = 'sm'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const { textApis, imageApis, getDefaultTextApi, getDefaultImageApi } = useApiConfigStore();

  // 检查是否有配置的API
  const hasTextApi = getDefaultTextApi()?.apiKey;
  const hasImageApi = getDefaultImageApi()?.apiKey;
  const hasAnyApi = hasTextApi || hasImageApi;

  // 计算状态指示器
  const getStatusColor = () => {
    if (hasTextApi && hasImageApi) return 'text-green-600';
    if (hasTextApi || hasImageApi) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusText = () => {
    if (hasTextApi && hasImageApi) return '已配置完整API';
    if (hasTextApi) return '仅配置文本API';
    if (hasImageApi) return '仅配置图像API';
    return '未配置API';
  };

  const handleButtonClick = () => {
    // 如果没有任何API配置，打开向导；否则打开配置模态框
    if (!hasAnyApi) {
      setIsWizardOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleButtonClick}
        className={`flex items-center space-x-2 ${className}`}
        title={getStatusText()}
      >
        {!hasAnyApi ? <Zap size={16} /> : <Settings size={16} />}
        <span>{!hasAnyApi ? '快速配置' : 'API配置'}</span>
        {/* 状态指示器 */}
        <div className={`w-2 h-2 rounded-full ${getStatusColor().replace('text-', 'bg-')}`} />
      </Button>

      <ApiConfigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ApiConfigWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />
    </>
  );
};