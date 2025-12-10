#!/usr/bin/env python
"""
测试 AI 服务是否正常工作
"""
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent / 'backend'))
from services.ai_service import AIService

def test_ai_service():
    """测试 AI 服务基本功能"""
    api_key = os.getenv('GOOGLE_API_KEY')
    api_base = os.getenv('GOOGLE_API_BASE', '')
    
    if not api_key:
        print("❌ GOOGLE_API_KEY 未设置")
        return False
    
    print(f"✓ API Key: {api_key[:20]}...")
    print(f"✓ API Base: {api_base}")
    
    try:
        ai_service = AIService(api_key, api_base)
        print("✓ AI Service 初始化成功")
        
        # 测试生成大纲
        print("\n测试生成大纲...")
        idea = "生成一份关于人工智能的简短PPT，包括3页"
        outline = ai_service.generate_outline(idea)
        
        print(f"✓ 大纲生成成功，共 {len(outline)} 页")
        for i, page in enumerate(outline[:2], 1):  # 只显示前2页
            print(f"  页{i}: {page.get('title', 'N/A')}")
        
        # 测试生成描述
        if outline:
            print("\n测试生成页面描述...")
            pages_data = ai_service.flatten_outline(outline)
            if pages_data:
                desc = ai_service.generate_page_description(
                    idea, outline, pages_data[0], 1
                )
                print(f"✓ 描述生成成功，长度: {len(desc)} 字符")
                print(f"  预览: {desc[:100]}...")
        
        print("\n✅ AI 服务测试通过！")
        return True
        
    except Exception as e:
        print(f"\n❌ AI 服务测试失败: {str(e)}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("测试 AI 服务")
    print("=" * 60)
    print()
    
    success = test_ai_service()
    
    if success:
        print("\n" + "=" * 60)
        print("所有测试通过！AI 服务正常工作。")
        print("=" * 60)
    else:
        print("\n" + "=" * 60)
        print("测试失败！请检查 API 密钥和网络连接。")
        print("=" * 60)

