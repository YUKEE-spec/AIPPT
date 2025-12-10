"""
API Provider Factory
"""
import logging
from typing import Dict, Type, Optional

from .base import BaseTextProvider, BaseImageProvider, ProviderConfigError
from .google_provider import GoogleTextProvider, GoogleImageProvider
from .openai_provider import OpenAITextProvider, OpenAIImageProvider
from .jimeng_provider import JimengImageProvider

logger = logging.getLogger(__name__)

# Provider registry
TEXT_PROVIDERS: Dict[str, Type[BaseTextProvider]] = {
    'google': GoogleTextProvider,
    'openai': OpenAITextProvider,
    # Add more text providers here
}

IMAGE_PROVIDERS: Dict[str, Type[BaseImageProvider]] = {
    'google': GoogleImageProvider,
    'openai': OpenAIImageProvider,
    'jimeng': JimengImageProvider,
    # Add more image providers here
}


class ProviderFactory:
    """Factory for creating API providers"""
    
    @staticmethod
    def create_text_provider(provider_type: str, api_key: str, 
                           base_url: Optional[str] = None, **kwargs) -> BaseTextProvider:
        """Create a text provider instance"""
        if not api_key:
            raise ProviderConfigError(f"API key is required for {provider_type}")
        
        if provider_type not in TEXT_PROVIDERS:
            raise ProviderConfigError(f"Unknown text provider: {provider_type}")
        
        provider_class = TEXT_PROVIDERS[provider_type]
        
        try:
            return provider_class(api_key=api_key, base_url=base_url, **kwargs)
        except Exception as e:
            logger.error(f"Failed to create text provider {provider_type}: {str(e)}")
            raise ProviderConfigError(f"Failed to initialize {provider_type}: {str(e)}") from e
    
    @staticmethod
    def create_image_provider(provider_type: str, api_key: str,
                            base_url: Optional[str] = None, **kwargs) -> BaseImageProvider:
        """Create an image provider instance"""
        if not api_key:
            raise ProviderConfigError(f"API key is required for {provider_type}")
        
        if provider_type not in IMAGE_PROVIDERS:
            raise ProviderConfigError(f"Unknown image provider: {provider_type}")
        
        provider_class = IMAGE_PROVIDERS[provider_type]
        
        try:
            return provider_class(api_key=api_key, base_url=base_url, **kwargs)
        except Exception as e:
            logger.error(f"Failed to create image provider {provider_type}: {str(e)}")
            raise ProviderConfigError(f"Failed to initialize {provider_type}: {str(e)}") from e
    
    @staticmethod
    def get_available_text_providers() -> list:
        """Get list of available text providers"""
        return list(TEXT_PROVIDERS.keys())
    
    @staticmethod
    def get_available_image_providers() -> list:
        """Get list of available image providers"""
        return list(IMAGE_PROVIDERS.keys())
    
    @staticmethod
    def validate_provider_config(provider_type: str, config: dict, is_image: bool = False) -> bool:
        """Validate provider configuration"""
        providers = IMAGE_PROVIDERS if is_image else TEXT_PROVIDERS
        
        if provider_type not in providers:
            return False
        
        # Basic validation - API key is required
        if not config.get('api_key'):
            return False
        
        return True