import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ApiConfig, TextApiConfig, ImageApiConfig, ApiConfigState } from '@/types/api-config';
import { API_TEMPLATES } from '@/types/api-config';

interface ApiConfigStore extends ApiConfigState {
  // Actions
  addTextApi: (config: Omit<TextApiConfig, 'id' | 'type'>) => void;
  addImageApi: (config: Omit<ImageApiConfig, 'id' | 'type'>) => void;
  updateTextApi: (id: string, config: Partial<TextApiConfig>) => void;
  updateImageApi: (id: string, config: Partial<ImageApiConfig>) => void;
  removeTextApi: (id: string) => void;
  removeImageApi: (id: string) => void;
  setDefaultTextApi: (id: string | null) => void;
  setDefaultImageApi: (id: string | null) => void;
  toggleApiEnabled: (type: 'text' | 'image', id: string) => void;
  
  // Getters
  getDefaultTextApi: () => TextApiConfig | null;
  getDefaultImageApi: () => ImageApiConfig | null;
  getEnabledTextApis: () => TextApiConfig[];
  getEnabledImageApis: () => ImageApiConfig[];
  
  // Utilities
  initializeDefaults: () => void;
  exportConfig: () => string;
  importConfig: (configJson: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useApiConfigStore = create<ApiConfigStore>()(
  persist(
    (set, get) => ({
      // Initial state
      textApis: [],
      imageApis: [],
      defaultTextApi: null,
      defaultImageApi: null,

      // Actions
      addTextApi: (config) => {
        const newApi: TextApiConfig = {
          ...config,
          id: generateId(),
          type: 'text',
        };
        set((state) => ({
          textApis: [...state.textApis, newApi],
          // 如果是第一个API，设为默认
          defaultTextApi: state.textApis.length === 0 ? newApi.id : state.defaultTextApi,
        }));
      },

      addImageApi: (config) => {
        const newApi: ImageApiConfig = {
          ...config,
          id: generateId(),
          type: 'image',
        };
        set((state) => ({
          imageApis: [...state.imageApis, newApi],
          // 如果是第一个API，设为默认
          defaultImageApi: state.imageApis.length === 0 ? newApi.id : state.defaultImageApi,
        }));
      },

      updateTextApi: (id, updates) => {
        set((state) => ({
          textApis: state.textApis.map((api) =>
            api.id === id ? { ...api, ...updates } : api
          ),
        }));
      },

      updateImageApi: (id, updates) => {
        set((state) => ({
          imageApis: state.imageApis.map((api) =>
            api.id === id ? { ...api, ...updates } : api
          ),
        }));
      },

      removeTextApi: (id) => {
        set((state) => ({
          textApis: state.textApis.filter((api) => api.id !== id),
          defaultTextApi: state.defaultTextApi === id ? null : state.defaultTextApi,
        }));
      },

      removeImageApi: (id) => {
        set((state) => ({
          imageApis: state.imageApis.filter((api) => api.id !== id),
          defaultImageApi: state.defaultImageApi === id ? null : state.defaultImageApi,
        }));
      },

      setDefaultTextApi: (id) => {
        set({ defaultTextApi: id });
      },

      setDefaultImageApi: (id) => {
        set({ defaultImageApi: id });
      },

      toggleApiEnabled: (type, id) => {
        if (type === 'text') {
          set((state) => ({
            textApis: state.textApis.map((api) =>
              api.id === id ? { ...api, enabled: !api.enabled } : api
            ),
          }));
        } else {
          set((state) => ({
            imageApis: state.imageApis.map((api) =>
              api.id === id ? { ...api, enabled: !api.enabled } : api
            ),
          }));
        }
      },

      // Getters
      getDefaultTextApi: () => {
        const { textApis, defaultTextApi } = get();
        return textApis.find((api) => api.id === defaultTextApi) || null;
      },

      getDefaultImageApi: () => {
        const { imageApis, defaultImageApi } = get();
        return imageApis.find((api) => api.id === defaultImageApi) || null;
      },

      getEnabledTextApis: () => {
        return get().textApis.filter((api) => api.enabled);
      },

      getEnabledImageApis: () => {
        return get().imageApis.filter((api) => api.enabled);
      },

      // Utilities
      initializeDefaults: () => {
        const { textApis, imageApis } = get();
        
        // 如果没有任何配置，添加默认的Google配置
        if (textApis.length === 0 && imageApis.length === 0) {
          // 添加默认的Google文本API
          get().addTextApi({
            ...API_TEMPLATES.text.google,
            apiKey: '',
            enabled: true,
          });
          
          // 添加默认的Google图像API
          get().addImageApi({
            ...API_TEMPLATES.image.google,
            apiKey: '',
            enabled: true,
          });
        }
      },

      exportConfig: () => {
        const { textApis, imageApis, defaultTextApi, defaultImageApi } = get();
        return JSON.stringify({
          textApis,
          imageApis,
          defaultTextApi,
          defaultImageApi,
        }, null, 2);
      },

      importConfig: (configJson) => {
        try {
          const config = JSON.parse(configJson);
          set({
            textApis: config.textApis || [],
            imageApis: config.imageApis || [],
            defaultTextApi: config.defaultTextApi || null,
            defaultImageApi: config.defaultImageApi || null,
          });
        } catch (error) {
          console.error('Failed to import config:', error);
          throw new Error('配置文件格式错误');
        }
      },
    }),
    {
      name: 'api-config-storage',
      version: 1,
    }
  )
);