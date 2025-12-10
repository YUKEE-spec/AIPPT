/**
 * API使用统计工具
 */

interface ApiUsageStats {
  provider: string;
  type: 'text' | 'image';
  successCount: number;
  errorCount: number;
  lastUsed: Date | null;
  totalRequests: number;
  averageResponseTime: number;
}

const STATS_STORAGE_KEY = 'api-usage-stats';

/**
 * 获取API使用统计
 */
export const getApiStats = (): ApiUsageStats[] => {
  try {
    const stored = localStorage.getItem(STATS_STORAGE_KEY);
    if (stored) {
      const stats = JSON.parse(stored);
      // 转换日期字符串为Date对象
      return stats.map((stat: any) => ({
        ...stat,
        lastUsed: stat.lastUsed ? new Date(stat.lastUsed) : null
      }));
    }
  } catch (error) {
    console.error('Failed to load API stats:', error);
  }
  return [];
};

/**
 * 保存API使用统计
 */
const saveApiStats = (stats: ApiUsageStats[]) => {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Failed to save API stats:', error);
  }
};

/**
 * 记录API使用
 */
export const recordApiUsage = (
  provider: string,
  type: 'text' | 'image',
  success: boolean,
  responseTime?: number
) => {
  const stats = getApiStats();
  const existingIndex = stats.findIndex(
    s => s.provider === provider && s.type === type
  );

  if (existingIndex >= 0) {
    // 更新现有统计
    const existing = stats[existingIndex];
    existing.totalRequests += 1;
    existing.lastUsed = new Date();
    
    if (success) {
      existing.successCount += 1;
    } else {
      existing.errorCount += 1;
    }

    if (responseTime !== undefined) {
      // 计算平均响应时间
      existing.averageResponseTime = 
        (existing.averageResponseTime * (existing.totalRequests - 1) + responseTime) / 
        existing.totalRequests;
    }
  } else {
    // 创建新统计
    stats.push({
      provider,
      type,
      successCount: success ? 1 : 0,
      errorCount: success ? 0 : 1,
      lastUsed: new Date(),
      totalRequests: 1,
      averageResponseTime: responseTime || 0
    });
  }

  saveApiStats(stats);
};

/**
 * 获取特定API的统计
 */
export const getProviderStats = (provider: string, type: 'text' | 'image'): ApiUsageStats | null => {
  const stats = getApiStats();
  return stats.find(s => s.provider === provider && s.type === type) || null;
};

/**
 * 清除API统计
 */
export const clearApiStats = () => {
  localStorage.removeItem(STATS_STORAGE_KEY);
};

/**
 * 获取成功率
 */
export const getSuccessRate = (stats: ApiUsageStats): number => {
  if (stats.totalRequests === 0) return 0;
  return (stats.successCount / stats.totalRequests) * 100;
};

/**
 * 格式化响应时间
 */
export const formatResponseTime = (ms: number): string => {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  } else {
    return `${(ms / 1000).toFixed(1)}s`;
  }
};

/**
 * 获取使用频率描述
 */
export const getUsageFrequency = (stats: ApiUsageStats): string => {
  if (!stats.lastUsed) return '从未使用';
  
  const now = new Date();
  const diffMs = now.getTime() - stats.lastUsed.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  const diffDays = diffHours / 24;

  if (diffHours < 1) {
    return '刚刚使用';
  } else if (diffHours < 24) {
    return `${Math.round(diffHours)}小时前`;
  } else if (diffDays < 7) {
    return `${Math.round(diffDays)}天前`;
  } else {
    return '很久未使用';
  }
};