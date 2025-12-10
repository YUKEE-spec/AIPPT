"""
即梦AI API provider
"""
import logging
import requests
import base64
from io import BytesIO
from typing import List, Dict, Optional, Union
from PIL import Image

from .base import BaseImageProvider, ProviderError, ProviderAPIError

logger = logging.getLogger(__name__)


class JimengImageProvider(BaseImageProvider):
    """即梦AI图像生成提供商"""
    
    def __init__(self, api_key: str, base_url: str = None, **kwargs):
        super().__init__(api_key, base_url, **kwargs)
        
        self.base_url = base_url or 'https://api.jimeng.ai'
        self.model = kwargs.get('model', 'jimeng-v1')
        self.aspect_ratio = kwargs.get('aspect_ratio', '16:9')
        self.resolution = kwargs.get('resolution', '1024x576')
        self.style = kwargs.get('style', 'realistic')
    
    def _image_to_base64(self, image: Image.Image) -> str:
        """Convert PIL Image to base64 string"""
        buffer = BytesIO()
        image.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        return img_str
    
    def _base64_to_image(self, base64_str: str) -> Image.Image:
        """Convert base64 string to PIL Image"""
        img_data = base64.b64decode(base64_str)
        return Image.open(BytesIO(img_data))
    
    def generate_image(self, prompt: str, ref_image: Optional[Image.Image] = None,
                      additional_ref_images: Optional[List[Union[str, Image.Image]]] = None,
                      **kwargs) -> Optional[Image.Image]:
        """Generate image using 即梦AI"""
        try:
            model = kwargs.get('model', self.model)
            aspect_ratio = kwargs.get('aspect_ratio', self.aspect_ratio)
            resolution = kwargs.get('resolution', self.resolution)
            style = kwargs.get('style', self.style)
            
            # Prepare request data
            data = {
                'prompt': prompt,
                'model': model,
                'aspect_ratio': aspect_ratio,
                'resolution': resolution,
                'style': style,
            }
            
            # Add reference image if provided
            if ref_image:
                data['reference_image'] = self._image_to_base64(ref_image)
            
            # Add additional reference images
            if additional_ref_images:
                ref_images_b64 = []
                for ref_img in additional_ref_images:
                    if isinstance(ref_img, Image.Image):
                        ref_images_b64.append(self._image_to_base64(ref_img))
                    elif isinstance(ref_img, str) and ref_img.startswith('http'):
                        # Download and convert URL images
                        try:
                            response = requests.get(ref_img, timeout=30)
                            response.raise_for_status()
                            img = Image.open(BytesIO(response.content))
                            ref_images_b64.append(self._image_to_base64(img))
                        except Exception as e:
                            logger.warning(f"Failed to download reference image {ref_img}: {e}")
                
                if ref_images_b64:
                    data['additional_references'] = ref_images_b64
            
            # Make API request
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json',
            }
            
            response = requests.post(
                f'{self.base_url}/v1/images/generate',
                json=data,
                headers=headers,
                timeout=120  # 2 minutes timeout for image generation
            )
            
            response.raise_for_status()
            result = response.json()
            
            # Extract generated image
            if 'data' in result and len(result['data']) > 0:
                image_data = result['data'][0]
                if 'b64_json' in image_data:
                    return self._base64_to_image(image_data['b64_json'])
                elif 'url' in image_data:
                    # Download image from URL
                    img_response = requests.get(image_data['url'], timeout=30)
                    img_response.raise_for_status()
                    return Image.open(BytesIO(img_response.content))
            
            raise ProviderAPIError("No image data in response")
            
        except requests.exceptions.RequestException as e:
            logger.error(f"即梦AI API request error: {str(e)}")
            raise ProviderAPIError(f"即梦AI API error: {str(e)}") from e
        except Exception as e:
            logger.error(f"即梦AI image generation error: {str(e)}")
            raise ProviderAPIError(f"即梦AI error: {str(e)}") from e
    
    def edit_image(self, prompt: str, current_image: Image.Image,
                  original_description: str = None,
                  additional_ref_images: Optional[List[Union[str, Image.Image]]] = None,
                  **kwargs) -> Optional[Image.Image]:
        """Edit image using 即梦AI"""
        try:
            # Build edit instruction
            edit_instruction = prompt
            if original_description:
                edit_instruction = f"基于原图描述：{original_description}\n\n修改要求：{prompt}"
            
            # Prepare request data for image editing
            data = {
                'prompt': edit_instruction,
                'image': self._image_to_base64(current_image),
                'model': kwargs.get('model', self.model),
                'style': kwargs.get('style', self.style),
            }
            
            # Add additional reference images
            if additional_ref_images:
                ref_images_b64 = []
                for ref_img in additional_ref_images:
                    if isinstance(ref_img, Image.Image):
                        ref_images_b64.append(self._image_to_base64(ref_img))
                
                if ref_images_b64:
                    data['additional_references'] = ref_images_b64
            
            # Make API request
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json',
            }
            
            response = requests.post(
                f'{self.base_url}/v1/images/edit',
                json=data,
                headers=headers,
                timeout=120
            )
            
            response.raise_for_status()
            result = response.json()
            
            # Extract edited image
            if 'data' in result and len(result['data']) > 0:
                image_data = result['data'][0]
                if 'b64_json' in image_data:
                    return self._base64_to_image(image_data['b64_json'])
                elif 'url' in image_data:
                    img_response = requests.get(image_data['url'], timeout=30)
                    img_response.raise_for_status()
                    return Image.open(BytesIO(img_response.content))
            
            raise ProviderAPIError("No image data in edit response")
            
        except requests.exceptions.RequestException as e:
            logger.error(f"即梦AI edit API error: {str(e)}")
            raise ProviderAPIError(f"即梦AI edit error: {str(e)}") from e
        except Exception as e:
            logger.error(f"即梦AI image editing error: {str(e)}")
            raise ProviderAPIError(f"即梦AI edit error: {str(e)}") from e