// API配置相关类型定义

export interface BaseApiConfig {
  id: string;
  name: string;
  type: 'text' | 'image';
  enabled: boolean;
}

export interface TextApiConfig extends BaseApiConfig {
  type: 'text';
  provider: 'google' | 'openai' | 'anthropic' | 'custom';
  apiKey: string;
  baseUrl?: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
}

export interface ImageApiConfig extends BaseApiConfig {
  type: 'image';
  provider: 'google' | 'jimeng' | 'midjourney' | 'dalle' | 'stable-diffusion' | 'custom';
  apiKey: string;
  baseUrl?: string;
  model?: string;
  aspectRatio?: string;
  resolution?: string;
  style?: string;
}

export type ApiConfig = TextApiConfig | ImageApiConfig;

export interface ApiConfigState {
  textApis: TextApiConfig[];
  imageApis: ImageApiConfig[];
  defaultTextApi: string | null;
  defaultImageApi: string | null;
}

// 预设的API配置模板
export const API_TEMPLATES = {
  text: {
    google: {
      name: 'Google Gemini',
      provider: 'google' as const,
      baseUrl: 'https://generativelanguage.googleapis.com',
      model: 'gemini-2.5-flash',
      maxTokens: 8192,
      temperature: 0.7,
    },
    openai: {
      name: 'OpenAI GPT',
      provider: 'openai' as const,
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4',
      maxTokens: 4096,
      temperature: 0.7,
    },
    anthropic: {
      name: 'Anthropic Claude',
      provider: 'anthropic' as const,
      baseUrl: 'https://api.anthropic.com',
      model: 'claude-3-sonnet-20240229',
      maxTokens: 4096,
      temperature: 0.7,
    },
  },
  image: {
    google: {
      name: 'Google Gemini Image',
      provider: 'google' as const,
      model: 'gemini-3-pro-image-preview',
      aspectRatio: '16:9',
      resolution: '2K',
    },
    jimeng: {
      name: '即梦AI',
      provider: 'jimeng' as const,
      baseUrl: 'https://api.jimeng.ai',
      model: 'jimeng-v1',
      aspectRatio: '16:9',
      resolution: '1024x576',
      style: 'realistic',
    },
    dalle: {
      name: 'DALL-E 3',
      provider: 'dalle' as const,
      baseUrl: 'https://api.openai.com/v1',
      model: 'dall-e-3',
      resolution: '1792x1024',
    },
    midjourney: {
      name: 'Midjourney',
      provider: 'midjourney' as const,
      baseUrl: 'https://api.midjourney.com',
      aspectRatio: '16:9',
      resolution: 'high',
      style: 'v6',
    },
    'stable-diffusion': {
      name: 'Stable Diffusion',
      provider: 'stable-diffusion' as const,
      baseUrl: 'https://api.stability.ai',
      model: 'stable-diffusion-xl-1024-v1-0',
      resolution: '1024x576',
    },
  },
} as const;