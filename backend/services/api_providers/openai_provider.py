"""
OpenAI API provider
"""
import logging
import requests
import base64
from io import BytesIO
from typing import List, Dict, Optional, Union
from PIL import Image

from .base import BaseTextProvider, BaseImageProvider, ProviderError, ProviderAPIError

logger = logging.getLogger(__name__)


class OpenAITextProvider(BaseTextProvider):
    """OpenAI GPT text generation provider"""
    
    def __init__(self, api_key: str, base_url: str = None, **kwargs):
        super().__init__(api_key, base_url, **kwargs)
        
        self.base_url = base_url or 'https://api.openai.com/v1'
        self.model = kwargs.get('model', 'gpt-4')
        self.max_tokens = kwargs.get('max_tokens', 4096)
        self.temperature = kwargs.get('temperature', 0.7)
    
    def generate_text(self, prompt: str, **kwargs) -> str:
        """Generate text using OpenAI GPT"""
        try:
            model = kwargs.get('model', self.model)
            max_tokens = kwargs.get('max_tokens', self.max_tokens)
            temperature = kwargs.get('temperature', self.temperature)
            
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json',
            }
            
            data = {
                'model': model,
                'messages': [
                    {'role': 'user', 'content': prompt}
                ],
                'max_tokens': max_tokens,
                'temperature': temperature,
            }
            
            response = requests.post(
                f'{self.base_url}/chat/completions',
                json=data,
                headers=headers,
                timeout=120
            )
            
            response.raise_for_status()
            result = response.json()
            
            if 'choices' in result and len(result['choices']) > 0:
                return result['choices'][0]['message']['content'].strip()
            
            raise ProviderAPIError("No response content from OpenAI")
            
        except requests.exceptions.RequestException as e:
            logger.error(f"OpenAI text API error: {str(e)}")
            raise ProviderAPIError(f"OpenAI API error: {str(e)}") from e
        except Exception as e:
            logger.error(f"OpenAI text generation error: {str(e)}")
            raise ProviderAPIError(f"OpenAI error: {str(e)}") from e


class OpenAIImageProvider(BaseImageProvider):
    """OpenAI DALL-E image generation provider"""
    
    def __init__(self, api_key: str, base_url: str = None, **kwargs):
        super().__init__(api_key, base_url, **kwargs)
        
        self.base_url = base_url or 'https://api.openai.com/v1'
        self.model = kwargs.get('model', 'dall-e-3')
        self.resolution = kwargs.get('resolution', '1792x1024')
        self.quality = kwargs.get('quality', 'standard')
        self.style = kwargs.get('style', 'vivid')
    
    def _image_to_base64(self, image: Image.Image) -> str:
        """Convert PIL Image to base64 string"""
        buffer = BytesIO()
        image.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        return img_str
    
    def generate_image(self, prompt: str, ref_image: Optional[Image.Image] = None,
                      additional_ref_images: Optional[List[Union[str, Image.Image]]] = None,
                      **kwargs) -> Optional[Image.Image]:
        """Generate image using DALL-E"""
        try:
            model = kwargs.get('model', self.model)
            resolution = kwargs.get('resolution', self.resolution)
            quality = kwargs.get('quality', self.quality)
            style = kwargs.get('style', self.style)
            
            # DALL-E doesn't support reference images in the same way as other models
            # We'll incorporate reference image information into the prompt if provided
            enhanced_prompt = prompt
            if ref_image or additional_ref_images:
                enhanced_prompt += " (Note: Generate in a style consistent with provided reference materials)"
            
            headers = {
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json',
            }
            
            data = {
                'model': model,
                'prompt': enhanced_prompt,
                'size': resolution,
                'quality': quality,
                'style': style,
                'response_format': 'url',
                'n': 1,
            }
            
            response = requests.post(
                f'{self.base_url}/images/generations',
                json=data,
                headers=headers,
                timeout=120
            )
            
            response.raise_for_status()
            result = response.json()
            
            if 'data' in result and len(result['data']) > 0:
                image_url = result['data'][0]['url']
                # Download the generated image
                img_response = requests.get(image_url, timeout=30)
                img_response.raise_for_status()
                return Image.open(BytesIO(img_response.content))
            
            raise ProviderAPIError("No image data in DALL-E response")
            
        except requests.exceptions.RequestException as e:
            logger.error(f"DALL-E API error: {str(e)}")
            raise ProviderAPIError(f"DALL-E API error: {str(e)}") from e
        except Exception as e:
            logger.error(f"DALL-E image generation error: {str(e)}")
            raise ProviderAPIError(f"DALL-E error: {str(e)}") from e
    
    def edit_image(self, prompt: str, current_image: Image.Image,
                  original_description: str = None,
                  additional_ref_images: Optional[List[Union[str, Image.Image]]] = None,
                  **kwargs) -> Optional[Image.Image]:
        """Edit image using DALL-E (using variations since DALL-E doesn't have direct edit)"""
        try:
            # DALL-E 3 doesn't support image editing directly
            # We'll use the variation endpoint or fall back to generation with enhanced prompt
            
            # Build enhanced prompt with edit instruction
            edit_instruction = prompt
            if original_description:
                edit_instruction = f"Based on an image that shows: {original_description}. Please create a new image with this modification: {prompt}"
            
            # Use generate_image with enhanced prompt
            return self.generate_image(edit_instruction, **kwargs)
            
        except Exception as e:
            logger.error(f"DALL-E image editing error: {str(e)}")
            raise ProviderAPIError(f"DALL-E edit error: {str(e)}") from e