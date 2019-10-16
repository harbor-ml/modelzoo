from typing import Any, Callable, List, Optional

import grpc
import pandas as pd

import modelzoo.utils as utils
from modelzoo.exceptions import (AuthenticationException,
                                 InvalidCredentialsException,
                                 ModelZooConnectionException)
from modelzoo.sugar import image_input, table_output, text_input, table_input
from modelzoo.protos.services_pb2 import (Empty, Image, Payload, PayloadType,
                                          RateLimitToken, Status, Table, Text,
                                          User)
from modelzoo.protos.services_pb2_grpc import ModelzooServiceStub
from google.protobuf import json_format


class ModelZooConnection(object):
    """
    ModelZooConnection class. This class will be the main client API for connecting to a ModelZoo instance, whether it be a local or external one.
    This class manages authentication, and features several bound methods to aid the user in creation and manipulation of users and models.

    Attributes
    ----------
    address : Optional[string]
        This is the address of the ModelZoo instance to connect to.
    email : Optional[string]
        The email with which to authenticate to the ModelZoo instance.
        password : Optional[string]: The password with which to authenticate to the ModelZoo instance.
    conn : GRPC Channel
        The connection to the ModelZoo instance. The connect() method must be called to instantiate this.
            Before this is instantiated, most methods will fail.
    token : string
        The token to use for rate limiting and potentially access control in the future.
    conn_error : ModelZooConnectionException
        A shorthand for the connection exception to be raised whenever a method is called before a connection
            to the ModelZoo instance has been instantiated.
    authenticated : bool
        Flag that indicates whether or not user has authenticated. Can be used to block access to creation or manipulation of models.
    """

    def __init__(
        self,
        address: Optional[str] = None,
        email: Optional[str] = "",
        password: Optional[str] = "",
    ):
        self.conn = None
        self.authenticated = False
        self.token = None
        self.address = address
        self.conn_error = ModelZooConnectionException(
            "Must be connected to ModelZoo instance before issuing requests. Please call connect()."
        )
        self.email = email
        self.password = password
        if self.address is not None:
            self.connect(address=self.address)

    def connect(self, address: str) -> None:
        """
        Method to connect to the ModelZoo instance specified by self.address | address.
        Must be called first, so that later methods have a connection to the server to perform queries.
        If a username and email were not provided previously, an incognito rate limiting token is generated for the user.

        Parameters
        ----------
        address : string
            This is the address of the ModelZoo instance to connect to.

        Raises
        ------
        InvalidCredentialException
            If the user previously provided an email and password, authentication is attempted.
            If the authentication details are invalid, an InvalidCredentialException is raised.
        """
        self.address = address if self.address is None else self.address
        channel = grpc.insecure_channel(self.address)
        self.conn = ModelzooServiceStub(channel)
        if self.email != "" and self.password != "":
            self.authenticate(self.email, self.password)
        self.token = self.conn.GetToken(Empty()).token

    def authenticate(self, email: str, password: str) -> None:
        """
        Method to authenticate. Allows user to retrieve their token from the database.

        Parameters
        ----------
        email : str
            email with which to authenticate.
        password : str
            password with which to authenticate.
        
        Raises
        ------
        InvalidCredentialException
            If the (email, password) tuple does not match any in the database of users,
            an InvalidCredentialException is raised.
        """
        if self.conn is None:
            raise self.conn_error
        try:
            self.conn.GetUser(User(email=email, password=password))
        except Exception:
            raise InvalidCredentialsException(
                "Email and password do not match an existing user. Please check to make sure you have not made any typos."
            )
        self.authenticated = True

    def get_token(self) -> str:
        """
        Returns the users token. User must be authenticated and connected.

        Raises
        ------
        ModelZooConnectionException
            If the user is not connected, a ModelZooConnectionException will be raised.
        AuthenticationException
            If the user has not authenticated, a AuthenticationException is raised.
        """
        if self.conn is None:
            raise self.conn_error
        if not self.authenticated:
            raise AuthenticationException(
                "You are not currently authenticated. Please call authenticate() to recieve your token."
            )
        return self.token

    def create_user(self, email: str, password: str) -> None:
        """
        Method to create user. Current user must be connected to ModelZoo instance prior to this method call.

        Parameters
        ----------
        email : str
            The email for the new user.
        password : str
            The password for the new user.
        
        Raises
        ------
        ModelZooConnectionException
            A ModelZooConnectionException is raised in two cases:
                1) The user is not currently connected to a ModelZoo instance.
                2) Creation of the new user failed.
            The error message for the exception will contain information as to which of the cases it is.
        """
        if self.conn is None:
            raise self.conn_error
        try:
            self.conn.CreateUser(User(email=email, password=password))
        except Exception:
            raise ModelZooConnectionException("Failed to create user.")

    def list_all_models(self, expand_metadata: Optional[bool] = False) -> pd.DataFrame:
        """
        Lists all models.

        Parameters
        ----------
        expand_metadata: Optional[bool]
            Whether to return a DataFrame with a metadata column containing a
            a JSON string consisting of metadata key/value pairs, or to expand
            to a DataFrame indexed by modelname with metadata expanded to columns.

        Return
        ------
        pd.DataFrame
            A dataframe of the models currently registered.
        """
        if self.conn is None:
            raise self.conn_error
        resp = self.conn.ListModels(Empty())
        if not expand_metadata:
            return pd.DataFrame(json_format.MessageToDict(resp)['models'])
        else:
            frames = []
            for g in json_format.MessageToDict(resp)['models']:
                p = pd.DataFrame(g['metadata'])
                p.index = [g['modelName']]*len(p)
                frames.append(p)
            g = pd.concat(frames)
            return g.set_index([g.index, 'key'])

    def text_inference(self, model: str, texts: List[str]) -> Payload:
        """
        Method to perform text inference.

        Parameters
        ----------
        texts : List[str]
            Batch of text inputs to provide to model.
        model : str
            Name of model to forward request to.
        
        Returns
        -------
        Payload
            The payload response from the ModelZoo instance.

        Raises
        ------
        ModelZooConnectionException
            A ModelZooConnectionException is raised if the user is not connected to a ModelZoo instance.
        """
        if self.conn is None:
            raise self.conn_error
        text_payload = Text(texts=texts, model_name=model, access_token=self.token)
        request = Payload(type=PayloadType.TEXT, text=text_payload)
        return self.conn.Inference(request)

    def image_inference(self, model: str, image: utils.ImgLike) -> Payload:
        """
        Method to perform image inference.

        Parameters
        ----------
        image : utils.ImgLike (oneof(image filename, PIL.Image, image URI))
            Image input to provide to model.
        model : str
            Name of model to forward request to.
        
        Returns
        -------
        Payload
            The payload response from the ModelZoo instance.

        Raises
        ------
        ModelZooConnectionException
            A ModelZooConnectionException is raised if the user is not connected to a ModelZoo instance.
        """
        if self.conn is None:
            raise self.conn_error
        image_payload = Image(
            image_data_url=utils.image_input_types_to_uri(image),
            model_name=model,
            access_token=self.token,
        )
        request = Payload(type=PayloadType.IMAGE, image=image_payload)
        return self.conn.Inference(request)

    def tabular_inference(self, model: str, table: pd.DataFrame) -> Payload:
        """
        Method to perform tabular inference.

        Parameters
        ----------
        table : pd.DataFrame
            Tabular input to provide to model.
        model : str
            Name of model to forward request to.
        
        Returns
        -------
        Payload
            The payload response from the ModelZoo instance.

        Raises
        ------
        ModelZooConnectionException
            A ModelZooConnectionException is raised if the user is not connected to a ModelZoo instance.
        """
        if self.conn is None:
            raise self.conn_error
        table_payload = table_output(table)
        table_payload.model_name = model
        table_payload.access_token = self.token
        request = Payload(type=PayloadType.TABLE, table=table_payload)
        return self.conn.Inference(request)

    def process_inference_response(
        self, resp: Payload, callback: Optional[Callable] = None
    ) -> Any:
        """
        Method to process inference responses.

        Parameters
        ----------
        resp : Payload
            The Payload returned by one of the inference methods.
        callback : Optional[Callable]
            The callback to pass the outputs to for further postprocessing.

        Returns
        -------
        oneof({Any, Payload})
            Either the raw outputs, or the results of calling the callback on them.

        Raises
        ------
        ModelZooConnectionException
            A ModelZooConnectionException is called in one case:
                1) The Payload contains a type besides oneof(text, image). This is likely a sign that the Payload was not produced
                    by an inference method.
        """
        if resp.type == PayloadType.TEXT:
            texts = text_input(resp.text)
            if callback is None:
                return texts
            else:
                return callback(texts)
        elif resp.type == PayloadType.IMAGE:
            image = image_input(resp.image)
            if callback is None:
                return image
            else:
                return callback(image)
        elif resp.type == PayloadType.TABLE:
            table = table_input(resp.table)
            if callback is None:
                return table
            else:
                return callback(table)
        else:
            raise ModelZooConnectionException(
                "Payload type does not match known values. Please ensure that your packet is not corrupted."
            )
