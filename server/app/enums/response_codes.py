from enum import Enum

class Response_codes(Enum):
    CONTACT_SUPPORT = 'contact_support'
    LOGIN_FALIURE = 'login_failure'
    LOGIN_SUCCESSFUL = 'login_successful'
    INVALID_TOKEN = 'invalid_token',
    UNAUTHORIZED = 'unauthorized'
    REAUTHENTICATE = 'reauthenticate'