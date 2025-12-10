#!/usr/bin/env python
"""测试正确的图片生成API"""
from google import genai
from google.genai import types
from PIL import Image
from dotenv import load_dotenv
import os

load_dotenv()

client = genai.Client(
    http_options=types.HttpOptions(
        base_url=os.getenv("GOOGLE_API_BASE")
    ),
    api_key=os.getenv("GOOGLE_API_KEY")
)

print("=== 测试正确的图片生成API ===")
print()

prompt = """
利用专业平面设计知识，根据参考图片的色彩与风格生成一页设计风格相同的ppt页面，
标题：Python简介，要求文字清晰锐利，16:9比例。
"""

try:
    print("尝试方法1: generate_content with responseModalities...")
    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=[
            prompt,
            Image.open('../template_g.png'),
        ],
        config=types.GenerateContentConfig(
            response_modalities=['TEXT', 'IMAGE'],
            mediaResolution=types.MediaResolution.MEDIUM,
        )
    )

    print("✅ API调用成功")
    image_found = False
    for part in response.parts:
        if part.text is not None:   
            print(f"文本响应: {part.text[:100]}...")
        elif hasattr(part, 'inline_data') and part.inline_data:
            print("找到inline_data，尝试转换为图片...")
            image = part.as_image()
            if image:
                image.save("test_success.png")
                print(f"✅ ✅ ✅ 图片生成成功！✅ ✅ ✅")
                print(f"已保存为: test_success.png")
                print(f"图片尺寸: {image.size}")
                image_found = True
    
    if not image_found:
        print("⚠️ 未找到图片数据")
        print(f"响应parts数量: {len(response.parts)}")

except Exception as e:
    print(f"❌ 错误: {e}")
    import traceback
    traceback.print_exc()

