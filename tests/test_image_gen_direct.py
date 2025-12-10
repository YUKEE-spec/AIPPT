#!/usr/bin/env python
"""直接测试图片生成 - 不导入demo.py"""
from google import genai
from google.genai import types
from PIL import Image
from dotenv import load_dotenv
import os

load_dotenv()

# 直接初始化client
client = genai.Client(
    http_options=types.HttpOptions(
        base_url=os.getenv("GOOGLE_API_BASE")
    ),
    api_key=os.getenv("GOOGLE_API_KEY")
)

print("=== 测试图片生成（使用generate_content） ===")
print()

prompt = """
利用专业平面设计知识，根据参考图片的色彩与风格生成一页设计风格相同的ppt页面，
标题：Python简介
内容：
- 什么是Python？
- Python的特点：简洁、易读、跨平台
- Python的应用领域

要求文字清晰锐利，画面为4k分辨率 16:9比例。
"""

try:
    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=[
            prompt,
            Image.open('../template_g.png'),
        ],
        config=types.GenerateContentConfig(
            response_modalities=['TEXT', 'IMAGE'],
            image_config=types.ImageConfig(
                aspect_ratio="16:9",
                image_size="2K"
            ),
        )
    )

    print("✅ API调用成功")
    for part in response.parts:
        if part.text is not None:   
            print(f"文本响应: {part.text}")
        elif image := part.as_image():
            image.save("test_final.png")
            print(f"✅ ✅ ✅ 图片生成成功！✅ ✅ ✅")
            print(f"已保存为: test_final.png")
            print(f"图片尺寸: {image.size}")

except Exception as e:
    print(f"❌ 错误: {e}")
    import traceback
    traceback.print_exc()

