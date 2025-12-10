import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { History } from './pages/History';
import { OutlineEditor } from './pages/OutlineEditor';
import { DetailEditor } from './pages/DetailEditor';
import { SlidePreview } from './pages/SlidePreview';
import { useProjectStore } from './store/useProjectStore';
import { useApiConfigStore } from './store/useApiConfigStore';
import { Loading, useToast, GithubLink, ApiConfigWizard } from './components/shared';
import { getApiConfigStatus } from './utils/api-config';
import { warmupApiConfigCache } from './utils/api-cache';

function App() {
  const { currentProject, syncProject, error, setError } = useProjectStore();
  const { initializeDefaults } = useApiConfigStore();
  const { show, ToastContainer } = useToast();
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  // 初始化API配置
  useEffect(() => {
    initializeDefaults();
    
    // 预热配置缓存
    warmupApiConfigCache();
    
    // 检查是否需要显示配置向导
    const hasShownWizard = localStorage.getItem('api-config-wizard-shown');
    const status = getApiConfigStatus();
    
    // 如果从未显示过向导且没有配置API，则显示向导
    if (!hasShownWizard && status.status === 'none') {
      // 延迟显示，确保页面已加载
      setTimeout(() => {
        setIsWizardOpen(true);
      }, 1000);
    }
  }, [initializeDefaults]);

  // 恢复项目状态
  useEffect(() => {
    const savedProjectId = localStorage.getItem('currentProjectId');
    if (savedProjectId && !currentProject) {
      syncProject();
    }
  }, []);

  // 显示全局错误
  useEffect(() => {
    if (error) {
      show({ message: error, type: 'error' });
      setError(null);
    }
  }, [error, setError, show]);

  // 关闭向导时标记已显示
  const handleWizardClose = () => {
    setIsWizardOpen(false);
    localStorage.setItem('api-config-wizard-shown', 'true');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/project/:projectId/outline" element={<OutlineEditor />} />
        <Route path="/project/:projectId/detail" element={<DetailEditor />} />
        <Route path="/project/:projectId/preview" element={<SlidePreview />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
      <GithubLink />
      
      {/* API配置向导 */}
      <ApiConfigWizard 
        isOpen={isWizardOpen} 
        onClose={handleWizardClose} 
      />
    </BrowserRouter>
  );
}

export default App;

