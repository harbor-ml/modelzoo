import grpc
import typing
from uuid import UUID
from _protos.services_pb2_grpc import ModelStub
from _protos.services_pb2 import (
    AuthenticationRequest,
    RegisterTokenRequest,
    RegisterUserRequest,
    AuthenticationResponse,
    TextGenerationRequest,
    ImageSegmentationRequest,
    VisionClassificationRequest,
    ModelUUIDRequest,
    ModelUUIDResponse,
    ModelResponse,
)
import utils

ModelOutput = typing.NewType(
    "ModelOutput",
    typing.Union[typing.Sequence[str], type(Image), typing.Sequence[dict]],
)


def validate_uuid(token: str) -> bool:
    try:
        token_id = UUID(token, version=4)
    except ValueError:
        return False
    return True


class UserAuth(object):
    def __init__(
        self,
        conn: ModelZooConnection,
        username: typing.Optional[str] = "",
        password: typing.Optional[str] = "",
        token: typing.Optional[str] = "",
        admin: typing.Optional[bool] = True,
    ):
        if token == "":
            if username == "" or password == "":
                raise InsufficientCredentialsException(
                    "Username and Password or Token are required to authenticate."
                )
        self.username = username
        self.password = password
        self.use_token = True
        if token != "" and not validate_uuid(token):
            raise InvalidTokenException("Invalid Token.")
        if token == "":
            self.use_token = False
        else:
            self.token = token

        self.adminF = admin
        self.admin_token = None
        if admin:
            self.admin_token = conn._authenticate(self.username, self.password)
        self.parent = None

    def make(
        self,
        conn: ModelZooConnection,
        username: typing.Optional[str] = "",
        password: typing.Optional[str] = "",
        token: typing.Optional[str] = "",
    ) -> UserAuth:
        if self.username == username and username != "":
            if self.password == password and password != "":
                if self.token == token and token != "":
                    return self
                else:
                    u = UserAuth(
                        conn,
                        username=username,
                        password=password,
                        token=token,
                        admin=False,
                    )
                    u.parent = self
                    return u
        u = UserAuth(conn, username=username, password=password, token=token)
        return u

    @property
    def admin(self):
        if self.adminF:
            return self.admin_token
        if self.parent is None:
            return self.token
        return self.parent.admin


