import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { useApiConfigStore } from '@/store/useApiConfigStore';
import { API_TEMPLATES } from '@/types/api-config';
import { getApiConfigSuggestions } from '@/utils/api-validation';
import { Button } from './Button';
import { Input } from './Input';
import { Modal } from './Modal';

interface ApiConfigWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

type WizardStep = 'welcome' | 'provider-selection' | 'text-config' | 'image-config' | 'complete';

export const ApiConfigWizard: React.FC<ApiConfigWizardProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('welcome');
  const [selectedProviders, setSelectedProviders] = useState<{
    text?: string;
    image?: string;
  }>({});
  const [configs, setConfigs] = useState<{
    text?: any;
    image?: any;
  }>({});

  const { addTextApi, addImageApi } = useApiConfigStore();

  const handleProviderSelect = (type: 'text' | 'image', provider: string) => {
    setSelectedProviders(prev => ({ ...prev, [type]: provider }));
  };

  const handleConfigChange = (type: 'text' | 'image', field: string, value: any) => {
    setConfigs(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
  };

  const handleComplete = () => {
    // 添加文本API配置
    if (selectedProviders.text && configs.text?.apiKey) {
      const template = API_TEMPLATES.text[selectedProviders.text as keyof typeof API_TEMPLATES.text];
      addTextApi({
        ...template,
        apiKey: configs.text.apiKey,
        enabled: true,
      });
      // addTextApi会自动设置为默认API（如果是第一个）
    }

    // 添加图像API配置
    if (selectedProviders.image && configs.image?.apiKey) {
      const template = API_TEMPLATES.image[selectedProviders.image as keyof typeof API_TEMPLATES.image];
      addImageApi({
        ...template,
        apiKey: configs.image.apiKey,
        enabled: true,
      });
      // addImageApi会自动设置为默认API（如果是第一个）
    }

    onClose();
    setCurrentStep('welcome');
    setSelectedProviders({});
    setConfigs({});
  };

  const renderWelcomeStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-white" />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">欢迎使用API配置向导</h3>
        <p className="text-gray-600">
          我们将帮助你快速配置AI API，让你能够使用多种AI服务生成PPT。
        </p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">配置步骤：</h4>
        <ol className="text-sm text-blue-700 space-y-1 text-left">
          <li>1. 选择AI服务提供商</li>
          <li>2. 配置文本生成API</li>
          <li>3. 配置图像生成API</li>
          <li>4. 完成配置</li>
        </ol>
      </div>
      <Button onClick={() => setCurrentStep('provider-selection')} className="w-full">
        开始配置
      </Button>
    </div>
  );

  const renderProviderSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">选择AI服务提供商</h3>
        <p className="text-gray-600">选择你想要使用的AI服务</p>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-3">文本生成API</h4>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(API_TEMPLATES.text).map(([key, template]) => (
              <button
                key={key}
                onClick={() => handleProviderSelect('text', key)}
                className={`p-3 border rounded-lg text-left transition-colors ${
                  selectedProviders.text === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{template.name}</div>
                <div className="text-sm text-gray-600">推荐模型: {template.model}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-3">图像生成API</h4>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(API_TEMPLATES.image).map(([key, template]) => (
              <button
                key={key}
                onClick={() => handleProviderSelect('image', key)}
                className={`p-3 border rounded-lg text-left transition-colors ${
                  selectedProviders.image === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">{template.name}</div>
                <div className="text-sm text-gray-600">
                  {'model' in template && template.model && `模型: ${template.model}`}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button variant="ghost" onClick={() => setCurrentStep('welcome')} className="flex-1">
          <ChevronLeft className="w-4 h-4 mr-2" />
          上一步
        </Button>
        <Button 
          onClick={() => setCurrentStep('text-config')} 
          disabled={!selectedProviders.text && !selectedProviders.image}
          className="flex-1"
        >
          下一步
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderTextConfig = () => {
    if (!selectedProviders.text) {
      setCurrentStep('image-config');
      return null;
    }

    const template = API_TEMPLATES.text[selectedProviders.text as keyof typeof API_TEMPLATES.text];
    const suggestions = getApiConfigSuggestions(selectedProviders.text, 'text');

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">配置 {template.name}</h3>
          <p className="text-gray-600">请填写API配置信息</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">API密钥 *</label>
            <Input
              type="password"
              placeholder="输入API密钥"
              value={configs.text?.apiKey || ''}
              onChange={(e) => handleConfigChange('text', 'apiKey', e.target.value)}
            />
          </div>

          {suggestions.tips && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm text-blue-700">{suggestions.tips}</div>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <Button variant="ghost" onClick={() => setCurrentStep('provider-selection')} className="flex-1">
            <ChevronLeft className="w-4 h-4 mr-2" />
            上一步
          </Button>
          <Button 
            onClick={() => setCurrentStep('image-config')} 
            disabled={!configs.text?.apiKey}
            className="flex-1"
          >
            下一步
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  const renderImageConfig = () => {
    if (!selectedProviders.image) {
      setCurrentStep('complete');
      return null;
    }

    const template = API_TEMPLATES.image[selectedProviders.image as keyof typeof API_TEMPLATES.image];
    const suggestions = getApiConfigSuggestions(selectedProviders.image, 'image');

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">配置 {template.name}</h3>
          <p className="text-gray-600">请填写API配置信息</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">API密钥 *</label>
            <Input
              type="password"
              placeholder="输入API密钥"
              value={configs.image?.apiKey || ''}
              onChange={(e) => handleConfigChange('image', 'apiKey', e.target.value)}
            />
          </div>

          {suggestions.tips && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-sm text-blue-700">{suggestions.tips}</div>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <Button variant="ghost" onClick={() => setCurrentStep('text-config')} className="flex-1">
            <ChevronLeft className="w-4 h-4 mr-2" />
            上一步
          </Button>
          <Button 
            onClick={() => setCurrentStep('complete')} 
            disabled={!configs.image?.apiKey}
            className="flex-1"
          >
            下一步
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  const renderComplete = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-white" />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">配置完成！</h3>
        <p className="text-gray-600">
          你已成功配置了AI API，现在可以开始生成PPT了。
        </p>
      </div>
      
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-medium text-green-900 mb-2">已配置的服务：</h4>
        <div className="text-sm text-green-700 space-y-1">
          {selectedProviders.text && (
            <div>✅ 文本生成: {API_TEMPLATES.text[selectedProviders.text as keyof typeof API_TEMPLATES.text].name}</div>
          )}
          {selectedProviders.image && (
            <div>✅ 图像生成: {API_TEMPLATES.image[selectedProviders.image as keyof typeof API_TEMPLATES.image].name}</div>
          )}
        </div>
      </div>

      <Button onClick={handleComplete} className="w-full">
        完成配置
      </Button>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return renderWelcomeStep();
      case 'provider-selection':
        return renderProviderSelection();
      case 'text-config':
        return renderTextConfig();
      case 'image-config':
        return renderImageConfig();
      case 'complete':
        return renderComplete();
      default:
        return renderWelcomeStep();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="API配置向导" size="lg">
      {renderCurrentStep()}
    </Modal>
  );
};