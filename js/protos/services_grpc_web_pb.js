/**
 * @fileoverview gRPC-Web generated client stub for modelzoo
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.modelzoo = require('./services_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.modelzoo.ModelzooServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.modelzoo.ModelzooServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.modelzoo.Payload,
 *   !proto.modelzoo.Payload>}
 */
const methodInfo_ModelzooService_Inference = new grpc.web.AbstractClientBase.MethodInfo(
  proto.modelzoo.Payload,
  /** @param {!proto.modelzoo.Payload} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.modelzoo.Payload.deserializeBinary
);


/**
 * @param {!proto.modelzoo.Payload} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.modelzoo.Payload)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.modelzoo.Payload>|undefined}
 *     The XHR Node Readable Stream
 */
proto.modelzoo.ModelzooServiceClient.prototype.inference =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/modelzoo.ModelzooService/Inference',
      request,
      metadata || {},
      methodInfo_ModelzooService_Inference,
      callback);
};


/**
 * @param {!proto.modelzoo.Payload} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.modelzoo.Payload>}
 *     A native promise that resolves to the response
 */
proto.modelzoo.ModelzooServicePromiseClient.prototype.inference =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/modelzoo.ModelzooService/Inference',
      request,
      metadata || {},
      methodInfo_ModelzooService_Inference);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.modelzoo.ImageDownloadRequest,
 *   !proto.modelzoo.ImageDownloadResponse>}
 */
const methodInfo_ModelzooService_GetImage = new grpc.web.AbstractClientBase.MethodInfo(
  proto.modelzoo.ImageDownloadResponse,
  /** @param {!proto.modelzoo.ImageDownloadRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.modelzoo.ImageDownloadResponse.deserializeBinary
);


/**
 * @param {!proto.modelzoo.ImageDownloadRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.modelzoo.ImageDownloadResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.modelzoo.ImageDownloadResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.modelzoo.ModelzooServiceClient.prototype.getImage =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/modelzoo.ModelzooService/GetImage',
      request,
      metadata || {},
      methodInfo_ModelzooService_GetImage,
      callback);
};


/**
 * @param {!proto.modelzoo.ImageDownloadRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.modelzoo.ImageDownloadResponse>}
 *     A native promise that resolves to the response
 */
proto.modelzoo.ModelzooServicePromiseClient.prototype.getImage =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/modelzoo.ModelzooService/GetImage',
      request,
      metadata || {},
      methodInfo_ModelzooService_GetImage);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.modelzoo.Empty,
 *   !proto.modelzoo.RateLimitToken>}
 */
const methodInfo_ModelzooService_GetToken = new grpc.web.AbstractClientBase.MethodInfo(
  proto.modelzoo.RateLimitToken,
  /** @param {!proto.modelzoo.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.modelzoo.RateLimitToken.deserializeBinary
);


/**
 * @param {!proto.modelzoo.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.modelzoo.RateLimitToken)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.modelzoo.RateLimitToken>|undefined}
 *     The XHR Node Readable Stream
 */
proto.modelzoo.ModelzooServiceClient.prototype.getToken =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/modelzoo.ModelzooService/GetToken',
      request,
      metadata || {},
      methodInfo_ModelzooService_GetToken,
      callback);
};


/**
 * @param {!proto.modelzoo.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.modelzoo.RateLimitToken>}
 *     A native promise that resolves to the response
 */
proto.modelzoo.ModelzooServicePromiseClient.prototype.getToken =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/modelzoo.ModelzooService/GetToken',
      request,
      metadata || {},
      methodInfo_ModelzooService_GetToken);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.modelzoo.Empty,
 *   !proto.modelzoo.ListModelsResponse>}
 */