class ModelZooConnection(object):
    def __init__(
        self,
        address: typing.Optional[str] = "grpc.modelzoo.live",
        token: typing.Optional[str] = "",
        username: typing.Optional[str] = "",
        password: typing.Optional[str] = "",
    ):
        self.conn = None
        self.address = address
        self.conn_error = ModelZooConnectionException(
            "Must be connected to ModelZoo instance before issuing requests. Please call connect()."
        )
        try:
            self.auth = UserAuth(
                self, username=username, password=password, token=token
            )
        except AuthenticationException as e:
            self.auth = None

    def connect(self, address: typing.Optional[str] = "grpc.modelzoo.live"):
        self.address = self.address if address is None else address
        channel = grpc.insecure_channel(self.address)
        self.conn = ModelStub(channel)

    def authenticate(
        self,
        username: typing.Optional[str] = "",
        password: typing.Optional[str] = "",
        token: typing.Optional[str] = "",
    ) -> None:
        try:
            self.auth = UserAuth(
                self, username=username, password=password, token=token
            )
        except InsufficientCredentialsException:
            raise ModelZooConnectionException(
                "At least one of [(Username, Password), Token] are required."
            )
        except InvalidTokenException:
            raise ModelZooConnectionException("The token provided is not valid.")

    def _authenticate(self, username: str, password: str) -> str:
        if self.conn is None:
            raise self.conn_error
        resp = self.conn.Authenticate(
            AuthenticationRequest(username=username, password=password)
        )
        if resp.success:
            return resp.token
        else:
            raise ModelZooConnectionException(resp.msg)

    def get_token(self):
        if self.auth is None:
            raise ModelZooConnectionException(
                "Please authenticate before calling this method."
            )
        if self.conn is None:
            raise self.conn_error
        return self.auth.token

    def get_admin_token(self):
        if self.auth is None:
            raise ModelZooConnectionException(
                "Please authenticate before calling this method."
            )
        if self.conn is None:
            raise self.conn_error
        if self.auth.admin_token is None:
            raise ModelZooConnectionException(
                "Please authenticate with username and password to recieve your administrative token."
            )
        return self.auth.admin

    def register_user(self, username: str, password: str, email: str) -> dict:
        if self.conn is None:
            raise self.conn_error
        resp = self.conn.RegisterUser(
            RegisterUserRequest(username=username, password=password, email=email)
        )
        if resp.success:
            return {
                "Username": username,
                "Password": password,
                "Admin Token": resp.token,
            }
        else:
            raise ModelZooConnectionException(resp.msg)

    def register_token(
        self,
        username: typing.Optional[str] = "",
        password: typing.Optional[str] = "",
        token: typing.Optional[str] = "",
    ) -> str:
        if self.conn is None:
            raise self.conn_error
        auth = self.auth.make(self, username=username, password=password, token=token)
        resp = self.conn.RegisterToken(RegisterTokenRequest(adm_token=auth.admin))
        if resp.success:
            print(
                "Created new token %s with no permissions. Please save this somewhere.",
                resp.token,
            )
            return resp.token
        else:
            raise ModelZooConnectionException(resp.msg)

    def get_token_permissions(
        self,
        token,
        username: typing.Optional[str] = "",
        password: typing.Optional[str] = "",
        adm_token: typing.Optional[str] = "",
    ) -> typing.List[dict]:
        if self.conn is None:
            raise self.conn_error
        if not validate_uuid(token):
            raise ModelZooConnectionException("Token %s is invalid.", token)
        auth = self.auth.make(
            self, username=username, password=password, token=adm_token
        )
        resp = self.conn.GetPermissions(
            GetTokenPermissionsRequest(adm_token=auth.admin, token=token)
        )
        return resp.models

    def set_token_permissions(
        self,
        token,
        models: typing.List[dict],
        username: typing.Optional[str] = "",
        password: typing.Optional[str] = "",
        adm_token: typing.Optional[str] = "",
    ) -> bool:
        if self.conn is None:
            raise self.conn_error
        if not validate_uuid(token):
            raise ModelZooConnectionException("Token %s is invalid.", token)
        auth = self.auth.make(
            self, username=username, password=password, token=adm_token
        )
        models = [
            {
                "token": a["token"]
                if "token" in a
                else self._query_for_model_uuid(a["name"], auth.admin),
                "remove": a["remove"],
            }
            for a in models
        ]
        resp = self.conn.SetPermissions(
            SetTokenPermissionsRequest(
                adm_token=adm_token,
                token=token,
                models=[
                    SetTokenPermissionsRequest.ModelPermissions(
                        model_uuid=a["uuid"], remove=a["remove"]
                    )
                    for a in models
                ],
            )
        )

    def query_for_model_uuid(
        self,
        model: str,
        authP: typing.Optional[UserAuth] = None,
        username: typing.Optional[str] = "",
        password: typing.Optional[str] = "",
        adm_token: typing.Optional[str] = "",
    ) -> str:
        if self.conn is None:
            raise self.conn_error
        auth = (
            self.auth.make(self, username=username, password=password, token=adm_token)
            if auth is None
            else authP
        )
        req = ModelUUIDRequest(model_name=model, token=auth.admin)
        resp = self.conn.ModelUUID(req)
        if resp.model_uuid == "":
            raise ModelZooConnectionException(
                "Model %s does not exist, or you are not allowed to access it.", model
            )
        return resp.model_uuid

    def query_text(
        self,
        input_phrase: typing.Union[str, typing.Sequence[str]],
        temp: float,
        model: str,
        token: str,
        username: typing.Optional[str] = "",
        password: typing.Optional[str] = "",
        adm_token: typing.Optional[str] = "",
        postprocess: typing.Optional[bool] = True,
        cb: typing.Optional[typing.Callable] = None,
    ) -> typing.Sequence[typing.Union[ModelOutput, typing.Any]]:
        if self.conn is None:
            raise self.conn_error
        auth = self.auth.make(
            self, username=username, password=password, token=adm_token
        )
        input_phrase = (
            input_phrase if isinstance(input_phrase, list) else [input_phrase]
        )
        results = []
        for inp in input_phrase:
            req = self.create_text_gen_req(inp, temp, model, auth.token)
            resp = self.conn.TextGeneration(req)
            results.append(self.process(resp, cb) if postprocess else resp)
        return results

    def query_vision(
        self,
        input_image: typing.Union[utils.ImgLike, typing.Sequence[utils.ImgLike]],
        model: str,
        token: str,
        num_returns: typing.Optional[int] = 3,
        username: typing.Optional[str] = "",
        password: typing.Optional[str] = "",
        adm_token: typing.Optional[str] = "",
        postprocess: typing.Optional[bool] = True,
        cb: typing.Optional[typing.Callable] = None,
    ) -> typing.Sequence[typing.Union[ModelOutput, typing.Any]]:
        if self.conn is None:
            raise self.conn_error
        auth = self.auth.make(
            self, username=username, password=password, token=adm_token
        )
        input_image = input_image if isinstance(input_image, list) else [input_image]
        results = []
        for inp in input_image:
            req = self.create_vision_gen_req(inp, model, auth.token, num_returns)
            resp = self.conn.VisionClassification(req)
            results.append(self.process(resp, cb) if postprocess else resp)
        return results

    def query_segmentation(
        self,
        input_image: typing.Union[utils.ImgLike, typing.Sequence[utils.ImgLike]],
        model: str,
        token: str,
        username: typing.Optional[str] = "",
        password: typing.Optional[str] = "",
        adm_token: typing.Optional[str] = "",
        postprocess: typing.Optional[bool] = True,
        cb: typing.Optional[typing.Callable] = None,
    ) -> typing.Sequence[typing.Union[ModelOutput, typing.Any]]:
        if self.conn is None:
            raise self.conn_error
        auth = self.auth.make(
            self, username=username, password=password, token=adm_token
        )
        input_image = input_image if isinstance(input_image, list) else [input_image]
        results = []
        for inp in input_image:
            req = self.create_image_seg_req(inp, model, token)
            resp = self.conn.ImageSegmentation(req)
            results.append(self.process(resp, cb) if postprocess else resp)
        return results

    def create_text_gen_req(
        self,
        input_phrase: str,
        temp: float,
        model: str,
        authP: typing.Optional[UserAuth] = None,
        username: typing.Optional[str] = "",
        password: typing.Optional[str] = "",
        adm_token: typing.Optional[str] = "",
    ) -> TextGenerationRequest:
        if self.conn is None:
            raise self.conn_error
        auth = (
            self.auth.make(self, username=username, password=password, token=adm_token)
            if authP is None
            else authP
        )
        uuid = self.query_for_model_uuid(model, authP=auth)
        return TextGenerationRequest(
            input_phrase=input_phrase,
            temperature=temp,
            model_uuid=uuid,
            token=auth.otken,
        )

    def create_vision_gen_req(
        self,
        input_image: utils.ImgLike,
        model: str,
        num_returns: typing.Optional[int] = 3,
        authP: typing.Optional[UserAuth] = None,
        username: typing.Optional[str] = "",
        password: typing.Optional[str] = "",
        adm_token: typing.Optional[str] = "",
    ) -> VisionClassificationRequest:
        if self.conn is None:
            raise self.conn_error
        auth = (
            self.auth.make(self, username=username, password=password, token=adm_token)
            if authP is None
            else authP
        )
        uuid = self.query_for_model_uuid(model, authP=auth)
        input_image = utils._img_inp_types_to_uri(input_image)
        return VisionClassificationRequest(
            input_image=input_image,
            num_returns=num_returns,
            model_uuid=uuid,
            token=auth.token,
        )

    def create_image_seg_req(
        self,
        input_image: utils.ImgLike,
        model: str,
        authP: typing.Optional[UserAuth] = None,
        username: typing.Optional[str] = "",
        password: typing.Optional[str] = "",
        adm_token: typing.Optional[str] = "",
    ) -> ImageSegmentationRequest:
        if self.conn is None:
            raise self.conn_error
        auth = (
            self.auth.make(self, username=username, password=password, token=adm_token)
            if authP is None
            else authP
        )
        uuid = self.query_for_model_uuid(model, authP=auth)
        input_image = utils._img_inp_types_to_uri(input_image)
        return ImageSegmentationRequest(
            input_image=input_image, model_uuid=uuid, token=auth.token
        )

    def process(
        self, resp: ModelResponse, cb: typing.Optional[typing.Callable] = None
    ) -> typing.Union[ModelOutput, typing.Any]:
        if resp.typeString == "text":
            return (
                resp.text.generated_texts
                if cb is None
                else cb(resp.text.generated_texts)
            )
        elif resp.typeString == "segment":
            return (
                utils.uri_to_img(resp.segment.output_image)
                if cb is None
                else cb(resp.segment.output_image)
            )
        elif resp.typeString == "vision":
            r = []
            for res in resp.vision.results:
                r += [
                    {
                        "Rank": res.rank,
                        "Category": res.category,
                        "Confidence": res.proba,
                    }
                ]
            return r if cb is None else cb(r)
        return ["Invalid Response"]


class AuthenticationException(Exception):
    pass


class InvalidTokenException(AuthenticationException):
    pass


class InsufficientCredentialsException(AuthenticationException):
    pass


class ModelZooConnectionException(Exception):
    pass
