import React, { useState, useEffect } from 'react';
import { Settings, Trash2, Eye, EyeOff, Download, Upload, AlertTriangle, Info, Cpu } from 'lucide-react';
import { useApiConfigStore } from '@/store/useApiConfigStore';
import { API_TEMPLATES, type TextApiConfig, type ImageApiConfig } from '@/types/api-config';
import { validateTextApiConfig, validateImageApiConfig, getApiConfigSuggestions } from '@/utils/api-validation';
import { clearApiConfigCache } from '@/utils/api-cache';
import { Button } from './Button';
import { Input } from './Input';
import { Modal } from './Modal';
import { ApiTestButton } from './ApiTestButton';
import { ModelConfigModal } from './ModelConfigModal';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiConfigModal: React.FC<ApiConfigModalProps> = ({ isOpen, onClose }) => {
  const {
    textApis,
    imageApis,
    defaultTextApi,
    defaultImageApi,
    addTextApi,
    addImageApi,
    updateTextApi,
    updateImageApi,
    removeTextApi,
    removeImageApi,
    setDefaultTextApi,
    setDefaultImageApi,
    toggleApiEnabled,
    exportConfig,
    importConfig,
    initializeDefaults,
  } = useApiConfigStore();

  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [editingApi, setEditingApi] = useState<string | null>(null);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [isModelConfigOpen, setIsModelConfigOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      initializeDefaults();
    }
  }, [isOpen, initializeDefaults]);

  const handleAddApi = (type: 'text' | 'image', provider: string) => {
    if (type === 'text') {
      const template = API_TEMPLATES.text[provider as keyof typeof API_TEMPLATES.text];
      if (template) {
        addTextApi({
          ...template,
          apiKey: '',
          enabled: true,
        });
        // 自动展开编辑
      }
    } else {
      const template = API_TEMPLATES.image[provider as keyof typeof API_TEMPLATES.image];
      if (template) {
        addImageApi({
          ...template,
          apiKey: '',
          enabled: true,
        });
      }
    }
  };

  const handleUpdateApi = (id: string, field: string, value: string | number | boolean) => {
    if (activeTab === 'text') {
      updateTextApi(id, { [field]: value } as any);
    } else {
      updateImageApi(id, { [field]: value } as any);
    }
    // 清除缓存，确保下次请求使用新配置
    clearApiConfigCache();
  };

  const handleExportConfig = () => {
    const config = exportConfig();
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'api-config.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const content = e.target?.result as string;
          if (content) {
            importConfig(content);
          }
        } catch (error) {
          alert('配置文件格式错误');
        }
      };
      reader.readAsText(file);
    }
  };

  const toggleShowApiKey = (id: string) => {
    setShowApiKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const renderApiCard = (api: TextApiConfig | ImageApiConfig) => {
    const isEditing = editingApi === api.id;
    const showKey = showApiKeys[api.id];
    
    // 验证配置
    const validation = api.type === 'text' 
      ? validateTextApiConfig(api as TextApiConfig)
      : validateImageApiConfig(api as ImageApiConfig);
    
    // 获取建议配置
    const suggestions = getApiConfigSuggestions(api.provider, api.type);

    return (
      <div key={api.id} className={`border rounded-lg p-4 space-y-3 ${!validation.isValid ? 'border-red-200 bg-red-50' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <input
              type="radio"
              name={`default-${api.type}`}
              checked={api.type === 'text' ? defaultTextApi === api.id : defaultImageApi === api.id}
              onChange={() => {
                if (api.type === 'text') {
                  setDefaultTextApi(api.id);
                } else {
                  setDefaultImageApi(api.id);
                }
              }}
              className="w-4 h-4"
              disabled={!validation.isValid}
            />
            <h3 className="font-medium">{api.name}</h3>
            <span className="text-xs px-2 py-1 bg-gray-100 rounded">
              {api.provider}
            </span>
            {!validation.isValid && (
              <AlertTriangle className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            {validation.isValid && <ApiTestButton api={api} />}
            <button
              onClick={() => toggleApiEnabled(api.type, api.id)}
              className={`p-1.5 rounded transition-colors ${api.enabled ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}
              title={api.enabled ? "已启用" : "已禁用"}
            >
              {api.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button
              onClick={() => setEditingApi(isEditing ? null : api.id)}
              className={`p-1.5 rounded transition-colors ${isEditing ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'}`}
              title="编辑配置"
            >
              <Settings size={16} />
            </button>
            <button
              onClick={() => {
                if (window.confirm('确定要删除这个 API 配置吗？')) {
                  if (api.type === 'text') {
                    removeTextApi(api.id);
                  } else {
                    removeImageApi(api.id);
                  }
                  clearApiConfigCache();
                }
              }}
              className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              title="删除配置"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
        
        {/* 显示验证错误 */}
        {validation.errors.length > 0 && (
          <div className="bg-red-100 border border-red-200 rounded p-2">
            <div className="flex items-center space-x-2 text-red-700 text-sm font-medium mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>配置错误</span>
            </div>
            <ul className="text-red-600 text-sm space-y-1">
              {validation.errors.map((error, index) => (
                <li key={index}>• {error}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* 显示验证警告 */}
        {validation.warnings.length > 0 && (
          <div className="bg-yellow-100 border border-yellow-200 rounded p-2">
            <div className="flex items-center space-x-2 text-yellow-700 text-sm font-medium mb-1">
              <Info className="w-4 h-4" />
              <span>配置提醒</span>
            </div>
            <ul className="text-yellow-600 text-sm space-y-1">
              {validation.warnings.map((warning, index) => (
                <li key={index}>• {warning}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* 显示配置建议 */}
        {suggestions.tips && (
          <div className="bg-blue-50 border border-blue-200 rounded p-2">
            <div className="flex items-center space-x-2 text-blue-700 text-sm font-medium mb-1">
              <Info className="w-4 h-4" />
              <span>使用建议</span>
            </div>
            <p className="text-blue-600 text-sm">{suggestions.tips}</p>
          </div>
        )}

        {isEditing && (
          <div className="space-y-3 pt-3 border-t">
            <div>
              <label className="block text-sm font-medium mb-1">名称</label>
              <Input
                value={api.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateApi(api.id, 'name', e.target.value)}
                placeholder="API名称"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">API密钥</label>
              <div className="flex space-x-2">
                <Input
                  type={showKey ? 'text' : 'password'}
                  value={api.apiKey}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateApi(api.id, 'apiKey', e.target.value)}
                  placeholder="输入API密钥"
                  className="flex-1"
                />
                <button
                  onClick={() => toggleShowApiKey(api.id)}
                  className="p-2 text-gray-600 hover:text-blue-600"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {api.baseUrl !== undefined && (
              <div>
                <label className="block text-sm font-medium mb-1">Base URL</label>
                <Input
                  value={api.baseUrl || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateApi(api.id, 'baseUrl', e.target.value)}
                  placeholder="API基础URL"
                />
              </div>
            )}

            {/* 百度API需要Secret Key */}
            {api.provider === 'baidu' && (
              <div>
                <label className="block text-sm font-medium mb-1">Secret Key</label>
                <div className="flex space-x-2">
                  <Input
                    type={showKey ? 'text' : 'password'}
                    value={api.secretKey || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateApi(api.id, 'secretKey', e.target.value)}
                    placeholder="输入Secret Key"
                    className="flex-1"
                  />
                  <button
                    onClick={() => toggleShowApiKey(api.id + '_secret')}
                    className="p-2 text-gray-600 hover:text-blue-600"
                  >
                    {showApiKeys[api.id + '_secret'] ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {/* OpenAI兼容API的思考模式选项 */}
            {api.type === 'text' && api.provider === 'openai_compatible' && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`thinking_${api.id}`}
                  checked={(api as TextApiConfig).enableThinking || false}
                  onChange={(e) => handleUpdateApi(api.id, 'enableThinking', e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor={`thinking_${api.id}`} className="text-sm text-gray-700">
                  启用思考模式 (适用于DeepSeek等支持推理的模型)
                </label>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">模型</label>
              <Input
                value={api.model || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateApi(api.id, 'model', e.target.value)}
                placeholder="模型名称"
              />
            </div>

            {api.type === 'text' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">最大Token数</label>
                  <Input
                    type="number"
                    value={(api as TextApiConfig).maxTokens || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateApi(api.id, 'maxTokens', parseInt(e.target.value))}
                    placeholder="4096"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">温度</label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="2"
                    value={(api as TextApiConfig).temperature || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateApi(api.id, 'temperature', parseFloat(e.target.value))}
                    placeholder="0.7"
                  />
                </div>
              </>
            )}

            {api.type === 'image' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">宽高比</label>
                  <select
                    value={(api as ImageApiConfig).aspectRatio || ''}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleUpdateApi(api.id, 'aspectRatio', e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="16:9">16:9</option>
                    <option value="4:3">4:3</option>
                    <option value="1:1">1:1</option>
                    <option value="3:4">3:4</option>
                    <option value="9:16">9:16</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">分辨率</label>
                  <Input
                    value={(api as ImageApiConfig).resolution || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateApi(api.id, 'resolution', e.target.value)}
                    placeholder="1024x576"
                  />
                </div>
                {(api as ImageApiConfig).style !== undefined && (
                  <div>
                    <label className="block text-sm font-medium mb-1">风格</label>
                    <Input
                      value={(api as ImageApiConfig).style || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateApi(api.id, 'style', e.target.value)}
                      placeholder="realistic"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="API 配置管理" size="xl">
      <div className="flex flex-col h-[70vh]">
        <div className="flex space-x-4 border-b pb-2 mb-4">
          <button
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'text'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('text')}
          >
            文本生成模型 (LLM)
          </button>
          <button
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === 'image'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('image')}
          >
            图像生成模型
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {/* 顶部操作栏 */}
          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="flex space-x-2">
              <select
                className="border rounded px-3 py-1.5 text-sm bg-white hover:border-blue-400 transition-colors focus:ring-2 focus:ring-blue-100 outline-none"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  if (e.target.value) {
                    handleAddApi(activeTab, e.target.value);
                    e.target.value = ''; // 重置选择
                  }
                }}
                defaultValue=""
              >
                <option value="">+ 添加新模型配置...</option>
                {Object.keys(activeTab === 'text' ? API_TEMPLATES.text : API_TEMPLATES.image).map(
                  (provider) => (
                    <option key={provider} value={provider}>
                      {provider}
                    </option>
                  )
                )}
              </select>
              
              {/* 模型高级配置按钮 (仅在文本模式显示) */}
              {activeTab === 'text' && (
                <button
                  onClick={() => setIsModelConfigOpen(true)}
                  className="flex items-center space-x-1 px-3 py-1.5 border rounded text-sm bg-white hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  title="配置默认模型参数"
                >
                  <Cpu size={14} />
                  <span>模型参数</span>
                </button>
              )}
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={handleExportConfig}
                className="flex items-center space-x-1 px-3 py-1.5 border rounded text-sm bg-white hover:bg-gray-50 text-gray-600 transition-colors"
                title="导出当前配置到文件"
              >
                <Download size={14} />
                <span>导出</span>
              </button>
              <label className="flex items-center space-x-1 px-3 py-1.5 border rounded text-sm bg-white hover:bg-gray-50 text-gray-600 cursor-pointer transition-colors" title="从文件导入配置">
                <Upload size={14} />
                <span>导入</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportConfig}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* API 列表 */}
          <div className="space-y-4">
            {(activeTab === 'text' ? textApis : imageApis).length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500 mb-2">暂无配置</p>
                <p className="text-sm text-gray-400">请从左上角下拉菜单添加一个模型配置</p>
              </div>
            ) : (
              (activeTab === 'text' ? textApis : imageApis).map(renderApiCard)
            )}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t flex justify-end">
          <Button variant="primary" onClick={onClose} className="px-6">
            完成
          </Button>
        </div>
      </div>

      {/* 模型参数配置弹窗 */}
      <ModelConfigModal 
        isOpen={isModelConfigOpen} 
        onClose={() => setIsModelConfigOpen(false)} 
      />
    </Modal>
  );
};