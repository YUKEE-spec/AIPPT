import React, { useState } from 'react';
import { TestTube, CheckCircle, XCircle, Loader } from 'lucide-react';
import { Button } from './Button';
import { apiClient } from '@/api/client';
import type { TextApiConfig, ImageApiConfig } from '@/types/api-config';

interface ApiTestButtonProps {
  api: TextApiConfig | ImageApiConfig;
  className?: string;
}

type TestStatus = 'idle' | 'testing' | 'success' | 'error';

export const ApiTestButton: React.FC<ApiTestButtonProps> = ({ api, className = '' }) => {
  const [testStatus, setTestStatus] = useState<TestStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const testApiConnection = async () => {
    if (!api.apiKey) {
      setErrorMessage('请先配置API密钥');
      setTestStatus('error');
      return;
    }

    setTestStatus('testing');
    setErrorMessage('');

    try {
      const response = await apiClient.post('/api/config/test', {
        provider: api.provider,
        config: {
          api_key: api.apiKey,
          base_url: api.baseUrl,
          model: api.model,
          ...(api.type === 'text' ? {
            max_tokens: (api as TextApiConfig).maxTokens,
            temperature: (api as TextApiConfig).temperature,
          } : {
            aspect_ratio: (api as ImageApiConfig).aspectRatio,
            resolution: (api as ImageApiConfig).resolution,
            style: (api as ImageApiConfig).style,
          })
        },
        is_image: api.type === 'image'
      });

      if (response.data.success) {
        setTestStatus('success');
        setTimeout(() => setTestStatus('idle'), 3000); // 3秒后重置状态
      } else {
        setTestStatus('error');
        setErrorMessage(response.data.message || '测试失败');
      }
    } catch (error: any) {
      setTestStatus('error');
      setErrorMessage(error.response?.data?.message || error.message || '连接测试失败');
    }
  };

  const getIcon = () => {
    switch (testStatus) {
      case 'testing':
        return <Loader className="w-4 h-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <TestTube className="w-4 h-4" />;
    }
  };

  const getButtonText = () => {
    switch (testStatus) {
      case 'testing':
        return '测试中...';
      case 'success':
        return '连接成功';
      case 'error':
        return '连接失败';
      default:
        return '测试连接';
    }
  };

  const getButtonVariant = () => {
    switch (testStatus) {
      case 'success':
        return 'primary' as const;
      case 'error':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  return (
    <div className={className}>
      <Button
        variant={getButtonVariant()}
        size="sm"
        onClick={testApiConnection}
        disabled={testStatus === 'testing'}
        className="flex items-center space-x-2"
      >
        {getIcon()}
        <span>{getButtonText()}</span>
      </Button>
      {testStatus === 'error' && errorMessage && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          {errorMessage}
        </div>
      )}
    </div>
  );
};