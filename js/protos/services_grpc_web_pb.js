/**
 * @fileoverview gRPC-Web generated client stub for 
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = require('./services_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.ModelClient =
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
proto.ModelPromiseClient =
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
 *   !proto.VisionClassificationRequest,
 *   !proto.ModelResponse>}
 */
const methodInfo_Model_VisionClassification = new grpc.web.AbstractClientBase.MethodInfo(
  proto.ModelResponse,
  /** @param {!proto.VisionClassificationRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.ModelResponse.deserializeBinary
);


/**
 * @param {!proto.VisionClassificationRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.ModelResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.ModelResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.ModelClient.prototype.visionClassification =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/Model/VisionClassification',
      request,
      metadata || {},
      methodInfo_Model_VisionClassification,
      callback);
};


/**
 * @param {!proto.VisionClassificationRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.ModelResponse>}
 *     A native promise that resolves to the response
 */
proto.ModelPromiseClient.prototype.visionClassification =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/Model/VisionClassification',
      request,
      metadata || {},
      methodInfo_Model_VisionClassification);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.TextGenerationRequest,
 *   !proto.ModelResponse>}
 */
const methodInfo_Model_TextGeneration = new grpc.web.AbstractClientBase.MethodInfo(
  proto.ModelResponse,
  /** @param {!proto.TextGenerationRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.ModelResponse.deserializeBinary
);


/**
 * @param {!proto.TextGenerationRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.ModelResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.ModelResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.ModelClient.prototype.textGeneration =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/Model/TextGeneration',
      request,
      metadata || {},
      methodInfo_Model_TextGeneration,
      callback);
};


/**
 * @param {!proto.TextGenerationRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.ModelResponse>}
 *     A native promise that resolves to the response
 */
proto.ModelPromiseClient.prototype.textGeneration =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/Model/TextGeneration',
      request,
      metadata || {},
      methodInfo_Model_TextGeneration);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.ImageSegmentationRequest,
 *   !proto.ModelResponse>}
 */
const methodInfo_Model_ImageSegmentation = new grpc.web.AbstractClientBase.MethodInfo(
  proto.ModelResponse,
  /** @param {!proto.ImageSegmentationRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.ModelResponse.deserializeBinary
);


/**
 * @param {!proto.ImageSegmentationRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.ModelResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.ModelResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.ModelClient.prototype.imageSegmentation =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/Model/ImageSegmentation',
      request,
      metadata || {},
      methodInfo_Model_ImageSegmentation,
      callback);
};


/**
 * @param {!proto.ImageSegmentationRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.ModelResponse>}
 *     A native promise that resolves to the response
 */
proto.ModelPromiseClient.prototype.imageSegmentation =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/Model/ImageSegmentation',
      request,
      metadata || {},
      methodInfo_Model_ImageSegmentation);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.ImageDownloadRequest,
 *   !proto.ImageDownloadResponse>}
 */
const methodInfo_Model_GetImage = new grpc.web.AbstractClientBase.MethodInfo(
  proto.ImageDownloadResponse,
  /** @param {!proto.ImageDownloadRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.ImageDownloadResponse.deserializeBinary
);


/**
 * @param {!proto.ImageDownloadRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.ImageDownloadResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.ImageDownloadResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.ModelClient.prototype.getImage =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/Model/GetImage',
      request,
      metadata || {},
      methodInfo_Model_GetImage,
      callback);
};


/**
 * @param {!proto.ImageDownloadRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.ImageDownloadResponse>}
 *     A native promise that resolves to the response
 */
proto.ModelPromiseClient.prototype.getImage =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/Model/GetImage',
      request,
      metadata || {},
      methodInfo_Model_GetImage);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.GetModelsReq,
 *   !proto.GetModelsResp>}
 */
const methodInfo_Model_ListModels = new grpc.web.AbstractClientBase.MethodInfo(
  proto.GetModelsResp,
  /** @param {!proto.GetModelsReq} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.GetModelsResp.deserializeBinary
);


/**
 * @param {!proto.GetModelsReq} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.GetModelsResp)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.GetModelsResp>|undefined}
 *     The XHR Node Readable Stream
 */
proto.ModelClient.prototype.listModels =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/Model/ListModels',
      request,
      metadata || {},
      methodInfo_Model_ListModels,
      callback);
};


/**
 * @param {!proto.GetModelsReq} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.GetModelsResp>}
 *     A native promise that resolves to the response
 */
proto.ModelPromiseClient.prototype.listModels =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/Model/ListModels',
      request,
      metadata || {},
      methodInfo_Model_ListModels);
};


module.exports = proto;

