"""
API Configuration Controller
"""
import logging
from flask import Blueprint, request, jsonify
from services.api_providers.factory import ProviderFactory
from utils.response import success_response, error_response

logger = logging.getLogger(__name__)

api_config_bp = Blueprint('api_config', __name__, url_prefix='/api/config')


@api_config_bp.route('/providers', methods=['GET'])
def get_available_providers():
    """Get list of available API providers"""
    try:
        text_providers = ProviderFactory.get_available_text_providers()
        image_providers = ProviderFactory.get_available_image_providers()
        
        return success_response({
            'text_providers': text_providers,
            'image_providers': image_providers
        })
    except Exception as e:
        logger.error(f"Error getting providers: {str(e)}")
        return error_response(f"Failed to get providers: {str(e)}")


@api_config_bp.route('/validate', methods=['POST'])
def validate_api_config():
    """Validate API configuration"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response("No configuration data provided")
        
        provider_type = data.get('provider')
        config = data.get('config', {})
        is_image = data.get('is_image', False)
        
        if not provider_type:
            return error_response("Provider type is required")
        
        # Validate configuration
        is_valid = ProviderFactory.validate_provider_config(
            provider_type, config, is_image
        )
        
        if not is_valid:
            return error_response("Invalid configuration")
        
        # Try to create provider instance to test configuration
        try:
            if is_image:
                provider = ProviderFactory.create_image_provider(
                    provider_type=provider_type,
                    api_key=config.get('api_key', ''),
                    base_url=config.get('base_url'),
                    **{k: v for k, v in config.items() if k not in ['api_key', 'base_url']}
                )
            else:
                provider = ProviderFactory.create_text_provider(
                    provider_type=provider_type,
                    api_key=config.get('api_key', ''),
                    base_url=config.get('base_url'),
                    **{k: v for k, v in config.items() if k not in ['api_key', 'base_url']}
                )
            
            return success_response({
                'valid': True,
                'message': 'Configuration is valid'
            })
            
        except Exception as e:
            return error_response(f"Configuration test failed: {str(e)}")
        
    except Exception as e:
        logger.error(f"Error validating config: {str(e)}")
        return error_response(f"Validation error: {str(e)}")


@api_config_bp.route('/test', methods=['POST'])
def test_api_connection():
    """Test API connection with a simple request"""
    try:
        data = request.get_json()
        
        if not data:
            return error_response("No configuration data provided")
        
        provider_type = data.get('provider')
        config = data.get('config', {})
        is_image = data.get('is_image', False)
        
        if not provider_type:
            return error_response("Provider type is required")
        
        # Create provider instance
        try:
            if is_image:
                provider = ProviderFactory.create_image_provider(
                    provider_type=provider_type,
                    api_key=config.get('api_key', ''),
                    base_url=config.get('base_url'),
                    **{k: v for k, v in config.items() if k not in ['api_key', 'base_url']}
                )
                
                # Test with a simple image generation request
                # Note: This is a basic test and may consume API credits
                test_prompt = "A simple test image of a blue circle"
                result = provider.generate_image(test_prompt)
                
                if result:
                    return success_response({
                        'success': True,
                        'message': 'Image API connection successful'
                    })
                else:
                    return error_response("Image generation test failed")
                    
            else:
                provider = ProviderFactory.create_text_provider(
                    provider_type=provider_type,
                    api_key=config.get('api_key', ''),
                    base_url=config.get('base_url'),
                    **{k: v for k, v in config.items() if k not in ['api_key', 'base_url']}
                )
                
                # Test with a simple text generation request
                test_prompt = "Hello, this is a test. Please respond with 'API connection successful'."
                result = provider.generate_text(test_prompt)
                
                if result and len(result.strip()) > 0:
                    return success_response({
                        'success': True,
                        'message': 'Text API connection successful',
                        'test_response': result[:100] + '...' if len(result) > 100 else result
                    })
                else:
                    return error_response("Text generation test failed")
            
        except Exception as e:
            return error_response(f"API test failed: {str(e)}")
        
    except Exception as e:
        logger.error(f"Error testing API: {str(e)}")
        return error_response(f"Test error: {str(e)}")