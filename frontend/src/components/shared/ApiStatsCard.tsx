import React from 'react';
import { TrendingUp, TrendingDown, Clock, Activity } from 'lucide-react';
import { getProviderStats, getSuccessRate, formatResponseTime, getUsageFrequency } from '@/utils/api-stats';
import type { TextApiConfig, ImageApiConfig } from '@/types/api-config';

interface ApiStatsCardProps {
  api: TextApiConfig | ImageApiConfig;
  className?: string;
}

export const ApiStatsCard: React.FC<ApiStatsCardProps> = ({ api, className = '' }) => {
  const stats = getProviderStats(api.provider, api.type);

  if (!stats || stats.totalRequests === 0) {
    return (
      <div className={`bg-gray-50 rounded-lg p-3 ${className}`}>
        <div className="text-center text-gray-500 text-sm">
          <Activity className="w-4 h-4 mx-auto mb-1" />
          暂无使用数据
        </div>
      </div>
    );
  }

  const successRate = getSuccessRate(stats);
  const usageFrequency = getUsageFrequency(stats);

  return (
    <div className={`bg-white border rounded-lg p-3 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-sm">使用统计</h4>
        <span className="text-xs text-gray-500">{usageFrequency}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* 成功率 */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            {successRate >= 90 ? (
              <TrendingUp className="w-3 h-3 text-green-600" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-600" />
            )}
            <span className={`text-sm font-medium ${
              successRate >= 90 ? 'text-green-600' : 
              successRate >= 70 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {successRate.toFixed(1)}%
            </span>
          </div>
          <div className="text-xs text-gray-500">成功率</div>
        </div>

        {/* 响应时间 */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Clock className="w-3 h-3 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              {formatResponseTime(stats.averageResponseTime)}
            </span>
          </div>
          <div className="text-xs text-gray-500">平均响应</div>
        </div>
      </div>

      {/* 详细统计 */}
      <div className="border-t pt-2">
        <div className="flex justify-between text-xs text-gray-600">
          <span>总请求: {stats.totalRequests}</span>
          <span>成功: {stats.successCount}</span>
          <span>失败: {stats.errorCount}</span>
        </div>
      </div>
    </div>
  );
};