const methodInfo_ModelzooService_ListModels = new grpc.web.AbstractClientBase.MethodInfo(
  proto.modelzoo.ListModelsResponse,
  /** @param {!proto.modelzoo.Empty} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.modelzoo.ListModelsResponse.deserializeBinary
);


/**
 * @param {!proto.modelzoo.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.modelzoo.ListModelsResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.modelzoo.ListModelsResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.modelzoo.ModelzooServiceClient.prototype.listModels =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/modelzoo.ModelzooService/ListModels',
      request,
      metadata || {},
      methodInfo_ModelzooService_ListModels,
      callback);
};


/**
 * @param {!proto.modelzoo.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.modelzoo.ListModelsResponse>}
 *     A native promise that resolves to the response
 */
proto.modelzoo.ModelzooServicePromiseClient.prototype.listModels =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/modelzoo.ModelzooService/ListModels',
      request,
      metadata || {},
      methodInfo_ModelzooService_ListModels);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.modelzoo.User,
 *   !proto.modelzoo.Empty>}
 */
const methodInfo_ModelzooService_CreateUser = new grpc.web.AbstractClientBase.MethodInfo(
  proto.modelzoo.Empty,
  /** @param {!proto.modelzoo.User} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.modelzoo.Empty.deserializeBinary
);


/**
 * @param {!proto.modelzoo.User} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.modelzoo.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.modelzoo.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.modelzoo.ModelzooServiceClient.prototype.createUser =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/modelzoo.ModelzooService/CreateUser',
      request,
      metadata || {},
      methodInfo_ModelzooService_CreateUser,
      callback);
};


/**
 * @param {!proto.modelzoo.User} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.modelzoo.Empty>}
 *     A native promise that resolves to the response
 */
proto.modelzoo.ModelzooServicePromiseClient.prototype.createUser =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/modelzoo.ModelzooService/CreateUser',
      request,
      metadata || {},
      methodInfo_ModelzooService_CreateUser);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.modelzoo.Model,
 *   !proto.modelzoo.Empty>}
 */
const methodInfo_ModelzooService_CreateModel = new grpc.web.AbstractClientBase.MethodInfo(
  proto.modelzoo.Empty,
  /** @param {!proto.modelzoo.Model} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.modelzoo.Empty.deserializeBinary
);


/**
 * @param {!proto.modelzoo.Model} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.modelzoo.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.modelzoo.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.modelzoo.ModelzooServiceClient.prototype.createModel =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/modelzoo.ModelzooService/CreateModel',
      request,
      metadata || {},
      methodInfo_ModelzooService_CreateModel,
      callback);
};


/**
 * @param {!proto.modelzoo.Model} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.modelzoo.Empty>}
 *     A native promise that resolves to the response
 */
proto.modelzoo.ModelzooServicePromiseClient.prototype.createModel =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/modelzoo.ModelzooService/CreateModel',
      request,
      metadata || {},
      methodInfo_ModelzooService_CreateModel);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.modelzoo.User,
 *   !proto.modelzoo.Empty>}
 */
const methodInfo_ModelzooService_GetUser = new grpc.web.AbstractClientBase.MethodInfo(
  proto.modelzoo.Empty,
  /** @param {!proto.modelzoo.User} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.modelzoo.Empty.deserializeBinary
);


/**
 * @param {!proto.modelzoo.User} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.modelzoo.Empty)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.modelzoo.Empty>|undefined}
 *     The XHR Node Readable Stream
 */
proto.modelzoo.ModelzooServiceClient.prototype.getUser =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/modelzoo.ModelzooService/GetUser',
      request,
      metadata || {},
      methodInfo_ModelzooService_GetUser,
      callback);
};


/**
 * @param {!proto.modelzoo.User} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.modelzoo.Empty>}
 *     A native promise that resolves to the response
 */
proto.modelzoo.ModelzooServicePromiseClient.prototype.getUser =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/modelzoo.ModelzooService/GetUser',
      request,
      metadata || {},
      methodInfo_ModelzooService_GetUser);
};


module.exports = proto.modelzoo;

