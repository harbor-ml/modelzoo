class ModelZooConnectionException(Exception):
    """
    Class that encapsulates all ModelZoo Exceptions. Any exception raised by the ModelZooConnection object is either of this type, or a subtype of this type.
    """

    pass


class AuthenticationException(ModelZooConnectionException):
    """
    Child class of the ModelZooConnectionException. It provides a useful abstraction for the set of Authentication Errors.
    """

    pass


class InvalidCredentialsException(AuthenticationException):
    """
    Child class of the AuthenticationException. This exception will be raised whenever a user tries to authenticate with an (email, password) tuple that does not correspond to an existing user.
    """

    pass
