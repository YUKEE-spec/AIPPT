"""
Google Gemini API provider
"""
import logging
from typing import List, Dict, Optional, Union
from PIL import Image
from google import genai
from google.genai import types

from .base import BaseTextProvider, BaseImageProvider, ProviderError, ProviderAPIError

logger = logging.getLogger(__name__)


class GoogleTextProvider(BaseTextProvider):
    """Google Gemini text generation provider"""
    
    def __init__(self, api_key: str, base_url: str = None, **kwargs):
        super().__init__(api_key, base_url, **kwargs)
        
        # Initialize client
        http_options = None
        if base_url:
            http_options = types.HttpOptions(base_url=base_url)
        
        self.client = genai.Client(
            http_options=http_options,
            api_key=api_key
        )
        
        # Default model
        self.model = kwargs.get('model', 'gemini-2.5-flash')
        self.max_tokens = kwargs.get('max_tokens', 8192)
        self.temperature = kwargs.get('temperature', 0.7)
    
    def generate_text(self, prompt: str, **kwargs) -> str:
        """Generate text using Gemini"""
        try:
            model = kwargs.get('model', self.model)
            max_tokens = kwargs.get('max_tokens', self.max_tokens)
            temperature = kwargs.get('temperature', self.temperature)
            
            config = types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(thinking_budget=1000),
                max_output_tokens=max_tokens,
                temperature=temperature,
            )
            
            response = self.client.models.generate_content(
                model=model,
                contents=prompt,
                config=config,
            )
            
            return response.text.strip()
            
        except Exception as e:
            logger.error(f"Google text generation error: {str(e)}")
            raise ProviderAPIError(f"Google API error: {str(e)}") from e


class GoogleImageProvider(BaseImageProvider):
    """Google Gemini image generation provider"""
    
    def __init__(self, api_key: str, base_url: str = None, **kwargs):
        super().__init__(api_key, base_url, **kwargs)
        
        # Initialize client
        http_options = None
        if base_url:
            http_options = types.HttpOptions(base_url=base_url)
        
        self.client = genai.Client(
            http_options=http_options,
            api_key=api_key
        )
        
        # Default model and settings
        self.model = kwargs.get('model', 'gemini-3-pro-image-preview')
        self.aspect_ratio = kwargs.get('aspect_ratio', '16:9')
        self.resolution = kwargs.get('resolution', '2K')
    
    def generate_image(self, prompt: str, ref_image: Optional[Image.Image] = None,
                      additional_ref_images: Optional[List[Union[str, Image.Image]]] = None,
                      **kwargs) -> Optional[Image.Image]:
        """Generate image using Gemini"""
        try:
            model = kwargs.get('model', self.model)
            aspect_ratio = kwargs.get('aspect_ratio', self.aspect_ratio)
            resolution = kwargs.get('resolution', self.resolution)
            
            # Build contents list
            contents = []
            
            # Add reference image if provided
            if ref_image:
                contents.append(ref_image)
            
            # Add prompt
            contents.append(prompt)
            
            # Add additional reference images
            if additional_ref_images:
                for ref_img in additional_ref_images:
                    if isinstance(ref_img, Image.Image):
                        contents.append(ref_img)
                    elif isinstance(ref_img, str):
                        # Handle URL or path - this would need to be implemented
                        # based on the original logic in ai_service.py
                        pass
            
            logger.debug(f"Calling Gemini API for image generation with {len(contents) - 1} reference images...")
            
            response = self.client.models.generate_content(
                model=model,
                contents=contents,
                config=types.GenerateContentConfig(
                    response_modalities=['TEXT', 'IMAGE'],
                    image_config=types.ImageConfig(
                        aspect_ratio=aspect_ratio,
                        image_size=resolution
                    ),
                )
            )
            
            # Extract image from response
            for i, part in enumerate(response.parts):
                if part.text is None:
                    try:
                        image = part.as_image()
                        if image:
                            logger.debug(f"Successfully extracted image from part {i}")
                            return image
                    except Exception as e:
                        logger.debug(f"Part {i}: Failed to extract image - {str(e)}")
            
            raise ProviderAPIError("No image found in API response")
            
        except Exception as e:
            logger.error(f"Google image generation error: {str(e)}")
            raise ProviderAPIError(f"Google API error: {str(e)}") from e
    
    def edit_image(self, prompt: str, current_image: Image.Image,
                  original_description: str = None,
                  additional_ref_images: Optional[List[Union[str, Image.Image]]] = None,
                  **kwargs) -> Optional[Image.Image]:
        """Edit image using Gemini"""
        # Build edit instruction
        edit_instruction = prompt
        if original_description:
            edit_instruction = f"Original description: {original_description}\n\nEdit instruction: {prompt}"
        
        # Use generate_image with current image as reference
        return self.generate_image(
            edit_instruction, 
            ref_image=current_image,
            additional_ref_images=additional_ref_images,
            **kwargs
        )