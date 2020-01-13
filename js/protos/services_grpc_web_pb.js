/**
 * @fileoverview gRPC-Web generated client stub for modelzoo
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');


var google_api_annotations_pb = require('../google/api/annotations_pb.js')

var protos_model_apis_pb = require('../protos/model_apis_pb.js')
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

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.modelzoo.Payload,
 *   !proto.modelzoo.Payload>}
 */
const methodDescriptor_ModelzooService_Inference = new grpc.web.MethodDescriptor(
  '/modelzoo.ModelzooService/Inference',
  grpc.web.MethodType.UNARY,
  proto.modelzoo.Payload,
  proto.modelzoo.Payload,
  /**
   * @param {!proto.modelzoo.Payload} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.modelzoo.Payload.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.modelzoo.Payload,
 *   !proto.modelzoo.Payload>}
 */
const methodInfo_ModelzooService_Inference = new grpc.web.AbstractClientBase.MethodInfo(
  proto.modelzoo.Payload,
  /**
   * @param {!proto.modelzoo.Payload} request
   * @return {!Uint8Array}
   */
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
      methodDescriptor_ModelzooService_Inference,
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
      methodDescriptor_ModelzooService_Inference);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.modelzoo.ImageDownloadRequest,
 *   !proto.modelzoo.ImageDownloadResponse>}
 */
const methodDescriptor_ModelzooService_GetImage = new grpc.web.MethodDescriptor(
  '/modelzoo.ModelzooService/GetImage',
  grpc.web.MethodType.UNARY,
  proto.modelzoo.ImageDownloadRequest,
  proto.modelzoo.ImageDownloadResponse,
  /**
   * @param {!proto.modelzoo.ImageDownloadRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.modelzoo.ImageDownloadResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.modelzoo.ImageDownloadRequest,
 *   !proto.modelzoo.ImageDownloadResponse>}
 */
const methodInfo_ModelzooService_GetImage = new grpc.web.AbstractClientBase.MethodInfo(
  proto.modelzoo.ImageDownloadResponse,
  /**
   * @param {!proto.modelzoo.ImageDownloadRequest} request
   * @return {!Uint8Array}
   */
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
      methodDescriptor_ModelzooService_GetImage,
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
      methodDescriptor_ModelzooService_GetImage);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.modelzoo.Empty,
 *   !proto.modelzoo.MetricItems>}
 */
const methodDescriptor_ModelzooService_GetMetrics = new grpc.web.MethodDescriptor(
  '/modelzoo.ModelzooService/GetMetrics',
  grpc.web.MethodType.UNARY,
  proto.modelzoo.Empty,
  proto.modelzoo.MetricItems,
  /**
   * @param {!proto.modelzoo.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.modelzoo.MetricItems.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.modelzoo.Empty,
 *   !proto.modelzoo.MetricItems>}
 */
const methodInfo_ModelzooService_GetMetrics = new grpc.web.AbstractClientBase.MethodInfo(
  proto.modelzoo.MetricItems,
  /**
   * @param {!proto.modelzoo.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.modelzoo.MetricItems.deserializeBinary
);


/**
 * @param {!proto.modelzoo.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.modelzoo.MetricItems)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.modelzoo.MetricItems>|undefined}
 *     The XHR Node Readable Stream
 */
proto.modelzoo.ModelzooServiceClient.prototype.getMetrics =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/modelzoo.ModelzooService/GetMetrics',
      request,
      metadata || {},
      methodDescriptor_ModelzooService_GetMetrics,
      callback);
};


/**
 * @param {!proto.modelzoo.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.modelzoo.MetricItems>}
 *     A native promise that resolves to the response
 */
proto.modelzoo.ModelzooServicePromiseClient.prototype.getMetrics =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/modelzoo.ModelzooService/GetMetrics',
      request,
      metadata || {},
      methodDescriptor_ModelzooService_GetMetrics);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.modelzoo.Empty,
 *   !proto.modelzoo.RateLimitToken>}
 */
