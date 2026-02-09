import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle, Plus } from 'lucide-react';
import { useApiConfigStore } from '@/store/useApiConfigStore';
import { API_TEMPLATES } from '@/types/api-config';
import { Button } from './Button';
import { Input } from './Input';
import { Modal } from './Modal';

interface StepByStepApiWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

type WizardStep = 'welcome' | 'text-provider' | 'text-config' | 'image-provider' | 'image-config' | 'custom-config' | 'complete';

interface CustomApiConfig {
  name: string;
  baseUrl: string;
  model: string;
  apiKey: string;
  enableThinking?: boolean;
}

export const StepByStepApiWizard: React.FC<StepByStepApiWizardProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState<WizardStep>('welcome');
  const [selectedTextProvider, setSelectedTextProvider] = useState<string>('');
  const [selectedImageProvider, setSelectedImageProvider] = useState<string>('');
  const [textConfig, setTextConfig] = useState<Record<string, string>>({});
  const [imageConfig, setImageConfig] = useState<Record<string, string>>({});
  const [customConfig, setCustomConfig] = useState<CustomApiConfig>({
    name: '',
    baseUrl: '',
    model: '',
    apiKey: '',
  });
  const [error, setError] = useState<string | null>(null);

  const { addTextApi, addImageApi } = useApiConfigStore();

  const handleStepChange = (nextStep: WizardStep) => {
    setError(null);
    setCurrentStep(nextStep);
  };

  const handleComplete = () => {
    console.log('StepByStepApiWizard: handleComplete called', {
      selectedTextProvider,
      textConfig,
      selectedImageProvider,
      imageConfig,
      customConfig
    });

    let configSaved = false;

    // 添加文本API配置
    if (selectedTextProvider) {
      if (selectedTextProvider === 'custom' && customConfig.apiKey) {
        console.log('Adding custom text API:', customConfig);
        addTextApi({
          name: customConfig.name,
          provider: 'openai_compatible',
          baseUrl: customConfig.baseUrl,
          model: customConfig.model,
          apiKey: customConfig.apiKey,
          enableThinking: customConfig.enableThinking,
          enabled: true,
        });
        configSaved = true;
      } else if (textConfig.apiKey) {
        const template = API_TEMPLATES.text[selectedTextProvider as keyof typeof API_TEMPLATES.text];
        console.log('Adding template text API:', template, textConfig);
        addTextApi({
          ...template,
          apiKey: textConfig.apiKey,
          ...(textConfig.secretKey && { secretKey: textConfig.secretKey }),
          enabled: true,
        });
        configSaved = true;
      }
    }

    // 添加图像API配置
    if (selectedImageProvider && imageConfig.apiKey) {
      const template = API_TEMPLATES.image[selectedImageProvider as keyof typeof API_TEMPLATES.image];
      console.log('Adding image API:', template, imageConfig);
      addImageApi({
        ...template,
        apiKey: imageConfig.apiKey,
        ...(imageConfig.secretKey && { secretKey: imageConfig.secretKey }),
        enabled: true,
      });
      configSaved = true;
    }

    console.log('StepByStepApiWizard: Configuration saved:', configSaved);
    
    if (configSaved) {
      // 延迟一下确保状态更新完成
      setTimeout(() => {
        console.log('StepByStepApiWizard: Closing wizard after config save');
        onClose();
        resetWizard();
      }, 100);
    } else {
      console.log('StepByStepApiWizard: No configuration to save, closing wizard');
      onClose();
      resetWizard();
    }
  };

  const resetWizard = () => {
    setCurrentStep('welcome');
    setSelectedTextProvider('');
    setSelectedImageProvider('');
    setTextConfig({});
    setImageConfig({});
    setCustomConfig({
      name: '',
      baseUrl: '',
      model: '',
      apiKey: '',
    });
    setError(null);
  };

  const renderWelcomeStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-white" />
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">AI API 配置向导</h3>
        <p className="text-gray-600">
          我们将分步骤帮助你配置AI API，让你能够使用多种AI服务生成PPT。
        </p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">配置步骤：</h4>
        <ol className="text-sm text-blue-700 space-y-1 text-left">
          <li>1. 选择文本生成API提供商</li>
          <li>2. 配置文本生成API</li>
          <li>3. 选择图像生成API提供商</li>
          <li>4. 配置图像生成API</li>
          <li>5. 完成配置</li>
        </ol>
      </div>
      <Button onClick={() => setCurrentStep('text-provider')} className="w-full">
        开始配置
      </Button>
    </div>
  );

  const renderTextProviderStep = () => (
    <div className="space-y-6 flex flex-col h-full">
      <div className="text-center shrink-0">
        <h3 className="text-xl font-semibold mb-2">选择文本生成API</h3>
        <p className="text-gray-600">选择用于生成PPT文本内容的AI服务</p>
      </div>

      <div className="grid grid-cols-1 gap-3 overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar">
        {Object.entries(API_TEMPLATES.text).map(([key, template]) => (
          <button
            key={key}
            onClick={() => {
              setSelectedTextProvider(key);
              setError(null);
            }}
            className={`p-4 border rounded-lg text-left transition-colors ${
              selectedTextProvider === key
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">{template.name}</div>
            <div className="text-sm text-gray-600">推荐模型: {template.model}</div>
            {'baseUrl' in template && template.baseUrl && (
              <div className="text-xs text-gray-500 mt-1">{template.baseUrl}</div>
            )}
          </button>
        ))}
        
        {/* 自定义OpenAI兼容API选项 */}
        <button
          onClick={() => {
            setSelectedTextProvider('custom');
            setError(null);
          }}
          className={`p-4 border rounded-lg text-left transition-colors ${
            selectedTextProvider === 'custom'
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Plus size={16} />
            <span className="font-medium">自定义OpenAI兼容API</span>
          </div>
          <div className="text-sm text-gray-600">DeepSeek、智谱AI、月之暗面等</div>
        </button>
      </div>

      <div className="shrink-0 space-y-3">
        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-100 animate-in fade-in slide-in-from-bottom-2">
            {error}
          </div>
        )}
        <div className="flex space-x-3">
          <Button variant="ghost" onClick={() => handleStepChange('welcome')} className="flex-1">
            <ChevronLeft className="w-4 h-4 mr-2" />
            上一步
          </Button>
          <Button 
            onClick={() => {
              if (!selectedTextProvider) {
                setError('请先选择一个文本生成API提供商');
                return;
              }
              handleStepChange(selectedTextProvider === 'custom' ? 'custom-config' : 'text-config');
            }}
            className="flex-1"
          >
            下一步
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderCustomConfigStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold mb-2">配置自定义API</h3>
        <p className="text-gray-600">配置OpenAI兼容的API服务</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">API名称 *</label>
          <Input
            placeholder="例如：DeepSeek V3"
            value={customConfig.name}
            onChange={(e) => setCustomConfig((prev: CustomApiConfig) => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Base URL *</label>
          <Input
            placeholder="例如：https://api.deepseek.com/v1"
            value={customConfig.baseUrl}
            onChange={(e) => setCustomConfig((prev: CustomApiConfig) => ({ ...prev, baseUrl: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">模型名称 *</label>
          <Input
            placeholder="例如：deepseek-v3.2"
            value={customConfig.model}
            onChange={(e) => setCustomConfig((prev: CustomApiConfig) => ({ ...prev, model: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">API密钥 *</label>
          <Input
            type="password"
            placeholder="输入API密钥"
            value={customConfig.apiKey}
            onChange={(e) => setCustomConfig((prev: CustomApiConfig) => ({ ...prev, apiKey: e.target.value }))}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="enableThinking"
            checked={customConfig.enableThinking || false}
            onChange={(e) => setCustomConfig((prev: CustomApiConfig) => ({ ...prev, enableThinking: e.target.checked }))}
            className="w-4 h-4"
          />
          <label htmlFor="enableThinking" className="text-sm text-gray-700">
            启用思考模式 (适用于DeepSeek等支持推理的模型)
          </label>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="text-sm text-yellow-700">
          <p className="font-medium mb-1">常用API配置示例：</p>
          <ul className="list-disc list-inside space-y-1 text-yellow-600">
            <li>DeepSeek: https://api.deepseek.com/v1</li>
            <li>智谱AI: https://open.bigmodel.cn/api/paas/v4</li>
            <li>月之暗面: https://api.moonshot.cn/v1</li>
            <li>阿里云百炼: https://dashscope.aliyuncs.com/compatible-mode/v1</li>
          </ul>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-100 animate-in fade-in slide-in-from-bottom-2">
          {error}
        </div>
      )}

      <div className="flex space-x-3">
        <Button variant="ghost" onClick={() => handleStepChange('text-provider')} className="flex-1">
          <ChevronLeft className="w-4 h-4 mr-2" />
          上一步
        </Button>
        <Button 
          onClick={() => {
            if (!customConfig.name || !customConfig.baseUrl || !customConfig.model || !customConfig.apiKey) {
              setError('请填写完整的配置信息');
              return;
            }
            handleStepChange('image-provider');
          }}
          className="flex-1"
        >
          下一步
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );

  const renderTextConfigStep = () => {
    if (!selectedTextProvider || selectedTextProvider === 'custom') {
      setCurrentStep('image-provider');
      return null;
    }

    const template = API_TEMPLATES.text[selectedTextProvider as keyof typeof API_TEMPLATES.text];

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
              value={textConfig.apiKey || ''}
              onChange={(e) => setTextConfig((prev: Record<string, string>) => ({ ...prev, apiKey: e.target.value }))}
              onFocus={() => setError(null)}
            />
          </div>

          {selectedTextProvider === 'baidu' && (
            <div>
              <label className="block text-sm font-medium mb-2">Secret Key *</label>
              <Input
                type="password"
                placeholder="输入Secret Key"
                value={textConfig.secretKey || ''}
                onChange={(e) => setTextConfig((prev: Record<string, string>) => ({ ...prev, secretKey: e.target.value }))}
                onFocus={() => setError(null)}
              />
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-100 animate-in fade-in slide-in-from-bottom-2">
            {error}
          </div>
        )}

        <div className="flex space-x-3">
          <Button variant="ghost" onClick={() => handleStepChange('text-provider')} className="flex-1">
            <ChevronLeft className="w-4 h-4 mr-2" />
            上一步
          </Button>
          <Button 
            onClick={() => {
              if (!textConfig.apiKey || (selectedTextProvider === 'baidu' && !textConfig.secretKey)) {
                setError('请填写完整的API配置信息');
                return;
              }
              handleStepChange('image-provider');
            }}
            className="flex-1"
          >
            下一步
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

  const renderImageProviderStep = () => (
    <div className="space-y-6 flex flex-col h-full">
      <div className="text-center shrink-0">
        <h3 className="text-xl font-semibold mb-2">选择图像生成API</h3>
        <p className="text-gray-600">选择用于生成PPT图片的AI服务（可选）</p>
      </div>

      <div className="grid grid-cols-1 gap-3 overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar">
        {Object.entries(API_TEMPLATES.image).map(([key, template]) => (
          <button
            key={key}
            onClick={() => {
              setSelectedImageProvider(key);
              setError(null);
            }}
            className={`p-4 border rounded-lg text-left transition-colors ${
              selectedImageProvider === key
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">{template.name}</div>
            {'model' in template && template.model && (
              <div className="text-sm text-gray-600">模型: {template.model}</div>
            )}
            {'baseUrl' in template && template.baseUrl && (
              <div className="text-xs text-gray-500 mt-1">{template.baseUrl}</div>
            )}
          </button>
        ))}
        
        <button
          onClick={() => {
            setSelectedImageProvider('');
            setError(null);
          }}
          className={`p-4 border rounded-lg text-left transition-colors ${
            selectedImageProvider === ''
              ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          }`}
        >
          <div className="font-medium">暂不配置图像API</div>
          <div className="text-sm text-gray-600">稍后可以在设置中添加</div>
        </button>
      </div>

      <div className="shrink-0 space-y-3">
        <div className="flex space-x-3">
          <Button variant="ghost" onClick={() => handleStepChange(selectedTextProvider === 'custom' ? 'custom-config' : 'text-config')} className="flex-1">
            <ChevronLeft className="w-4 h-4 mr-2" />
            上一步
          </Button>
          <Button 
            onClick={() => handleStepChange(selectedImageProvider ? 'image-config' : 'complete')} 
            className="flex-1"
          >
            下一步
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderImageConfigStep = () => {
    if (!selectedImageProvider) {
      setCurrentStep('complete');
      return null;
    }

    const template = API_TEMPLATES.image[selectedImageProvider as keyof typeof API_TEMPLATES.image];

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
              value={imageConfig.apiKey || ''}
              onChange={(e) => setImageConfig((prev: Record<string, string>) => ({ ...prev, apiKey: e.target.value }))}
              onFocus={() => setError(null)}
            />
          </div>

          {selectedImageProvider === 'baidu' && (
            <div>
              <label className="block text-sm font-medium mb-2">Secret Key *</label>
              <Input
                type="password"
                placeholder="输入Secret Key"
                value={imageConfig.secretKey || ''}
                onChange={(e) => setImageConfig((prev: Record<string, string>) => ({ ...prev, secretKey: e.target.value }))}
                onFocus={() => setError(null)}
              />
            </div>
          )}
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-100 animate-in fade-in slide-in-from-bottom-2">
            {error}
          </div>
        )}

        <div className="flex space-x-3">
          <Button variant="ghost" onClick={() => handleStepChange('image-provider')} className="flex-1">
            <ChevronLeft className="w-4 h-4 mr-2" />
            上一步
          </Button>
          <Button 
            onClick={() => {
              if (!imageConfig.apiKey || (selectedImageProvider === 'baidu' && !imageConfig.secretKey)) {
                setError('请填写完整的API配置信息');
                return;
              }
              handleStepChange('complete');
            }}
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
          {(selectedTextProvider === 'custom' ? customConfig.name : selectedTextProvider && API_TEMPLATES.text[selectedTextProvider as keyof typeof API_TEMPLATES.text]?.name) && (
            <div>✅ 文本生成: {selectedTextProvider === 'custom' ? customConfig.name : API_TEMPLATES.text[selectedTextProvider as keyof typeof API_TEMPLATES.text]?.name}</div>
          )}
          {selectedImageProvider && (
            <div>✅ 图像生成: {API_TEMPLATES.image[selectedImageProvider as keyof typeof API_TEMPLATES.image]?.name}</div>
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
      case 'text-provider':
        return renderTextProviderStep();
      case 'custom-config':
        return renderCustomConfigStep();
      case 'text-config':
        return renderTextConfigStep();
      case 'image-provider':
        return renderImageProviderStep();
      case 'image-config':
        return renderImageConfigStep();
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