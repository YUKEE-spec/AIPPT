import { useApiConfigStore } from '@/store/useApiConfigStore';
import { getCachedApiConfig } from './api-cache';
import type { ApiConfig } from '@/types/api-config';

/**
 * 获取当前的API配置，用于发送到后端（使用缓存优化）
 */
export const getApiConfigForRequest = () => {
  return getCachedApiConfig();
};

/**
 * 检查是否有可用的文本API配置
 */
export const hasTextApiConfig = (): boolean => {
  const store = useApiConfigStore.getState();
  const defaultTextApi = store.getDefaultTextApi();
  return !!(defaultTextApi && defaultTextApi.enabled && defaultTextApi.apiKey);
};

/**
 * 检查是否有可用的图像API配置
 */
export const hasImageApiConfig = (): boolean => {
  const store = useApiConfigStore.getState();
  const defaultImageApi = store.getDefaultImageApi();
  return !!(defaultImageApi && defaultImageApi.enabled && defaultImageApi.apiKey);
};

/**
 * 获取API配置状态摘要
 */
export const getApiConfigStatus = () => {
  const hasText = hasTextApiConfig();
  const hasImage = hasImageApiConfig();
  
  return {
    hasText,
    hasImage,
    hasAny: hasText || hasImage,
    isComplete: hasText && hasImage,
    status: hasText && hasImage ? 'complete' : 
            hasText || hasImage ? 'partial' : 'none'
  };
};