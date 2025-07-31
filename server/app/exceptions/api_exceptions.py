# 'Exception' means this class inherits from Python's built-in Exception class so it behaves like an exception and can thus be raised and caught.
class InvalidUsage(Exception):
    """Custom exception for API errors with custom messages and status codes. """

    # Constructor method 
    def __init__(self, message, status_code=400, payload=None):
        # Calls the constructor of the parent class (Exception). Passes 'message' to the base 'Exception' so the message will show when printed. 
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.payload = payload or {}

    # Converts exception details into a dictionary. 
    def to_dict(self):
        # Creates a new dictionary called response, copying all key-value pairs from the payload dictionary. Important because this does not modify the original payload dictionary directly. 
        response = dict(self.payload)
        # Adds a 'message' key to the response dictionary, setting its fvalue to the error message stored in self.message. 
        response['message'] = self.message
        return response 