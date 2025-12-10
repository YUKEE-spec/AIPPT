import React, { useState, useEffect } from 'react';
import { X, Plus, Settings, Trash2, Eye, EyeOff, Download, Upload, AlertTriangle, Info } from 'lucide-react';
import { useApiConfigStore } from '@/store/useApiConfigStore';
import { API_TEMPLATES, type TextApiConfig, type ImageApiConfig } from '@/types/api-config';
import { validateTextApiConfig, validateImageApiConfig, getApiConfigSuggestions } from '@/utils/api-validation';
import { clearApiConfigCache } from '@/utils/api-cache';
import { Button } from './Button';
import { Input } from './Input';
import { Modal } from './Modal';
import { ApiTestButton } from './ApiTestButton';

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

  const handleUpdateApi = (id: string, field: string, value: any) => {
    if (activeTab === 'text') {
      updateTextApi(id, { [field]: value });
    } else {
      updateImageApi(id, { [field]: value });
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
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          importConfig(content);
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
              <AlertTriangle className="w-4 h-4 text-red-500" title="配置有误" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            {validation.isValid && <ApiTestButton api={api} />}
            <button
              onClick={() => toggleApiEnabled(api.type, api.id)}
              className={`p-1 rounded ${api.enabled ? 'text-green-600' : 'text-gray-400'}`}
            >
              {api.enabled ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button
              onClick={() => setEditingApi(isEditing ? null : api.id)}
              className="p-1 text-gray-600 hover:text-blue-600"
            >
              <Settings size={16} />
            </button>
            <button
              onClick={() => {
                if (api.type === 'text') {
                  removeTextApi(api.id);
                } else {
                  removeImageApi(api.id);
                }
                clearApiConfigCache();
              }}
              className="p-1 text-gray-600 hover:text-red-600"
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
                onChange={(e) => handleUpdateApi(api.id, 'name', e.target.value)}
                placeholder="API名称"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">API密钥</label>
              <div className="flex space-x-2">
                <Input
                  type={showKey ? 'text' : 'password'}
                  value={api.apiKey}
                  onChange={(e) => handleUpdateApi(api.id, 'apiKey', e.target.value)}
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

            {api.baseUrl && (
              <div>
                <label className="block text-sm font-medium mb-1">Base URL</label>
                <Input
                  value={api.baseUrl}
                  onChange={(e) => handleUpdateApi(api.id, 'baseUrl', e.target.value)}
                  placeholder="API基础URL"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">模型</label>
              <Input
                value={api.model || ''}
                onChange={(e) => handleUpdateApi(api.id, 'model', e.target.value)}
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
                    onChange={(e) => handleUpdateApi(api.id, 'maxTokens', parseInt(e.target.value))}
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
                    onChange={(e) => handleUpdateApi(api.id, 'temperature', parseFloat(e.target.value))}
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
                    onChange={(e) => handleUpdateApi(api.id, 'aspectRatio', e.target.value)}
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
                    onChange={(e) => handleUpdateApi(api.id, 'resolution', e.target.value)}
                    placeholder="1024x576"
                  />
                </div>
                {(api as ImageApiConfig).style !== undefined && (
                  <div>
                    <label className="block text-sm font-medium mb-1">风格</label>
                    <Input
                      value={(api as ImageApiConfig).style || ''}
                      onChange={(e) => handleUpdateApi(api.id, 'style', e.target.value)}
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
    <Modal isOpen={isOpen} onClose={onClose} title="API配置管理" size="large">
      <div className="space-y-6">
        {/* 标签页 */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'text'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            文本生成API ({textApis.length})
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'image'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            图像生成API ({imageApis.length})
          </button>
        </div>

        {/* 工具栏 */}
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleAddApi(activeTab, e.target.value);
                  e.target.value = '';
                }
              }}
              className="p-2 border rounded-md text-sm"
              defaultValue=""
            >
              <option value="" disabled>添加API...</option>
              {activeTab === 'text' ? (
                <>
                  <option value="google">Google Gemini</option>
                  <option value="openai">OpenAI GPT</option>
                  <option value="anthropic">Anthropic Claude</option>
                </>
              ) : (
                <>
                  <option value="google">Google Gemini Image</option>
                  <option value="jimeng">即梦AI</option>
                  <option value="dalle">DALL-E 3</option>
                  <option value="midjourney">Midjourney</option>
                  <option value="stable-diffusion">Stable Diffusion</option>
                </>
              )}
            </select>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportConfig}
              className="flex items-center space-x-1"
            >
              <Download size={16} />
              <span>导出配置</span>
            </Button>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".json"
                onChange={handleImportConfig}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-1"
                as="span"
              >
                <Upload size={16} />
                <span>导入配置</span>
              </Button>
            </label>
          </div>
        </div>

        {/* API列表 */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activeTab === 'text' ? (
            textApis.length > 0 ? (
              textApis.map(renderApiCard)
            ) : (
              <div className="text-center py-8 text-gray-500">
                暂无文本生成API配置
              </div>
            )
          ) : (
            imageApis.length > 0 ? (
              imageApis.map(renderApiCard)
            ) : (
              <div className="text-center py-8 text-gray-500">
                暂无图像生成API配置
              </div>
            )
          )}
        </div>

        {/* 说明 */}
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <p className="font-medium mb-1">使用说明：</p>
          <ul className="list-disc list-inside space-y-1">
            <li>选择一个API作为默认使用的API</li>
            <li>可以启用/禁用API，禁用的API不会在生成时使用</li>
            <li>支持导出/导入配置文件，方便备份和分享</li>
            <li>API密钥会安全存储在本地浏览器中</li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};