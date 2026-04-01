from rest_framework.views import exception_handler
from rest_framework.exceptions import APIException
from rest_framework import status


class ServiceException(APIException):
    """Base exception for service layer"""
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = 'A service error occurred.'
    default_code = 'service_error'


class ValidationException(ServiceException):
    """Validation errors in service layer"""
    default_detail = 'Validation error.'
    default_code = 'validation_error'


class NotFoundException(ServiceException):
    """Resource not found"""
    status_code = status.HTTP_404_NOT_FOUND
    default_detail = 'Resource not found.'
    default_code = 'not_found'


class PermissionDeniedException(ServiceException):
    """Permission denied"""
    status_code = status.HTTP_403_FORBIDDEN
    default_detail = 'Permission denied.'
    default_code = 'permission_denied'


class BusinessLogicException(ServiceException):
    """Business logic violations"""
    default_detail = 'Business logic error.'
    default_code = 'business_logic_error'


def custom_exception_handler(exc, context):
    """Custom exception handler for DRF"""
    response = exception_handler(exc, context)
    
    if response is not None:
        custom_response_data = {
            'success': False,
            'error': {
                'message': response.data.get('detail', str(exc)),
                'code': getattr(exc, 'default_code', 'error')
            }
        }
        response.data = custom_response_data
    
    return response