const methodDescriptor_ModelzooService_GetToken = new grpc.web.MethodDescriptor(
  '/modelzoo.ModelzooService/GetToken',
  grpc.web.MethodType.UNARY,
  proto.modelzoo.Empty,
  proto.modelzoo.RateLimitToken,
  /**
   * @param {!proto.modelzoo.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.modelzoo.RateLimitToken.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.modelzoo.Empty,
 *   !proto.modelzoo.RateLimitToken>}
 */
const methodInfo_ModelzooService_GetToken = new grpc.web.AbstractClientBase.MethodInfo(
  proto.modelzoo.RateLimitToken,
  /**
   * @param {!proto.modelzoo.Empty} request
   * @return {!Uint8Array}
   */
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
      methodDescriptor_ModelzooService_GetToken,
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
      methodDescriptor_ModelzooService_GetToken);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.modelzoo.Empty,
 *   !proto.modelzoo.ListModelsResponse>}
 */
const methodDescriptor_ModelzooService_ListModels = new grpc.web.MethodDescriptor(
  '/modelzoo.ModelzooService/ListModels',
  grpc.web.MethodType.UNARY,
  proto.modelzoo.Empty,
  proto.modelzoo.ListModelsResponse,
  /**
   * @param {!proto.modelzoo.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.modelzoo.ListModelsResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.modelzoo.Empty,
 *   !proto.modelzoo.ListModelsResponse>}
 */
const methodInfo_ModelzooService_ListModels = new grpc.web.AbstractClientBase.MethodInfo(
  proto.modelzoo.ListModelsResponse,
  /**
   * @param {!proto.modelzoo.Empty} request
   * @return {!Uint8Array}
   */
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
      methodDescriptor_ModelzooService_ListModels,
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
      methodDescriptor_ModelzooService_ListModels);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.modelzoo.User,
 *   !proto.modelzoo.Empty>}
 */
const methodDescriptor_ModelzooService_CreateUser = new grpc.web.MethodDescriptor(
  '/modelzoo.ModelzooService/CreateUser',
  grpc.web.MethodType.UNARY,
  proto.modelzoo.User,
  proto.modelzoo.Empty,
  /**
   * @param {!proto.modelzoo.User} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.modelzoo.Empty.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.modelzoo.User,
 *   !proto.modelzoo.Empty>}
 */
const methodInfo_ModelzooService_CreateUser = new grpc.web.AbstractClientBase.MethodInfo(
  proto.modelzoo.Empty,
  /**
   * @param {!proto.modelzoo.User} request
   * @return {!Uint8Array}
   */
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
      methodDescriptor_ModelzooService_CreateUser,
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
      methodDescriptor_ModelzooService_CreateUser);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.modelzoo.Model,
 *   !proto.modelzoo.Empty>}
 */
const methodDescriptor_ModelzooService_CreateModel = new grpc.web.MethodDescriptor(
  '/modelzoo.ModelzooService/CreateModel',
  grpc.web.MethodType.UNARY,
  proto.modelzoo.Model,
  proto.modelzoo.Empty,
  /**
   * @param {!proto.modelzoo.Model} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.modelzoo.Empty.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.modelzoo.Model,
 *   !proto.modelzoo.Empty>}
 */
const methodInfo_ModelzooService_CreateModel = new grpc.web.AbstractClientBase.MethodInfo(
  proto.modelzoo.Empty,
  /**
   * @param {!proto.modelzoo.Model} request
   * @return {!Uint8Array}
   */
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
      methodDescriptor_ModelzooService_CreateModel,
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
      methodDescriptor_ModelzooService_CreateModel);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.modelzoo.User,
 *   !proto.modelzoo.Empty>}
 */
const methodDescriptor_ModelzooService_GetUser = new grpc.web.MethodDescriptor(
  '/modelzoo.ModelzooService/GetUser',
  grpc.web.MethodType.UNARY,
  proto.modelzoo.User,
  proto.modelzoo.Empty,
  /**
   * @param {!proto.modelzoo.User} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.modelzoo.Empty.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.modelzoo.User,
 *   !proto.modelzoo.Empty>}
 */
const methodInfo_ModelzooService_GetUser = new grpc.web.AbstractClientBase.MethodInfo(
  proto.modelzoo.Empty,
  /**
   * @param {!proto.modelzoo.User} request
   * @return {!Uint8Array}
   */
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
      methodDescriptor_ModelzooService_GetUser,
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
      methodDescriptor_ModelzooService_GetUser);
};


module.exports = proto.modelzoo;

