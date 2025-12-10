import React, { useState } from 'react';
import { MoreHorizontal, TestTube, Power, PowerOff, Trash2 } from 'lucide-react';
import { useApiConfigStore } from '@/store/useApiConfigStore';
import { Button } from './Button';
import { useConfirm } from './ConfirmDialog';

interface ApiBatchActionsProps {
  type: 'text' | 'image';
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export const ApiBatchActions: React.FC<ApiBatchActionsProps> = ({
  type,
  selectedIds,
  onSelectionChange
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { confirm } = useConfirm();
  
  const {
    textApis,
    imageApis,
    toggleApiEnabled,
    removeTextApi,
    removeImageApi,
  } = useApiConfigStore();

  const apis = type === 'text' ? textApis : imageApis;
  const selectedApis = apis.filter(api => selectedIds.includes(api.id));

  const handleSelectAll = () => {
    if (selectedIds.length === apis.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(apis.map(api => api.id));
    }
  };

  const handleBatchEnable = () => {
    selectedIds.forEach(id => {
      const api = apis.find(a => a.id === id);
      if (api && !api.enabled) {
        toggleApiEnabled(type, id);
      }
    });
    onSelectionChange([]);
  };

  const handleBatchDisable = () => {
    selectedIds.forEach(id => {
      const api = apis.find(a => a.id === id);
      if (api && api.enabled) {
        toggleApiEnabled(type, id);
      }
    });
    onSelectionChange([]);
  };

  const handleBatchDelete = async () => {
    const confirmed = await confirm({
      title: '批量删除API配置',
      message: `确定要删除选中的 ${selectedIds.length} 个API配置吗？此操作不可撤销。`,
      confirmText: '删除',
      cancelText: '取消',
      type: 'danger'
    });

    if (confirmed) {
      selectedIds.forEach(id => {
        if (type === 'text') {
          removeTextApi(id);
        } else {
          removeImageApi(id);
        }
      });
      onSelectionChange([]);
    }
  };

  const handleBatchTest = () => {
    // 这里可以实现批量测试功能
    console.log('批量测试API连接:', selectedIds);
  };

  if (apis.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={selectedIds.length === apis.length}
          onChange={handleSelectAll}
          className="w-4 h-4"
        />
        <span className="text-sm text-gray-600">
          {selectedIds.length > 0 ? `已选择 ${selectedIds.length} 项` : '全选'}
        </span>
      </div>

      {selectedIds.length > 0 && (
        <div className="flex items-center space-x-1 ml-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBatchEnable}
            disabled={selectedApis.every(api => api.enabled)}
            className="flex items-center space-x-1"
          >
            <Power className="w-4 h-4" />
            <span>启用</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleBatchDisable}
            disabled={selectedApis.every(api => !api.enabled)}
            className="flex items-center space-x-1"
          >
            <PowerOff className="w-4 h-4" />
            <span>禁用</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleBatchTest}
            className="flex items-center space-x-1"
          >
            <TestTube className="w-4 h-4" />
            <span>测试</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleBatchDelete}
            className="flex items-center space-x-1 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
            <span>删除</span>
          </Button>
        </div>
      )}
    </div>
  );
};