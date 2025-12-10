#!/usr/bin/env python
"""
单独测试图片生成端点
"""
import os
import sys
import time
import requests
import json
from dotenv import load_dotenv

load_dotenv()

BASE_URL = "http://localhost:5000/api"

def test_image_generation():
    """测试图片生成功能"""
    print("=" * 80)
    print("测试图片生成端点")
    print("=" * 80)
    print()
    
    # 1. 创建项目
    print("1. 创建项目...")
    response = requests.post(
        f"{BASE_URL}/projects",
        json={
            "creation_type": "idea",
            "idea_prompt": "生成一份关于AI的PPT，共2页"
        }
    )
    
    if response.status_code not in [200, 201]:
        print(f"❌ 创建项目失败: {response.status_code}")
        return
    
    project_id = response.json()['data']['project_id']
    print(f"✓ 项目ID: {project_id}")
    print()
    
    # 2. 上传模板
    print("2. 上传模板...")
    template_path = "../../template_g.png"
    if os.path.exists(template_path):
        with open(template_path, 'rb') as f:
            response = requests.post(
                f"{BASE_URL}/projects/{project_id}/template",
                files={'template_image': f}
            )
        
        if response.status_code == 200:
            print(f"✓ 模板上传成功")
        else:
            print(f"⚠ 模板上传失败: {response.status_code}")
    else:
        print(f"⚠ 模板文件不存在: {template_path}")
    print()
    
    # 3. 生成大纲
    print("3. 生成大纲...")
    response = requests.post(
        f"{BASE_URL}/projects/{project_id}/generate/outline",
        json={"idea_prompt": "生成一份关于AI的PPT，共2页"}
    )
    
    if response.status_code != 200:
        print(f"❌ 生成大纲失败: {response.status_code}")
        print(response.text)
        return
    
    pages = response.json()['data']['pages']
    print(f"✓ 生成了 {len(pages)} 页大纲")
    for i, page in enumerate(pages, 1):
        print(f"  页{i}: {page['outline_content']['title']}")
    print()
    
    # 4. 生成描述
    print("4. 生成页面描述...")
    response = requests.post(
        f"{BASE_URL}/projects/{project_id}/generate/descriptions",
        json={"max_workers": 2}
    )
    
    if response.status_code not in [200, 202]:
        print(f"❌ 生成描述失败: {response.status_code}")
        print(response.text)
        return
    
    task_id = response.json()['data']['task_id']
    print(f"✓ 描述任务ID: {task_id}")
    
    # 等待描述生成完成
    print("  等待描述生成...")
    for i in range(60):  # 最多等待60秒
        time.sleep(1)
        response = requests.get(f"{BASE_URL}/projects/{project_id}/tasks/{task_id}")
        if response.status_code == 200:
            data = response.json()['data']
            status = data['status']
            progress = data['progress']
            print(f"    进度: {progress['completed']}/{progress['total']}, 状态: {status}")
            
            if status == 'COMPLETED':
                print(f"  ✓ 描述生成完成")
                break
            elif status == 'FAILED':
                print(f"  ❌ 描述生成失败: {data.get('error_message', 'Unknown')}")
                return
    print()
    
    # 5. 生成图片（重点测试）
    print("5. 生成图片...")
    print("=" * 80)
    response = requests.post(
        f"{BASE_URL}/projects/{project_id}/generate/images",
        json={
            "max_workers": 2,
            "use_template": True
        }
    )
    
    print(f"响应状态码: {response.status_code}")
    print(f"响应内容: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    
    if response.status_code not in [200, 202]:
        print(f"❌ 生成图片请求失败")
        return
    
    task_id = response.json()['data']['task_id']
    print(f"✓ 图片任务ID: {task_id}")
    print()
    
    # 等待图片生成完成
    print("等待图片生成（这可能需要较长时间）...")
    for i in range(120):  # 最多等待2分钟
        time.sleep(2)
        response = requests.get(f"{BASE_URL}/projects/{project_id}/tasks/{task_id}")
        if response.status_code == 200:
            data = response.json()['data']
            status = data['status']
            progress = data['progress']
            error_msg = data.get('error_message', '')
            
            print(f"  [{i*2}s] 进度: {progress['completed']}/{progress['total']}, "
                  f"失败: {progress['failed']}, 状态: {status}")
            
            if error_msg:
                print(f"  错误信息: {error_msg}")
            
            if status == 'COMPLETED':
                print(f"\n✅ 图片生成完成！")
                print(f"  成功: {progress['completed']}/{progress['total']}")
                break
            elif status == 'FAILED':
                print(f"\n❌ 图片生成失败！")
                print(f"  错误: {error_msg}")
                return
    
    print()
    print("=" * 80)
    print("测试完成！")
    print("=" * 80)


if __name__ == "__main__":
    test_image_generation()

