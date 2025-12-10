#!/usr/bin/env python
"""最简单的图片生成测试"""
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

print("=== 最简单的图片生成测试 ===")
print()

prompt = "生成一张简单的PPT页面，标题：Python简介，使用专业设计风格"

try:
    print("测试: generate_content with IMAGE modality...")
    response = client.models.generate_content(
        model="gemini-3-pro-image-preview",
        contents=[
            prompt,
            Image.open('../template_g.png'),
        ],
        config=types.GenerateContentConfig(
            response_modalities=['TEXT', 'IMAGE'],
        )
    )

    print("✅ API调用成功")
    print(f"响应parts数量: {len(response.parts)}")
    print()
    
    for i, part in enumerate(response.parts):
        print(f"Part {i+1}:")
        if part.text is not None:   
            print(f"  类型: 文本")
            print(f"  内容: {part.text[:200]}...")
        else:
            print(f"  类型: {type(part)}")
            # 尝试不同的方法获取图片
            try:
                image = part.as_image()
                if image:
                    image.save(f"test_gen_part{i+1}.png")
                    print(f"  ✅ ✅ ✅ 图片生成成功！✅ ✅ ✅")
                    print(f"  文件: test_gen_part{i+1}.png")
                    print(f"  尺寸: {image.size}")
            except Exception as e:
                print(f"  无法转换为图片: {e}")

except Exception as e:
    print(f"❌ 错误: {e}")
    import traceback
    traceback.print_exc()

